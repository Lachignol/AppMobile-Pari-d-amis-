package helper

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"os"
	"reflect"

	// "github.com/cloudinary/cloudinary-go/v2"
	// "github.com/cloudinary/cloudinary-go/v2/api"
	// "github.com/cloudinary/cloudinary-go/v2/api/admin"
	"github.com/cloudinary/cloudinary-go/v2/api/admin"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

func UploadFileForProfile(c *gin.Context, file *multipart.FileHeader) (string, error) {
	cApiKey := os.Getenv("CLOUNDINARYAPIKEY")
	cApiSecret := os.Getenv("CLOUNDINARYAPISECRET")
	urlCloudinary := fmt.Sprintf("cloudinary://%s:%s@dasxasnc0", cApiKey, cApiSecret)
	ctx := context.Background()
	cld, err := cloudinary.NewFromURL(urlCloudinary)
	if err != nil {
		log.Printf("Error while doing cld")
	}

	user, exist := c.Get("user")
	if !exist {
		log.Printf("User not found in context")
		return "", fmt.Errorf("user not found in context")
	}

	fmt.Printf("user ? %v", user)

	userValue := reflect.ValueOf(user)
	userMap := make(map[string]interface{})

	if userValue.Kind() == reflect.Ptr {
		userValue = userValue.Elem()
	}

	for i := 0; i < userValue.NumField(); i++ {
		field := userValue.Type().Field(i)
		value := userValue.Field(i).Interface()
		userMap[field.Name] = value
	}

	fmt.Printf("user map? %v", userMap)

	pseudo, ok := userMap["Pseudo"].(string)
	if !ok {
		log.Printf("Pseudo not found or invalid type")
		return "", fmt.Errorf("pseudo not found or invalid type")
	}

	res, err := cld.Admin.AssetsByTag(ctx, admin.AssetsByTagParams{Tag: pseudo})
	if err != nil {
		log.Printf("Error retrieving assets: %v", err)
		return "", err
	}

	if len(res.Assets) > 0 {
		publicID := res.Assets[0].PublicID
		_, err := cld.Upload.Destroy(ctx, uploader.DestroyParams{PublicID: publicID})
		if err != nil {
			log.Printf("Error deleting old image: %v", err)
			return "", err
		}
		log.Printf("Old image deleted: %s", publicID)
	}

	resp, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Tags: []string{pseudo},
	})
	if err != nil {
		log.Printf("Error while uploading file to cloudinary db %v", err)
		return "", err
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
