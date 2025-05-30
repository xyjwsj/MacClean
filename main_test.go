package main

import (
	"changeme/model"
	"changeme/service"
	"changeme/util"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"testing"
)

func TestScanCache(t *testing.T) {
	cache := service.ScanCache(func(info model.FInfo) {
		path := util.CreatePlatformPath(info.ParentPath, info.Name)
		log.Println(path, info.Dir, info.Size)
	})
	log.Println(cache)
}

func TestDir(t *testing.T) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		fmt.Println("获取用户主目录失败:", err)
		return
	}

	documentsPath := filepath.Join(homeDir, "Documents")
	fmt.Println("Documents 目录路径:", documentsPath)

	service.ScanBigFile(1024*1024*300, func(info model.FInfo) {
		path := util.CreatePlatformPath(info.ParentPath, info.Name)
		log.Println(path, info.Dir, info.Size)
	})
}
