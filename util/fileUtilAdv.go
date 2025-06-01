package util

import (
	"crypto/md5"
	"errors"
	"fmt"
	"io"
	"os"
	"path"
	"path/filepath"
	"sort"
	"strings"
	"sync"
)

const chunkSize = 20 * 1024 * 1024
const maxConcurrency = 4 // 控制最大并发数

func FileMd5Goroutine(path string) (string, error) {
	if !IsFileExists(path) {
		return "", errors.New("File Not Exist")
	}

	file, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()

	fi, err := file.Stat()
	if err != nil {
		return "", err
	}
	fileSize := fi.Size()

	type chunkResult struct {
		index int
		data  []byte
	}

	var wg sync.WaitGroup
	resultChan := make(chan chunkResult, (fileSize+chunkSize-1)/chunkSize)
	errChan := make(chan error, 1)
	goOnce := new(sync.Once)

	// 分块并发处理
	for i := int64(0); i < fileSize; i += chunkSize {
		index := i / chunkSize
		chunkEnd := i + chunkSize
		if chunkEnd > fileSize {
			chunkEnd = fileSize
		}
		size := chunkEnd - i

		wg.Add(1)
		go func(offset int64, size int64, index int) {
			defer wg.Done()

			buffer := make([]byte, size)
			_, err := file.ReadAt(buffer, offset)
			if err != nil && err != io.EOF {
				goOnce.Do(func() {
					errChan <- err
				})
				return
			}

			resultChan <- chunkResult{index: index, data: buffer}
		}(i, size, int(index))
	}

	// 等待所有协程完成
	go func() {
		wg.Wait()
		close(resultChan)
	}()

	// 接收错误或结果
	var firstResult *chunkResult
	// 接收错误或结果
	select {
	case err := <-errChan:
		return "", err
	case first := <-resultChan: // 确保至少有一个结果
		firstResult = &first
		break
	}

	// 按照 index 排序收集数据
	results := make([]chunkResult, 0)
	if firstResult != nil {
		results = append(results, *firstResult)
	}
	for res := range resultChan {
		results = append(results, res)
	}

	// 按 index 排序
	sort.Slice(results, func(i, j int) bool {
		return results[i].index < results[j].index
	})

	// 合并所有 chunk 并计算整体 MD5
	finalHash := md5.New()
	for _, res := range results {
		_, err := finalHash.Write(res.data)
		if err != nil {
			return "", err
		}
	}

	return fmt.Sprintf("%x", finalHash.Sum(nil)), nil
}

type FileGroup struct {
	Extend string
	Paths  []string
}

func SameSizeFile(dep int, dir ...string) (map[int64][]FileGroup, error) {
	res := make(map[int64][]FileGroup)
	for _, path := range dir {
		err := collectFiles(path, dep, &res)
		if err != nil {
			return nil, err
		}
	}
	for size, fileGroups := range res {
		for idx, itm := range fileGroups {
			if len(itm.Paths) <= 1 {
				res[size] = append(fileGroups[:idx], fileGroups[idx+1:]...)
			}
		}
	}
	return res, nil
}

func collectFiles(dir string, dep int, files *map[int64][]FileGroup) error {
	if dep <= 0 {
		return nil
	}
	readDir, err := os.ReadDir(dir)
	if err != nil {
		return err
	}
	for _, item := range readDir {
		if strings.HasPrefix(item.Name(), ".") {
			continue
		}
		if item.IsDir() {
			fullPath := filepath.Join(dir, item.Name())
			// 递归调用，继续深入
			err := collectFiles(fullPath, dep-1, files)
			if err != nil {
				return err
			}
			continue
		}
		info, err := item.Info()
		if err != nil {
			return err
		}

		fileSuffix := path.Ext(info.Name())

		if f, ok := (*files)[info.Size()]; ok {
			exist := false
			for idx, itm := range f {
				if itm.Extend == fileSuffix {
					f[idx].Paths = append(f[idx].Paths, filepath.Join(dir, item.Name()))
					exist = true
					break
				}
			}
			if !exist {
				(*files)[info.Size()] = []FileGroup{
					{
						Extend: fileSuffix,
						Paths:  []string{filepath.Join(dir, item.Name())},
					},
				}
			}
		} else {
			(*files)[info.Size()] = []FileGroup{
				{
					Extend: fileSuffix,
					Paths:  []string{filepath.Join(dir, item.Name())},
				},
			}
		}
	}
	return nil
}
