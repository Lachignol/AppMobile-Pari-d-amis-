package models

import (
	"gorm.io/gorm"
)

//c'est un enum in golang cela signifie que le champs device zccepte seulement le champ TABLET et MOBILEPHONE c'est le même pricipe pour l'OS

type AuthToken struct {
	gorm.Model
	Token  string
	Device string
	Os     string
	UserID uint 
}
