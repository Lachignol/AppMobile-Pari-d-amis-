package controllers

import (

	// "os"
	// "time"

	"net/http"

	"github.com/adatechschool/projet-mobile-pari_damis/database"
	"github.com/adatechschool/projet-mobile-pari_damis/models"
	"github.com/gin-gonic/gin"
)

func AddTokenToUser(c *gin.Context, User models.User, Token string, Device string, Os string) {
	var os string
	var device string

	switch Device {
	case "TABLET":
		device = "TABLET"

	case "MOBILEPHONE":
		device = "MOBILEPHONE"
	default:
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid credentials",
		})
		return
	}

	switch Os {
	case "IOS":
		os = "IOS"
	case "ANDROID":
		os = "ANDROID"
	default:
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid credentials",
		})
		return
	}

	ObjectOfToken := models.AuthToken{Token: Token, Device: device, Os: os, UserID: User.ID}
	database.DB.Create(&ObjectOfToken)
	c.JSON(200, gin.H{
		"message": ObjectOfToken,
		"token":   Token,
		"user":    User,
	})

}

func ShowTokenOfUser(c *gin.Context) {
	userId := c.Param("UserID")
	var User models.User
	database.DB.Preload("AuthToken").First(&User, userId)
	c.JSON(200, gin.H{
		"message": User,
	})
}

func DeleteTokenOfUser(c *gin.Context) {
	userId := c.Param("UserID")
	authTokenId := c.Param("AuthTokID")
	var AuthToken models.AuthToken
	database.DB.First(&AuthToken, authTokenId)
	var User models.User
	database.DB.First(&User, userId)
	// database.DB.Model(&User).Association("AuthToken").Delete(&AuthToken)
	database.DB.Model(&AuthToken).Delete(&AuthToken)
	c.JSON(200, gin.H{
		"User":      User,
		"AuthToken": AuthToken,
	})
}
