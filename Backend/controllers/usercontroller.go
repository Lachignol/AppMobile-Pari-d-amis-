package controllers

import (
	// "fmt"

	"log"
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/adatechschool/projet-mobile-pari_damis/database"
	"github.com/adatechschool/projet-mobile-pari_damis/helper"
	"github.com/adatechschool/projet-mobile-pari_damis/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func Validate(c *gin.Context) {
	user, _ := c.Get("user")
	c.JSON(http.StatusOK, gin.H{
		"message": user,
	})

}

func Login(c *gin.Context) {
	var body struct {
		Email    string
		Password string
		Device   string
		Os       string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to read body",
		})
		return
	}
	var User models.User
	database.DB.First(&User, "email =?", body.Email)

	if User.ID == 0 {
		c.JSON(http.StatusNotAcceptable, gin.H{
			"error": "Email ou password invalide",
		})
		return
	}
	error := bcrypt.CompareHashAndPassword([]byte(User.Password), []byte(body.Password))
	if error != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{
			"error": "Mauvais password",
		})
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": User.ID,
		"exp":    time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Erreur lors de la création du token",
		})

		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600*24*30, "", "", false, true)

	AddTokenToUser(c, User, tokenString, body.Device, body.Os)

}

func SignUp(c *gin.Context) {
	var pathOfAvatar string

	var body struct {
		Firstname string
		Lastname  string
		Pseudo    string
		Email     string
		Password  string
	}

	regexEmail := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	regexPassword := `^(?:[A-Za-z\d@#$%^&+=!]{12,})$`

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to read body",
		})
		return
	}

	re, err := regexp.Compile(regexEmail)
	if err != nil {
		log.Println("Erreur de compilation de la regexEmail:", err)
		return
	}

	if !re.MatchString(body.Email) {
		c.JSON(http.StatusNotAcceptable, gin.H{
			"error": "Veuillez saisir une adresse mail valide",
		})
		return
	}

	var User models.User
	database.DB.First(&User, "email =?", body.Email)

	if User.ID != 0 {
		c.JSON(http.StatusNotAcceptable, gin.H{
			"error": "Email déja existant en base",
		})
		return
	}

	// verif avec regex formatage du mail et meme du password

	database.DB.First(&User, "pseudo  =?", body.Pseudo)

	if User.ID != 0 {
		c.JSON(http.StatusNotAcceptable, gin.H{
			"error": "Pseudo déja existant en base",
		})
		return
	}

	if len(body.Pseudo) < 6 {
		c.JSON(http.StatusNotAcceptable, gin.H{
			"error": "Le pseudo doit faire au moins 6 caractères",
		})
		return
	}

	re, err = regexp.Compile(regexPassword)
	if err != nil {
		log.Println("Erreur de compilation de la regexPassword:", err)
		return
	}

	checkPassword := func(password string) bool {
        return re.MatchString(password) &&
            regexp.MustCompile(`[a-z]`).MatchString(password) &&
            regexp.MustCompile(`[A-Z]`).MatchString(password) &&
            regexp.MustCompile(`\d`).MatchString(password) &&
            regexp.MustCompile(`[@#$%^&+=!]`).MatchString(password)
    }

	if !checkPassword(body.Password) {
		c.JSON(http.StatusNotAcceptable, gin.H{
			"error": "Mauvais formatage du mdp",
		})
		return
	}

	hash, error := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to hash password",
		})
		return
	}

	file, err := c.FormFile("Avatar")
	if err != nil {
		if err == http.ErrMissingFile {
			log.Println("Pas d'avatar uploader")
		}
	} else {
		{
			pathOfAvatar, error = helper.UploadFileForProfile(c, file)
			if error != nil {
				log.Println("probleme lors de l'upload de l'avatar")
			}
		}
	}
	user := models.User{Firstname: body.Firstname, Lastname: body.Lastname, Pseudo: body.Pseudo, Email: body.Email, Password: string(hash), PathOfAvatar: pathOfAvatar}
	result := database.DB.Create(&user)
	if result.Error != nil {
		c.Status(400)
		return
	}
	c.JSON(http.StatusOK, gin.H{})

}

func AddUser(c *gin.Context) {
	var body struct {
		Firstname string
		Lastname  string
		Pseudo    string
		Email     string
		Password  string
	}
	c.Bind(&body)

	user := models.User{Firstname: body.Firstname, Lastname: body.Lastname, Pseudo: body.Pseudo, Email: body.Email, Password: body.Password}
	result := database.DB.Create(&user)
	if result.Error != nil {
		c.Status(400)
		return
	}
	c.JSON(200, gin.H{
		"message": user,
	})
}

func AllUsers(c *gin.Context) {
	var AllUser []models.User
	database.DB.Find(&AllUser)

	c.JSON(200, gin.H{
		"message": AllUser,
	})
}

func OneUser(c *gin.Context) {
	id := c.Param("UserID")
	var User models.User
	database.DB.First(&User, id)

	c.JSON(200, gin.H{
		"message": User,
	})
}

func ShowGroupsOfOneUser(c *gin.Context) {
	userId := c.Param("UserID")
	var User models.User

	database.DB.Preload("Groups").First(&User, userId)

	c.JSON(200, gin.H{
		"UserGroup": User.Groups,
	})
}

func UpdateUser(c *gin.Context) {
	id := c.Param("UserID")
	var pathOfAvatar string
	var body struct {
		Firstname string
		Lastname  string
		Email     string
	}
	c.Bind(&body)

	file, err := c.FormFile("Avatar")
	if err != nil {
		if err == http.ErrMissingFile {
			log.Println("Pas d'avatar uploader")
		}
	} else {
		pathOfAvatar, err = helper.UploadFileForProfile(c, file)
		if err != nil {
			log.Println("probleme lors de l'upload de l'avatar")
		}
	}

	var User models.User
	database.DB.First(&User, id)

	database.DB.Model(&User).Updates(models.User{Firstname: body.Firstname, Lastname: body.Lastname, Email: body.Email, PathOfAvatar: pathOfAvatar})

	c.JSON(200, gin.H{
		"message": User,
	})
}

func UpdateAvatarOfUser(c *gin.Context) {
	id := c.Param("UserID")
	var pathOfAvatar string
	file, err := c.FormFile("Avatar")
	if err != nil {
		if err == http.ErrMissingFile {
			c.JSON(http.StatusFailedDependency, gin.H{
				"message": "Pas d'image trouvé",
			})
			log.Println("Pas d'avatar uploader")
		}
	}
	pathOfAvatar, err = helper.UploadFileForProfile(c, file)
	log.Println(pathOfAvatar)
	if err != nil {
		c.JSON(http.StatusFailedDependency, gin.H{
			"message": "probleme lors de l'upload de l'avatar"})
	}
	var User models.User
	database.DB.First(&User, id)

	database.DB.Model(&User).Updates(models.User{PathOfAvatar: pathOfAvatar})

	c.JSON(200, gin.H{
		"message": User,
	})
}

func DeleteOneUser(c *gin.Context) {
	id := c.Param("UserID")
	var User models.User
	database.DB.Delete(&User, id)

	c.Status(200)
}
