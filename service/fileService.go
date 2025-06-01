package service

import (
	"changeme/model"
	"changeme/util"
	"os"
	"path/filepath"
	"sync"
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

type FileIdx struct {
	Path  string
	Md5   string
	Index int
}

func DuplicateFile() ([][]FileIdx, error) {
	duplicate := make([][]FileIdx, 0)
	dir := model.UserHomeDir
	file, err := util.SameSizeFile(5, filepath.Join(dir, "Documents"),
		filepath.Join(dir, "Downloads"),
		//filepath.Join(dir, "Desktop"),
	)
	if err != nil {
		return nil, err
	}
	for _, item := range file {
		if len(item) == 0 {
			continue
		}
		for idx, fileGroup := range item {
			var wg sync.WaitGroup
			goOnce := new(sync.Once)
			errChan := make(chan error, 1)
			resChan := make(chan FileIdx, len(fileGroup.Paths))
			for _, path := range fileGroup.Paths {
				wg.Add(1)
				go func(p string, idx int) {
					defer wg.Done()
					md5, err2 := util.FileMd5Goroutine(p)
					if err2 != nil {
						goOnce.Do(func() {
							errChan <- err2
						})
						return
					}
					resChan <- FileIdx{
						Path:  p,
						Md5:   md5,
						Index: idx,
					}
				}(path, idx)

			}
			// 等待所有协程完成
			go func() {
				wg.Wait()
				close(resChan)
			}()

			// 接收错误或结果
			var firstResult *FileIdx
			// 接收错误或结果
			select {
			case err := <-errChan:
				return nil, err
			case first := <-resChan: // 确保至少有一个结果
				firstResult = &first
				break
			}

			idxes := make([]FileIdx, 0)
			if firstResult != nil {
				idxes = append(idxes, *firstResult)
			}
			for res := range resChan {
				idxes = append(idxes, res)
			}

			fileIdxes := make([]FileIdx, 0)

			for idx, item := range idxes {
				if idx >= len(idxes)-1 {
					continue
				}
				for _, itm := range idxes[idx+1:] {
					if item.Md5 == itm.Md5 {
						fileIdxes = append(fileIdxes, itm)
					}
				}
			}
			if len(fileIdxes) > 0 {
				duplicate = append(duplicate, fileIdxes)
			}
		}
	}
	return duplicate, nil
}
