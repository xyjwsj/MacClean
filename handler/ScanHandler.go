package handler

import (
	"changeme/model"
	"log"
	"time"
)

type ScanHandler struct {
}

func (handler *ScanHandler) Scan(key string) bool {
	log.Println(key)
	for i := 1; i < 5; i++ {
		model.FetchAppInfo().App.EmitEvent("go-event", time.Now().String())
		time.Sleep(time.Millisecond * 500)
	}

	return true
}
