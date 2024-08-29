package main

import (
	"fmt"

	"os"

	// scheduler "github.com/adatechschool/projet-mobile-pari_damis/Scheduler"

	// scheduler "github.com/adatechschool/projet-mobile-pari_damis/Scheduler"
	"github.com/adatechschool/projet-mobile-pari_damis/database"

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
	// myScheduler := gocron.NewScheduler(time.Local)
	// scheduleTest := cron.New()
	// scheduleTest.AddFunc("0 13 * * 4", scheduler.GetMatchAndSaveThemInJson)
	// scheduleTest.Start()
	database.ConnectToDatabase()
	// select {}
	// scrapping.ScrappingImageAllFighters()
	// myScheduler.Every(1).Day().Wednesday().At("17:25").Do(scheduler.GetMatchAndSaveThemInJson)
	// myScheduler.StartAsync()
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
