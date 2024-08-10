package middleware

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/adatechschool/projet-mobile-pari_damis/database"
	"github.com/adatechschool/projet-mobile-pari_damis/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(c *gin.Context) {
	fmt.Println("in middleware")
	tokenString, err := c.Cookie("Authorization")
	var AuthToken models.AuthToken
	if err != nil {
		fmt.Println("Utilisateur sans token")
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Token not found",
		})
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("UNEXPECTED signing method: %v", token.Header["mauvais token"])
		}
		return []byte(os.Getenv("SECRET")), nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			database.DB.Where("Token = ?", tokenString).Delete(&AuthToken)
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "token expirate",
			})
			c.AbortWithStatus(http.StatusUnauthorized)
		}
		var User models.User
		database.DB.First(&User, claims["userId"])

		if User.ID == 0 {
			c.AbortWithStatus(http.StatusUnauthorized)
		}

		c.Set("user", User)
		c.Next()

	} else {
		c.AbortWithStatus(http.StatusUnauthorized)
	}

}
