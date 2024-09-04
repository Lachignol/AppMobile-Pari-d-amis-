package main

import (
	"fmt"
	"os"
	"time"

	// "time"

	// scheduler "github.com/adatechschool/projet-mobile-pari_damis/Scheduler"
	scheduler "github.com/adatechschool/projet-mobile-pari_damis/Scheduler"
	"github.com/adatechschool/projet-mobile-pari_damis/database"
	"github.com/go-co-op/gocron"
	// "github.com/go-co-op/gocron"

	// helper "github.com/adatechschool/projet-mobile-pari_damis/helper"
	"github.com/adatechschool/projet-mobile-pari_damis/routes"
	"github.com/gin-gonic/gin"
	// "github.com/robfig/cron"
)

// "net/http"

// "time"

// scheduler "github.com/adatechschool/projet-mobile-pari_damis/Scheduler"

// "github.com/go-co-op/gocron"

func init() {
	database.ConnectToDatabase()
	location, err := time.LoadLocation("America/Los_Angeles")
	if err != nil {
		fmt.Printf("Failed to load location 'America/Los_Angeles': %v\n", err)
		// Essayer un fuseau horaire alternatif "PST8PDT"
		location, err = time.LoadLocation("US/Pacific")
		if err != nil {
			fmt.Printf("Failed to load alternative location 'US/Pacific': %v\n", err)
			return
		}
		fmt.Println("Loaded alternative location 'US/Pacific'")
	} else {
		fmt.Println("Loaded location 'America/Los_Angeles'")
	}

	// Initialiser le scheduler avec le fuseau horaire chargé
	myScheduler := gocron.NewScheduler(location)

	// Planifier la tâche pour 02h46 heure locale du fuseau chargé
	myScheduler.Every(1).Wednesday().At("02:57").Do(scheduler.GetMatchAndSaveThemInJson)

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
