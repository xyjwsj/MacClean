package model

import (
	"changeme/util"
	"os"
)

var (
	CacheDir       string
	SystemCacheDir string
)

func init() {
	SystemCacheDir, _ = os.UserCacheDir()
	CacheDir = util.CreatePlatformPath(SystemCacheDir, "MacClean")
}
