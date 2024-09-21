package models

import (
	"gorm.io/gorm"
)

type Group struct {
	gorm.Model
	Name         string
	// Sports []string
	CreatorId string
	PathOfGroupAvatar  string
	Users     []*User `gorm:"many2many:group_users;" json:"users"`
	Bets      []*Bet `gorm:"foreignKey:GroupID"`
}
