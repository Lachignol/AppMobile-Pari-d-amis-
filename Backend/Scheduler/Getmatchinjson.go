package scheduler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

func GetMatchAndSaveThemInJson() {
	saturdayMatches, err := GetMatchesForDate(GetNextSaturdayDate())
	if err != nil {
		log.Println(err)
	}
	time.Sleep(time.Duration(time.Second) * 4)

	sundayMatches, err := GetMatchesForDate(GetNextSundayDate())
	if err != nil {
		log.Println(err)
	}

	allmatch := append(saturdayMatches, sundayMatches...)
	allmatchfinish, err := json.MarshalIndent(allmatch, "", "  ")
	if err != nil {
		log.Println(err)
		return
	}
	err = os.WriteFile("matchofweekend.json", allmatchfinish, 0644)
	if err != nil {
		log.Println("Error writing to file:", err)
		return
	}
}

func GetNextSaturdayDate() string {
	return GetNextWeekdayDate(time.Saturday)
}

func GetNextSundayDate() string {
	return GetNextWeekdayDate(time.Sunday)
}

func GetNextWeekdayDate(weekday time.Weekday) string {
	now := time.Now()
	days := (7 + weekday - now.Weekday()) % 7
	if days == 0 {
		days = 7
	}
	nextWeekday := now.AddDate(0, 0, int(days))
	return nextWeekday.Format("2006-01-02")
}

func GetMatchesForDate(date string) ([]MatchOfWeekEnd, error) {
	url := fmt.Sprintf("https://api.sportradar.com/mma/trial/v2/en/schedules/%s/summaries.json?api_key=%s", date, os.Getenv("APIKEY"))
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Summaries []MatchOfWeekEnd `json:"summaries"`
	}
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		log.Println(err)
	}
	return result.Summaries, nil
}

func GetMatchFromJsonToStruct() ([]MatchOfWeekEnd, error) {
	content, err := os.ReadFile("matchofweekend.json")
	if err != nil {
		return nil, fmt.Errorf("error reading file: %w", err)
	}

	var matches []MatchOfWeekEnd
	err = json.Unmarshal(content, &matches)
	if err != nil {
		return nil, fmt.Errorf("error unmarshalling JSON: %w", err)
	}

	return matches, nil
}
