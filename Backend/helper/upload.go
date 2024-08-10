package helper

import (
	"log"
	"mime/multipart"

	"github.com/gin-gonic/gin"
)

func UploadFile(c *gin.Context, file *multipart.FileHeader) (string, error) {

	dst := "./static/avatar/" + file.Filename
	err := c.SaveUploadedFile(file, dst)
	if err != nil {
		return "", err
	}
	log.Printf("'%s' uploaded!", file.Filename)
	return file.Filename, nil
}
