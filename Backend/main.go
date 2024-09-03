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
		fmt.Printf("Failed to load location: %v\n", err)
		return
	}

	myScheduler := gocron.NewScheduler(location)
	myScheduler.Every(1).Tuesday().At("11:10").Do(scheduler.GetMatchAndSaveThemInJson) 
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
