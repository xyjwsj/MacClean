package handler

import (
	"changeme/model"
	"changeme/service"
	"changeme/util"
	"fmt"
	"log"
	"time"
)

var apps = map[string]string{
	"Google":   "Chrome",
	"Quark":    "Default",
	"Homebrew": "Backup",
}

type ScanHandler struct {
}

func (handler *ScanHandler) Scan(key string) string {
	log.Println(key)
	switch key {
	case "cache":
		cacheRes := int64(0)
		second := time.Now().UnixMilli()
		for dir, app := range apps {
			size := int64(0)
			cache := service.ScanCache(func(info model.FInfo) {
				size += info.Size
				if time.Now().UnixMilli()-second < 1000 {
					second = time.Now().UnixMilli()
					return
				}
				model.FetchAppInfo().App.EmitEvent("scanEvent", map[string]string{
					"app":  app,
					"size": util.FileSizeCovert(size),
				})
				log.Println(app + "-size=" + util.FileSizeCovert(size))
			}, dir, app)
			model.FetchAppInfo().App.EmitEvent("scanEvent", map[string]string{
				"app":  app,
				"size": util.FileSizeCovert(cache.Size),
			})
			cacheRes += cache.Size
		}
		return util.FileSizeCovert(cacheRes)
	case "bigFile":
		num := 0
		size := 0
		file := service.ScanBigFile(1024*1024*300, func(info model.FInfo) {
			num++
			size++
			//if num%3 != 0 {
			//	return
			//}

			model.FetchAppInfo().App.EmitEvent("scanEvent", map[string]string{
				"app":  info.Name,
				"size": fmt.Sprintf("%d文件", size),
			})
		})
		return fmt.Sprintf("%d文件", file.Count)
	case "process":
		num := 0
		process, _ := service.ScanProcess(func(info service.ProcessInfo) {
			num++
			if num%10 != 0 {
				return
			}
			model.FetchAppInfo().App.EmitEvent("scanEvent", map[string]string{
				"app":  info.Name,
				"size": fmt.Sprintf("%d进程", num),
			})
		})
		time.Sleep(5 * time.Second)
		return fmt.Sprintf("%d进程", len(process))
	case "duplicate":
		num := 0
		duplicate := 0
		_, _ = service.DuplicateFile(func(file service.SameFile) {
			num++
			duplicate += len(file.Paths) - 1
			model.FetchAppInfo().App.EmitEvent("scanEvent", map[string]string{
				"app":  file.Md5,
				"size": fmt.Sprintf("%d重复", duplicate),
			})
		})

		return fmt.Sprintf("%d重复", duplicate)
	default:
		time.Sleep(time.Millisecond * 5000)
	}

	return ""
}
