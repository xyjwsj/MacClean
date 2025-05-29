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
	model.FetchAppInfo().App.EmitEvent("go-event", "aaaa")
	time.Sleep(time.Second * 5)
	return true
}
