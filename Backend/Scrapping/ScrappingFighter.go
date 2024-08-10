package scrapping


import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gocolly/colly"
)

type Match struct {
	NomCombattant  string
	ImagePath string
}

func ScrappingImageFighter() {
	c := colly.NewCollector()
	c.SetRequestTimeout(120 * time.Second)
	matchs := make([]Match, 0)

	// Callbacks


		c.OnHTML(".hero-profile__image-wrap", func(e *colly.HTMLElement) {
		
			item := Match{}
			item.NomCombattant = "shamil-abdurakhimov"
			item.ImagePath = e.ChildAttr("img","src")


			matchs = append(matchs, item)

			//    fmt.Println("enfant", h.ChildAttrs("img","alt") )
		})

		

			//    fmt.Println("enfant", h.ChildAttrs("img","alt") )
	



	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL)
	})

	c.OnResponse(func(r *colly.Response) {
		fmt.Println("Got a response from", r.Request.URL)
	})

	c.OnError(func(r *colly.Response, e error) {
		fmt.Println("Got this error:", e)
	})

	c.OnScraped(func(r *colly.Response) {
		fmt.Println("Finished", r.Request.URL)
		js, err := json.MarshalIndent(matchs, "", "    ")
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Writing data to file")
		if err := os.WriteFile("products.json", js, 0664); err == nil {
			fmt.Println("Data written to file successfully")
		}

	})

	c.Visit("https://www.ufc.com/athlete/shamil-abdurakhimov")
	
}
