package database

import (
	"fmt"
	"log"
	"os"

	"github.com/adatechschool/projet-mobile-pari_damis/models"
	"github.com/joho/godotenv"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB
var Err error

func ConnectToDatabase() {
	if _, exists := os.LookupEnv("RAILWAY_ENVIRONMENT"); exists == false {
		if err := godotenv.Load(); err != nil {
			log.Fatal("error loading .env file:", err)
		}
	}
	dsn := os.Getenv("DATABASE")
	DB, Err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if Err != nil {
		panic(Err)
	} else {
		// DB.Begin()
		fmt.Println("succed")
		// DB.AutoMigrate(&models.Bet{} ,&models.ResultOfBet{})
		DB.AutoMigrate(&models.User{}, &models.Group{}, &models.Bet{}, &models.AuthToken{}, &models.ResultOfBet{})
		// DB.Migrator().DropTable(&models.User{}, &models.Group{}, &models.Bet{}, &models.AuthToken{}, &models.ResultOfBet{})
		// DB.Migrator().DropTable(&models.Group{}, "group_users")
		// DB.Migrator().DropTable(&models.AuthToken{}, "auth_tokens")
	}

}
