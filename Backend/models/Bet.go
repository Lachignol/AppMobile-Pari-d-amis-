package models

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Bet struct {
	gorm.Model
	BetTab        *pq.StringArray `gorm:"type:string"`
	MatchID       string
	GroupID       uint64 `gorm:"column:group_id"`
	UserID        uint64 `gorm:"column:user_id"`
	TimeStart     time.Time
	TimeEnd       time.Time
	ResultOfBetID *uint64
	ResultOfBet   *ResultOfBet
	PointPerBet   *uint64
}
