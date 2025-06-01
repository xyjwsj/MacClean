package model

import (
	"changeme/util"
	"os"
	"os/user"
)

var (
	CacheDir       string
	SystemCacheDir string
	UserHomeDir    string
)

func init() {
	SystemCacheDir, _ = os.UserCacheDir()
	CacheDir = util.CreatePlatformPath(SystemCacheDir, "MacClean")
	u, _ := user.Current()
	UserHomeDir = u.HomeDir
}
