package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Firstname string
	Lastname  string
	Pseudo    string
	Email     string
	Password  string
	PathOfAvatar  string
	Groups    []*Group `gorm:"many2many:group_users;" json:"groups"`
	Bets      []*Bet `gorm:"foreignKey:UserID"`
	AuthToken []AuthToken
}
