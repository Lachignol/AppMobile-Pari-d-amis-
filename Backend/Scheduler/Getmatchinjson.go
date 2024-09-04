package scheduler

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

func GetMatchAndSaveThemInJson() {
	fmt.Println("Starting GetMatchAndSaveThemInJson")

	saturdayMatches, err := GetMatchesForDate(GetNextSaturdayDate())
	if err != nil {
		log.Println(err)
	}
	fmt.Println("Saturday matches retrieved:", len(saturdayMatches))
	time.Sleep(time.Duration(time.Second) * 4)

	sundayMatches, err := GetMatchesForDate(GetNextSundayDate())
	if err != nil {
		log.Println(err)
	}
	fmt.Println("Sunday matches retrieved:", len(sundayMatches))

	allmatch := append(saturdayMatches, sundayMatches...)
	allmatchfinish, err := json.MarshalIndent(allmatch, "", "  ")
	if err != nil {
		log.Println(err)
		return
	}
	fmt.Println("All matches marshaled into JSON")

	err = os.WriteFile("matchofweekend.json", allmatchfinish, 0644)
	if err != nil {
		log.Println("Error writing to file:", err)
		return
	}
	fmt.Println("All matches saved to matchofweekend.json")
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
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API returned status code %d: %s", resp.StatusCode, string(body))
	}
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
