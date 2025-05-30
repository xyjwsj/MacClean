package service

import (
	"changeme/model"
	"changeme/util"
	"os"
	"path/filepath"
)

func ScanBigFile(overSize int64, call CacheCall) model.BigFiles {
	homeDir, _ := os.UserHomeDir()

	infos := make([]model.FInfo, 0)

	documentsPath := filepath.Join(homeDir, "Documents")
	downloadPath := filepath.Join(homeDir, "Downloads")

	bigScan(documentsPath, overSize, &infos, call)
	bigScan(downloadPath, overSize, &infos, call)

	count := calculateCount(infos, overSize)

	return model.BigFiles{
		Count: count,
		Files: infos,
	}
}

func ScanDuplicateFile(call CacheCall) model.BigFiles {

	return model.BigFiles{}
}

func bigScan(dir string, overSize int64, infos *[]model.FInfo, call CacheCall) error {
	readDir, _ := os.ReadDir(dir)
	for _, item := range readDir {
		info, _ := item.Info()
		if !info.IsDir() && info.Size() < overSize {
			continue
		}
		fInfo := model.FInfo{
			Name:       info.Name(),
			ParentPath: dir,
			Dir:        info.IsDir(),
			Size:       info.Size(),
			Children:   nil,
		}

		if !info.IsDir() {
			call(fInfo)
		}

		if info.IsDir() {
			children := make([]model.FInfo, 0)
			bigScan(util.CreatePlatformPath(dir, info.Name()), overSize, &children, call)
			fInfo.Children = children
		}
		*infos = append(*infos, fInfo)
	}
	return nil
}

func calculateCount(data []model.FInfo, overSize int64) int {
	size := 0
	for _, item := range data {
		if item.Size > overSize {
			children := item.Children
			size += calculateCount(children, overSize)
		}
		size++
	}
	return size
}
