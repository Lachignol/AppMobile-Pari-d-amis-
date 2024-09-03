package controllers

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"fmt"

	"github.com/adatechschool/projet-mobile-pari_damis/database"
	"github.com/adatechschool/projet-mobile-pari_damis/helper"
	"github.com/adatechschool/projet-mobile-pari_damis/models"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

func CreateBet(c *gin.Context) {
	var body struct {
		BetTab *pq.StringArray
	}
	// bg := []string{"3", "TKO", "1"} --> insertion pq.StringArray(bg)
	userIdStr := c.Param("UserID")
	groupIdStr := c.Param("GroupID")
	matchIdStr := c.Param("MatchID")
	// today := time.Date(2024, time.June, 16, 23, 59, 59, 1, time.Local)
	today := time.Now()
	MondayOfWeek := helper.GetMondayOfCurrentWeek()
	FridayOfWeek := helper.GetFridayOfCurrentWeek()

	if len(strings.Trim(userIdStr, "")) == 0 || len(strings.Trim(groupIdStr, "")) == 0 || len(strings.Trim(matchIdStr, "")) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Bad request",
		})
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to read body",
		})
		return
	}

	userId, _ := strconv.ParseUint(userIdStr, 10, 64)
	

	groupId, _ := strconv.ParseUint(groupIdStr, 10, 64)
	
	var betTab pq.StringArray
	if body.BetTab != nil {
		betTab = *body.BetTab
	}
	bet := models.Bet{

		BetTab:    &betTab,
		UserID:    userId,
		GroupID:   groupId,
		MatchID:   matchIdStr,
		TimeStart: MondayOfWeek,
		TimeEnd:   FridayOfWeek,
	}

	if today.Before(FridayOfWeek) && today.After(MondayOfWeek) {
		println(today.Before(FridayOfWeek) && today.After(MondayOfWeek))
		result := database.DB.Create(&bet).Error
		if result != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": result.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"message": "everything is ok",
		})
		return
	} else {
		c.JSON(http.StatusPreconditionFailed, gin.H{
			"message": "it's to late",
		})
		return
	}
}

func GetBetsByUserId(c *gin.Context) {
	userId := c.Param("UserID")
	var User models.User
	database.DB.Preload("Bets").First(&User, userId)
	c.JSON(200, gin.H{
		"message": User,
	})
}

func GetBetsByGroupID(c *gin.Context) {
	groupId := c.Param("GroupID")
	var Group models.Group
	database.DB.Preload("Bets").First(&Group, groupId)
	c.JSON(200, gin.H{
		"message": Group,
	})
}

func GetBetsOfUserByGroupID(c *gin.Context) {
	groupId := c.Param("GroupID")
	userId := c.Param("UserID")
	// parsedgroupId, err := strconv.ParseUint(userId, 10, 64)
	// if err != nil {
	// 	fmt.Println(err)
	// }

	var Bet []models.Bet
	database.DB.Where("Group_ID = ?", groupId).Where("User_ID = ?", userId).Find(&Bet)

	c.JSON(200, gin.H{
		"message": Bet,
	})
}

func GetBetsOfUserByGroupIDOfThisWeek(c *gin.Context) {
	groupId := c.Param("GroupID")
	userId := c.Param("UserID")
	date := helper.GetMondayOfCurrentWeek()

	var Bets []models.Bet
	database.DB.Where("Group_ID = ?", groupId).Where("User_ID = ?", userId).Where("Time_Start = ?", date).Find(&Bets)
	c.JSON(200, gin.H{
		"message": Bets,
	})
}

func GetBetsOfUserByGroupIDByDate(c *gin.Context) {
	groupId := c.Param("GroupID")
	userId := c.Param("UserID")
	dateInParam := c.Param("DateOfMondayOfSearchWeek")
	parsedate := strings.Split(dateInParam, "-")
	year, err := strconv.Atoi(parsedate[0])
	if err != nil {
		fmt.Println(err)
	}
	month, err := strconv.Atoi(parsedate[1])
	if err != nil {
		fmt.Println(err)
	}
	day, err := strconv.Atoi(parsedate[2])
	if err != nil {
		fmt.Println(err)
	}
	date := time.Date(year, time.Month(month), day, 00, 00, 00, 00, time.Local)

	var Bets []models.Bet
	database.DB.Where("Group_ID = ?", groupId).Where("User_ID = ?", userId).Where("Time_Start = ?", date).Find(&Bets)
	c.JSON(200, gin.H{
		"message": Bets,
	})
}

func UpdateBetWithResultOfBet(c *gin.Context) {
	resultofbetId := c.Param("ResultOfBetID")
	betId := c.Param("BetID")

	var resultofbet models.ResultOfBet

	database.DB.First(&resultofbet, resultofbetId)
	fmt.Println(resultofbet)

	var bet models.Bet
	database.DB.First(&bet, betId)
	fmt.Println(bet)

	database.DB.Model(&bet).Association("ResultOfBet").Append(&resultofbet)
	// database.DB.Model(&bet).Updates(models.Bet{ResultOfBet: &resultofbetID})
	c.JSON(200, gin.H{
		"message": bet,
	})
}
