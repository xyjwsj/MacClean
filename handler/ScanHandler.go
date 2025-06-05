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
				if time.Now().UnixMilli()-second < 200 {
					second = time.Now().UnixMilli()
					return
				}
				model.FetchAppInfo().App.EmitEvent("scanEvent", map[string]string{
					"app":  app,
					"size": util.FileSizeCovert(size),
				})
			}, dir, app)
			model.FetchAppInfo().App.EmitEvent("scanEvent", map[string]string{
				"app":  app,
				"size": util.FileSizeCovert(cache.Size),
			})
			cacheRes += cache.Size
		}
		return util.FileSizeCovert(cacheRes)
	case "bigFile":
		size := 0
		second := time.Now().UnixMilli()
		file := service.ScanBigFile(1024*1024*300, func(info model.FInfo) {
			size++
			if time.Now().UnixMilli()-second < 200 {
				second = time.Now().UnixMilli()
				return
			}

			model.FetchAppInfo().App.EmitEvent("scanEvent", map[string]string{
				"app":  info.Name,
				"size": fmt.Sprintf("%d文件", size),
			})
		})
		return fmt.Sprintf("%d文件", file.Count)
	case "process":
		second := time.Now().UnixMilli()
		process, _ := service.ScanProcess(func(info service.ProcessInfo) {
			if time.Now().UnixMilli()-second < 200 {
				second = time.Now().UnixMilli()
				return
			}
			model.FetchAppInfo().App.EmitEvent("scanEvent", map[string]string{
				"app":  info.Name,
				"size": fmt.Sprintf("%d进程", 1),
			})
		})
		time.Sleep(5 * time.Second)
		return fmt.Sprintf("%d进程", len(process))
	case "duplicate":
		second := time.Now().UnixMilli()
		duplicate := 0
		_, _ = service.DuplicateFile(func(file service.SameFile) {
			if time.Now().UnixMilli()-second < 200 {
				second = time.Now().UnixMilli()
				return
			}
			duplicate += len(file.Paths) - 1
			model.FetchAppInfo().App.EmitEvent("scanEvent", map[string]string{
				"app":  file.Md5,
				"size": fmt.Sprintf("%d重复", len(file.Paths)),
			})
		})

		return fmt.Sprintf("%d重复", duplicate)
	default:
		time.Sleep(time.Millisecond * 5000)
	}

	return ""
}
