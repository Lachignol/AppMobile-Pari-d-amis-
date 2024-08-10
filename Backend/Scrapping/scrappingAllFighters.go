package scrapping

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gocolly/colly"
)

type MatchAllFighters struct {
	NomCombattant string `json:"nom_combattant"`
	ImagePath     string `json:"image_path"`
	DetailsURL    string `json:"details_url"`
	Category      string `json:"category"`
	Wld           string `json:"wld"`
	MethodWinKO   string `json:"method_win_ko"`
	MethodWinDec  string `json:"method_win_dec"`
	MethodWinSub  string `json:"method_win_sub"`
	Status        string `json:"status"`
	Pob           string `json:"pob"` // Place of Birth
	Age           string `json:"age"`
	FightStyle    string `json:"fight_style"`
	Weight        string `json:"weight"`
}

func ScrappingAllFightersInfos() {
	baseURL := "https://www.ufc.com"
	matchs := sync.Map{}

	c := colly.NewCollector(
		colly.AllowedDomains("www.ufc.com"),
		colly.MaxDepth(2),
	)
	c.SetRequestTimeout(120 * time.Second)

	detailCollector := c.Clone()

	detailCollector.OnHTML("body", func(e *colly.HTMLElement) {
		detailURL := e.Request.URL.String()
		match := &MatchAllFighters{DetailsURL: detailURL}
		fmt.Println(detailURL)
		match.NomCombattant = e.ChildText(".hero-profile__name")
		fmt.Println("nom du fighter :",match.NomCombattant)
		match.ImagePath = e.ChildAttr("img", "src")
		match.Category = e.ChildText(".hero-profile__division-title")
		match.Wld = e.ChildText(".hero-profile__division-body")

		e.ForEach(".c-bio__field", func(_ int, g *colly.HTMLElement) {
			label := g.ChildText(".c-bio__label")
			value := g.ChildText(".c-bio__text")
			switch strings.ToLower(label) {
			case "lieu de naissance":
				match.Pob = value
			case "âge":
				match.Age = value
			case "poids":
				match.Weight = value
			case "status":
				match.Status = value
			case "style de combat":
				match.FightStyle = value
			}
		})

		e.ForEach(".c-stat-3bar__group", func(i int, h *colly.HTMLElement) {
			value := h.ChildText(".c-stat-3bar__value")
			switch i {
			case 0:
				match.MethodWinKO = value
			case 1:
				match.MethodWinDec = value
			case 2:
				match.MethodWinSub = value
			}
		})

		matchs.Store(detailURL, match)
	})

	c.OnHTML(".view-items-outer-wrp", func(e *colly.HTMLElement) {
		fighterImages := make(map[string]string)
		e.ForEach(".c-listing-athlete-flipcard__front", func(_ int, b *colly.HTMLElement){
			pic := b.ChildAttr("img", "src")
			fighternames := b.ChildText(".c-listing-athlete__name")
			fighterImages[fighternames] = pic
			
			fmt.Println("image fighter ? :",pic)
			fmt.Println("name fighter ? :",fighternames)
		})
		e.ForEach(".c-listing-athlete-flipcard__back", func(_ int, g *colly.HTMLElement) {
			detailsURL := baseURL + g.ChildAttr(".e-button--black ", "href")
			detailCollector.Visit(detailsURL)

			if match, ok := matchs.Load(detailsURL); ok{
				fighter := match.(*MatchAllFighters)
				if img, found := fighterImages[fighter.NomCombattant]; found {
					fighter.ImagePath = img
				}
			}
		})
	})

	c.OnHTML(".button", func(e *colly.HTMLElement) {
		nextPage := e.Attr("href")
		c.Visit(e.Request.AbsoluteURL(nextPage))
	})

	c.OnScraped(func(r *colly.Response) {
		result := make([]*MatchAllFighters, 0)
		matchs.Range(func(key, value interface{}) bool {
			result = append(result, value.(*MatchAllFighters))
			return true
		})

		js, err := json.MarshalIndent(result, "", "    ")
		if err != nil {
			log.Fatal(err)
		}

		if err := os.WriteFile("allFighters.json", js, 0664); err == nil {
			fmt.Println("Scraping data written to file successfully")
		} else {
			log.Printf("Error writing to file: %v", err)
		}
	})

	c.OnError(func(r *colly.Response, err error) {
		log.Printf("Error on %v: %v", r.Request.URL, err)
	})

	c.Visit("https://www.ufc.com/athletes/all?filters%5B0%5D=status%3A23")
}