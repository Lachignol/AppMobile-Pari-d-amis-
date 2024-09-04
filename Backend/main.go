package main

import (
	"fmt"
	"os"
	"time"
	scheduler "github.com/adatechschool/projet-mobile-pari_damis/Scheduler"
	"github.com/adatechschool/projet-mobile-pari_damis/database"
	"github.com/go-co-op/gocron"
	"github.com/adatechschool/projet-mobile-pari_damis/routes"
	"github.com/gin-gonic/gin"
	_ "time/tzdata"
)

func init() {
	database.ConnectToDatabase()
	location, err := time.LoadLocation("Europe/Paris")
	if err != nil {
		fmt.Println("error", err)
		return
	}
	parisTime := time.Now().In(location)
	fmt.Println("Paris Time ?", parisTime)
	// Calculer le décalage pour l'Oregon (PST/PDT)
	// utcNow := time.Now().UTC()

	// // Heure en Oregon : UTC-8 (en hiver) ou UTC-7 (en été)
	// oregonTime := utcNow.Add(-7 * time.Hour) // Adapte cette ligne pour UTC-7 si c'est l'heure d'été (PDT)

	// // Formater l'heure locale de l'Oregon (ajuster si nécessaire pour l'heure d'été)
	// oregonHour := oregonTime.Hour()
	// oregonMinute := oregonTime.Minute()
	// fmt.Printf("Oregon Time: %02d:%02d (UTC-%d)\n", oregonHour, oregonMinute, 7) // Ajuste à 7 pour l'heure d'été

	// Initialiser le scheduler avec UTC
	myScheduler := gocron.NewScheduler(location)

	// Planifier la tâche à l'heure correspondante (02:46 UTC correspond à 11:46 Paris)
	myScheduler.Every(1).Wednesday().At("13:03").Do(scheduler.GetMatchAndSaveThemInJson)

	// Démarrer le scheduler en mode asynchrone
	myScheduler.StartAsync()
}
func main() {
	r := gin.Default()
	r.Static("/static", "./static")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("Server online")
	routes.Routes(r)
	// scheduler.Match()
	// scheduler.PointPerBet()
	// scrapping.ScrappingMainEvent()
	// scheduler.GetMatchAndSaveThemInJson()
	// scrapping.ScrappingAllFightersInfos()
	// fmt.Println("Monday of the current week:", helper.GetMondayOfCurrentWeek())
	// fmt.Println("Friday of the current week:", helper.GetFridayOfCurrentWeek())
	r.Run("0.0.0.0:" + port) //
}
