package service

import (
	"changeme/model"
	"changeme/util"
	"os"
)

type CacheCall func(info model.FInfo)

func ScanCache(call CacheCall, paths ...string) model.AppCache {
	path := util.CreatePlatformPath(model.SystemCacheDir)
	for _, p := range paths {
		path = util.CreatePlatformPath(path, p)
	}
	infos := make([]model.FInfo, 0)
	_ = browserScan(path, &infos, call)
	i := calculate(infos)
	return model.AppCache{
		Size:  i,
		Files: infos,
	}
}

func browserScan(dir string, infos *[]model.FInfo, call CacheCall) error {
	readDir, _ := os.ReadDir(dir)
	for _, item := range readDir {
		info, _ := item.Info()
		fInfo := model.FInfo{
			Name:       info.Name(),
			ParentPath: dir,
			Dir:        info.IsDir(),
			Size:       info.Size(),
			Children:   nil,
		}

		call(fInfo)

		if info.IsDir() {
			children := make([]model.FInfo, 0)
			browserScan(util.CreatePlatformPath(dir, info.Name()), &children, call)
			fInfo.Children = children
		}
		*infos = append(*infos, fInfo)
	}
	return nil
}

func calculate(data []model.FInfo) int64 {
	size := int64(0)
	for _, item := range data {
		if item.Dir {
			children := item.Children
			item.Size += calculate(children)
		}
		size += item.Size
	}
	return size
}
