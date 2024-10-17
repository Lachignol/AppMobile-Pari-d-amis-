package helper

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"os"

	// "github.com/cloudinary/cloudinary-go/v2"
	// "github.com/cloudinary/cloudinary-go/v2/api"
	// "github.com/cloudinary/cloudinary-go/v2/api/admin"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

func UploadFileForGroup(c *gin.Context, file *multipart.FileHeader) (string, error) {
	cApiKey := os.Getenv("CLOUNDINARYAPIKEY")
	cApiSecret := os.Getenv("CLOUNDINARYAPISECRET")
	urlCloudinary := fmt.Sprintf("cloudinary://%s:%s@dasxasnc0", cApiKey, cApiSecret)
	ctx := context.Background()
	cld, err := cloudinary.NewFromURL(urlCloudinary)
	if err != nil  {
		log.Printf("Error while doing cld")
	}
	resp, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{}) 
	if err != nil {
		log.Printf("Error while uploading file to cloudinary db")
	}
	return resp.SecureURL, nil
	// dst := "./static/avatar/" + file.Filename
	// err := c.SaveUploadedFile(file, dst)
	// if err != nil {
	// 	return "", err
	// }
	// log.Printf("'%s' uploaded!", file.Filename)
	// return file.Filename, nil
}