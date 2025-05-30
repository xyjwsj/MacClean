package handler

import (
	"changeme/model"
	"changeme/service"
	"changeme/util"
	"fmt"
	"log"
	"time"
)

type ScanHandler struct {
}

func (handler *ScanHandler) Scan(key string) string {
	log.Println(key)
	switch key {
	case "cache":
		{
			num := 0
			size := int64(0)
			cache := service.ScanCache(func(info model.FInfo) {
				num++
				size += info.Size
				if num%10 != 0 {
					return
				}
				model.FetchAppInfo().App.EmitEvent("scanEvent", map[string]string{
					"app":  "Chrome",
					"size": util.FileSizeCovert(size),
				})
			}, "Google", "Chrome")
			return util.FileSizeCovert(cache.Size)
		}
	case "bigFile":
		{
			num := 0
			size := 0
			file := service.ScanBigFile(1024*1024*300, func(info model.FInfo) {
				num++
				size++
				//if num%3 != 0 {
				//	return
				//}

				model.FetchAppInfo().App.EmitEvent("scanEvent", map[string]string{
					"app":  "Chrome",
					"size": fmt.Sprintf("%d个文件", size),
				})
			})
			return fmt.Sprintf("%d个文件", file.Count)
		}
	default:
		time.Sleep(time.Millisecond * 5000)
	}

	return ""
}
