package helper

import (
	"time"
)

func GetMondayOfCurrentWeek() time.Time {
	today := time.Now()
	dayOfWeek := int(today.Weekday())
	var diff int
	if dayOfWeek == 0 {
		diff = -6
	} else {
		diff = 1 - dayOfWeek
	}
	monday := today.AddDate(0, 0, diff)
	// Reset the time part to zero
	monday = time.Date(monday.Year(), monday.Month(), monday.Day(), 0, 0, 0, 0, monday.Location())
	return monday
}

func GetFridayOfCurrentWeek() time.Time {
	today := time.Now()
	dayOfWeek := int(today.Weekday())
	var diff int
	if dayOfWeek <= 5 {
		diff = 5 - dayOfWeek
	} else {
		diff = 5 - dayOfWeek + 7
	}
	friday := today.AddDate(0, 0, diff)
	friday = time.Date(friday.Year(), friday.Month(), friday.Day(), 23, 59, 59, 59, friday.Location())
	return friday
}
