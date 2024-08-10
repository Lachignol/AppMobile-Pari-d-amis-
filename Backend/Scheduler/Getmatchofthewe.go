package scheduler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MatchOfWeekEnd struct {
	SportEvent struct {
		ID          string `json:"id"`
		Competitors []struct {
			Name string `json:"name"`
		} `json:"competitors"`
	} `json:"sport_event"`
	Sport_event_status struct {
		NumRound    int    `json:"scheduled_length"`
		WeightClass string `json:"weight_class"`
		TitleFight  bool   `json:"title_fight"`
		MainEvent   bool   `json:"main_event"`
	} `json:"sport_event_status"`
}

type BetOfUser struct {
	MatchID string `json:"MatchID"`
}

func GetMatchesOfTheWeekEnd(c *gin.Context) {
	groupID := c.Param("GroupID")
	userID := c.Param("UserID")

	betOfUserByGroupID, err := getBetOfUserByGroup(groupID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	allMatches, err := GetMatchFromJsonToStruct()
	if err != nil {
		log.Println(err)
	}
	filteredMatches := filterMatches(allMatches, betOfUserByGroupID)

	c.JSON(http.StatusOK, gin.H{"matches": filteredMatches})
}

func getBetOfUserByGroup(groupID, userID string) ([]BetOfUser, error) {
	url := fmt.Sprintf("http://0.0.0.0:3001/bet/betOfUserByGroupOfThisWeek/%s/%s/", groupID, userID)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Message []BetOfUser `json:"message"`
	}
	err = json.NewDecoder(resp.Body).Decode(&result)
	return result.Message, err
}

func filterMatches(allMatches []MatchOfWeekEnd, betOfUserByGroupID []BetOfUser) []MatchOfWeekEnd {
	betMatchIDs := make(map[string]bool)
	for _, bet := range betOfUserByGroupID {
		betMatchIDs[bet.MatchID] = true
	}

	var filteredMatches []MatchOfWeekEnd
	for _, match := range allMatches {
		if !betMatchIDs[match.SportEvent.ID] {
			filteredMatches = append(filteredMatches, match)
		} else {
			log.Printf("Excluding match ID %s because user has already bet on it", match.SportEvent.ID)
		}
	}
	return filteredMatches
}



func GetMatchesOfTheWeekEndWhithoutFilter(c *gin.Context) {
	allMatches, err := GetMatchFromJsonToStruct()
	if err != nil {
		log.Println(err)
	}
	
	c.JSON(http.StatusOK, gin.H{"matches": allMatches})
}