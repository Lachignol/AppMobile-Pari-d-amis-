package scheduler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/adatechschool/projet-mobile-pari_damis/database"
	"github.com/adatechschool/projet-mobile-pari_damis/models"

	// "github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type SportEvent struct {
	SportEventId string `json:"id"`
}

type SportEventStatus struct {
	Status           string `json:"status"`
	MatchStatus      string `json:"match_status"`
	WinnerID         string `json:"winner_id"`
	FinalRound       int    `json:"final_round"`
	FinalRoundLength string `json:"final_round_length"`
	Method           string `json:"method"`
	Winner           string `json:"winner"`
	ScheduledLength  int    `json:"scheduled_length"`
	WeightClass      string `json:"weight_class"`
	TitleFight       bool   `json:"title_fight"`
	MainEvent        bool   `json:"main_event"`
}

type Summary struct {
	SportEvent       SportEvent       `json:"sport_event"`
	SportEventStatus SportEventStatus `json:"sport_event_status"`
}

type Response struct {
	GeneratedAt string    `json:"generated_at"`
	Summaries   []Summary `json:"summaries"`
}

func Match() (string, error) {
	url := fmt.Sprintf("https://api.sportradar.com/mma/trial/v2/fr/schedules/2024-02-04/summaries.json?api_key=%s", os.Getenv("APIKEY"))
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
		return "", err
	}
	// fmt.Println(resp)
	defer resp.Body.Close()

	var responseData Response

	decoder := json.NewDecoder(resp.Body)
	err = decoder.Decode(&responseData)
	if err != nil {
		log.Fatalln(err)
		return "", err
	}
	// Result = string(data)
	fmt.Println("In Match function")
	// fmt.Println(Result)
	var Bets []models.Bet

	for _, summary := range responseData.Summaries {
		// fmt.Printf("Statut de l'événement sportif : %s\n", summary.SportEvent.SportEventId)
		if summary.SportEventStatus.Status == "cancelled" {
			matchcancelled := "Match cancelled"
			resultofbet := models.ResultOfBet{
				MatchCancelled: &matchcancelled,
				MatchID:        summary.SportEvent.SportEventId,
			}
			database.DB.Where("Match_id = ? AND result_of_bet_id IS NULL", summary.SportEvent.SportEventId).Find(&Bets)
			//appliqué un filter sur &bet qui selectionne touts les bets ou les resultofbet sont inexistants
			for _, Bet := range Bets {
				fmt.Printf("If bet cancelled exist show it:%v", Bet)
				database.DB.Model(&Bet).Association("ResultOfBet").Append(&resultofbet)

			}
		}
		if summary.SportEventStatus.Status == "closed" {
			// fmt.Printf("Gagnant du combat : %s\n", summary.SportEventStatus.Winner)
			// fmt.Printf("Type de victoire : %s\n", summary.SportEventStatus.Method)
			// fmt.Printf("Nombre de round : %v\n", summary.SportEventStatus.FinalRound)

			var methodFinish string
			var winner string
			if summary.SportEventStatus.Winner == "home_team" {
				winner = "1"
			}
			if summary.SportEventStatus.Winner == "away_team" {
				winner = "2"
			}
			// if summary.SportEventStatus.Winner == "draw?"{
			// 	winner = "draw?"
			// }
			if summary.SportEventStatus.Method == "ko_tko" {
				methodFinish = "KoTko"
			}
			if summary.SportEventStatus.Method == "submission" {
				methodFinish = "Soumission"
			}
			if summary.SportEventStatus.Method == "decision_split" || summary.SportEventStatus.Method == "decision_unanimous" || summary.SportEventStatus.Method == "decision_majority" {
				methodFinish = "Points"
			}
			var resultTab pq.StringArray
			resultTab = []string{winner, methodFinish, strconv.Itoa(summary.SportEventStatus.FinalRound)}
			resultofbet := models.ResultOfBet{
				ResultTab: &resultTab,
				MatchID:   summary.SportEvent.SportEventId,
			}

			database.DB.Where("Match_id = ? AND result_of_bet_id IS NULL", summary.SportEvent.SportEventId).Find(&Bets)
			for _, Bet := range Bets {
				fmt.Printf("If bet exist show it:%v", Bet)
				database.DB.Model(&Bet).Association("ResultOfBet").Append(&resultofbet)

			}

		}
	}
	// return Result
	return "Succès", nil
}

func PointPerBet() {
	var Bets []models.Bet
	var ResultOfBet []models.ResultOfBet

	database.DB.Preload("ResultOfBet").Where("result_of_bet_id IS NOT NULL").Find(&Bets, &ResultOfBet)

	for i := 0; i < len(Bets); i++ {
		fmt.Println("============================================================")
		BetTab := pq.StringArray(*Bets[i].BetTab)
		fmt.Println("Tableau du paris du joueur:", BetTab)
		WinnerBet := pq.StringArray(*Bets[i].BetTab)[0]
		fmt.Println("Gagnant (bet):", WinnerBet)
		FinishMethodBet := pq.StringArray(*Bets[i].BetTab)[1]
		fmt.Println("Method de finish (bet):", FinishMethodBet)

		points := 0
		if Bets[i].ResultOfBet.MatchCancelled != nil {
			fmt.Println("--------------Match-annulé------------")
			fmt.Println("Match annulé=>", *Bets[i].ResultOfBet.MatchCancelled)
			fmt.Println("--------------fin-Match annulé-----------")
		} else {
			fmt.Println("--------------Match ok------------")
			fmt.Println("Tableau du resultat :", pq.StringArray(*Bets[i].ResultOfBet.ResultTab))
			ResultWinner := pq.StringArray(*Bets[i].ResultOfBet.ResultTab)[0]
			fmt.Println("Gagnant (resulat):", ResultWinner)
			ResultFinishMethod := pq.StringArray(*Bets[i].ResultOfBet.ResultTab)[1]
			fmt.Println("Finish (resulat):", ResultFinishMethod)
			ResultRoundFinish := pq.StringArray(*Bets[i].ResultOfBet.ResultTab)[2]
			fmt.Println("Numéro du round (resulat):", ResultRoundFinish)
			if len(BetTab) == 1 {
				fmt.Println("-------------Début-BetTab-longeur-1-------------")
				fmt.Println("Gagnant (bet):", WinnerBet)
				fmt.Println("Gagnant (resulat):", ResultWinner)
				if WinnerBet == ResultWinner {
					points += 3
					fmt.Println("Bon vainqueur parié(+3)")
				} else {
					fmt.Println("Mauvais vainqueur parié")
				}
				fmt.Println("--------------Fin-BetTab-longeur-1------------")
			}
			if len(BetTab) == 2 {
				fmt.Println("--------Début-BetTab-longeur-2-------------")
				fmt.Println("Finish (bet):", FinishMethodBet)
				fmt.Println("Finish (resulat):", ResultFinishMethod)
				if FinishMethodBet == ResultFinishMethod && WinnerBet == ResultWinner {
					points += 5
					fmt.Println("Bon gagnant et bon finish parié(+5)")
				}
				if FinishMethodBet != ResultFinishMethod && WinnerBet == ResultWinner {
					points += 2
					fmt.Println("Bon gagnant mais mauvais type de victoire(+2)")
				} else {
					fmt.Println("Mauvais gagnant et/ou mauvais finish parié")
				}
				fmt.Println("------------Fin-BetTab-longeur-2--------------")
			}
			if len(BetTab) == 3 {
				RoundFinishBet := pq.StringArray(*Bets[i].BetTab)[2]
				fmt.Println("-----------Début-BetTab-longeur-3-----------")
				fmt.Println("Numéro du round (bet):", RoundFinishBet)
				if RoundFinishBet == ResultRoundFinish && FinishMethodBet == ResultFinishMethod && WinnerBet == ResultWinner {
					points += 10
					fmt.Println("Bon gagnant bonne methode et bon round parié !!!!!!! (+10)")
				}
				if RoundFinishBet != ResultRoundFinish && FinishMethodBet == ResultFinishMethod && WinnerBet == ResultWinner {
					points += 2
					fmt.Println("Bon gagnant bonne methode mais mauvais round !!!!!!! (+2)")
				}
				if RoundFinishBet != ResultRoundFinish && FinishMethodBet != ResultFinishMethod && WinnerBet == ResultWinner {
					points += 1
					fmt.Println("Bon gagnant mais mauvaise méthode et mauvais round !!!!!!! (+1)")
				} else {
					fmt.Println("Mauvais gagnant ou mauvaise methode ou mauvais round parié")
				}
				fmt.Println("-----------Fin-BetTab-longeur-3----------")
			}
			fmt.Println("-------------Fin-Match-ok-----------------")
		}
		fmt.Println("Nombre de point", points)
		fmt.Println("==========================================================")
		// à décommenter pour pushé les points
		database.DB.Model(&Bets[i]).UpdateColumn("PointPerBet", &points)

	}

}
