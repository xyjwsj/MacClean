package service

import "changeme/util"

type ProcessInfo struct {
	Name string `json:"name"`
}

type ProcessCall func(info ProcessInfo)

func ScanProcess(call ProcessCall) ([]ProcessInfo, error) {
	shell, err := util.Shell("ps", "aux")
	if err != nil {
		return nil, err
	}
	infos := make([]ProcessInfo, 0)
	for _, itm := range shell {
		info := ProcessInfo{Name: itm.Application}
		infos = append(infos, info)
		call(info)
	}
	return infos, err
}
