package main

import (
	"changeme/model"
	"changeme/service"
	"changeme/util"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strconv"
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

func TestBigfileMD5(t *testing.T) {
	goroutine, err := util.FileMd5Goroutine("/Users/wushaojie/Documents/software/Animate24.0.2.dmg")
	if err != nil {
		log.Panic(err)
	}
	log.Println("文件Md5:" + goroutine)
}

func TestDuplicateFile(t *testing.T) {
	file, err := service.DuplicateFile(nil)
	if err != nil {
		log.Panic(err)
	}

	for idx, itm := range file {
		log.Printf("相同文件%d，路径%s", idx, itm.Paths)
	}

	log.Println("重复文件个数：" + strconv.Itoa(len(file)))
	log.Println(file)
}

func TestShell(t *testing.T) {
	util.Shell("ps", "aux")
}
