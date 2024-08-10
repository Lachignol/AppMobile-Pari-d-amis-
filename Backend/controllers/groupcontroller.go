package controllers

import (
	"fmt"
	"net/http"

	// "os"
	// "time"

	"github.com/adatechschool/projet-mobile-pari_damis/database"
	"github.com/adatechschool/projet-mobile-pari_damis/models"
	"github.com/gin-gonic/gin"
	// "github.com/golang-jwt/jwt/v5"
	// "golang.org/x/crypto/bcrypt"
)

func CreateGroup(c *gin.Context) {
	userID := c.Param("userID")
	var body struct {
		Name         string
		LimitMembers *uint8
		Users        []models.User
		Bets         []models.Bet
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to read body",
		})
		return
	}
	var User models.User
	database.DB.First(&User, userID)
	group := models.Group{Name: body.Name, LimitMembers: body.LimitMembers, CreatorId: userID}
	result := database.DB.Create(&group)
	database.DB.Model(&group).Association("Users").Append(&User)
	if result.Error != nil {
		c.Status(400)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"group":     group,
		"groupID":   group.ID,
		"creatorID": group.CreatorId,
	})

}

func AddUserToGroup(c *gin.Context) {
	groupId := c.Param("GroupID")
	userId := c.Param("UserID")
	var Group models.Group
	var User models.User
	database.DB.First(&User, userId)
	database.DB.First(&Group, groupId)

	database.DB.Model(&Group).Association("Users").Append(&User)
	// if result.Error != nil {
	// 	c.Status(400)
	// 	return
	// }
	c.JSON(200, gin.H{
		"message": Group,
	})
}

func AddUserToGroupByCreatorId(c *gin.Context) {
	groupId := c.Param("GroupID")
	userId := c.Param("UserID")
	creatorId := c.Param("CreatorID")
	var Group models.Group
	var User models.User
	database.DB.First(&User, userId)
	database.DB.First(&Group, groupId)
	database.DB.First(&Group, creatorId)

	if err:= database.DB.First(&Group, groupId).Error; err != nil{
		c.JSON(404, gin.H{"error":"Group not found"})
		return
	}
	if Group.CreatorId != creatorId{
		c.JSON(403, gin.H{"error":"Only the creator can add users"})
		return
	}
	if userId == creatorId {
        c.JSON(403, gin.H{"error": "Creator cannot add themselve to the group"})
        return
    }
	if err := database.DB.First(&User, userId).Error; err != nil{
		c.JSON(404, gin.H{"error":"User not found"})
		return
	}
	if err := database.DB.Model(&Group).Association("Users").Append(&User); err != nil{
		c.JSON(400, gin.H{"error":"Error adding user to group"})
		return
	}
	c.JSON(200, gin.H{
		"message": Group,
	})
}

func ShowUsersOfOneGroup(c *gin.Context) {
	groupId := c.Param("GroupID")
	var Group models.Group

	database.DB.Preload("Users").First(&Group, groupId)

	fmt.Println(Group)

	c.JSON(200, gin.H{
		"message": Group,
	})
}

func OneGroup(c *gin.Context) {
	groupId := c.Param("GroupId")
	var Group models.Group
	database.DB.First(&Group, groupId)

	c.JSON(200, gin.H{
		"message": Group,
	})
}

func AllGroups(c *gin.Context) {
	var AllGroups []models.Group
	database.DB.Find(&AllGroups)

	c.JSON(200, gin.H{
		"message": AllGroups,
	})
}

func UpdateGroup(c *gin.Context) {
	groupId := c.Param("GroupID")
	var body struct {
		Name         string
		LimitMembers *uint8
	}
	c.Bind(&body)

	var Group models.Group
	database.DB.First(&Group, groupId)

	database.DB.Model(&Group).Updates(models.Group{Name: body.Name, LimitMembers: body.LimitMembers})

	c.JSON(200, gin.H{
		"message": Group,
	})
}

func DeleteOneGroup(c *gin.Context) {
	groupId := c.Param("GroupID")
	creatorId := c.Param("CreatorID")
	var Group models.Group

	database.DB.First(&Group, groupId)
	if Group.CreatorId == creatorId  {
		database.DB.Delete(&Group, groupId)
		c.JSON(200, gin.H{
			"message": "Group Deleted",
		})
		return
	}
	c.JSON(403, gin.H{
		"message": "Unauthorized",
	})
	return
}

func DeleteUserOfGroupByCreatorId(c *gin.Context) {
	groupId := c.Param("GroupID")
	userId := c.Param("UserID")
	creatorId := c.Param("CreatorID")
	var Group models.Group
	var User models.User
	database.DB.First(&User, userId)
	database.DB.First(&Group, groupId)
	database.DB.First(&Group, creatorId)

	if err:= database.DB.First(&Group, groupId).Error; err != nil{
		c.JSON(404, gin.H{"error":"Group not found"})
		return
	}
	if Group.CreatorId != creatorId{
		c.JSON(403, gin.H{"error":"Only the creator can delete users"})
		return
	}
	if userId == creatorId {
        c.JSON(403, gin.H{"error": "Creator cannot remove themselve from the group"})
        return
    }
	if err := database.DB.First(&User, userId).Error; err != nil{
		c.JSON(404, gin.H{"error":"User not found"})
		return
	}
	if err := database.DB.Model(&Group).Association("Users").Delete(&User); err != nil{
		c.JSON(400, gin.H{"error":"Error deleting user from group"})
		return
	}
	c.JSON(200, gin.H{
		"message": Group,
	})
}