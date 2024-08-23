package main

import (
	"fmt"
	"log"
	"os"

	// scheduler "github.com/adatechschool/projet-mobile-pari_damis/Scheduler"

	"github.com/adatechschool/projet-mobile-pari_damis/database"
	"github.com/joho/godotenv"

	// helper "github.com/adatechschool/projet-mobile-pari_damis/helper"
	"github.com/adatechschool/projet-mobile-pari_damis/routes"
	"github.com/gin-gonic/gin"
)

// "net/http"

// "time"

// scheduler "github.com/adatechschool/projet-mobile-pari_damis/Scheduler"

// "github.com/go-co-op/gocron"

func init() {
	// myScheduler := gocron.NewScheduler(time.Local)
	// scrapping.ScrappingImageAllFighters()
	// myScheduler.Every(1).Day().Thursday().At("11:25").Do(scheduler.Match)
	// myScheduler.StartAsync()
	if _, exists := os.LookupEnv("RAILWAY_ENVIRONMENT"); exists == false {
		if err := godotenv.Load(); err != nil {
			log.Fatal("error loading .env file:", err)
		}
	}
	database.ConnectToDatabase()
}
func main() {
	r := gin.Default()
	r.Static("/static", "./static")

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
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
