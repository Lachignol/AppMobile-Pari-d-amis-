package models

import (
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type ResultOfBet struct {
	gorm.Model
	ResultTab      *pq.StringArray `gorm:"type:string"`
	MatchID        string
	MatchCancelled *string
}
