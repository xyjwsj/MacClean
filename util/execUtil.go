package util

import (
	"bytes"
	"log"
	"os/exec"
	"regexp"
	"strings"
)

type ShellResult struct {
	User        string `json:"user"`
	Cpu         string `json:"cpu"`
	Memory      string `json:"memory"`
	Cmd         string `json:"cmd"`
	Application string `json:"application"`
}

func Shell(shell string, params ...string) ([]ShellResult, error) {
	cmd := exec.Command(shell, params...)
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout // 标准输出
	cmd.Stderr = &stderr // 标准错误
	err := cmd.Run()
	outStr := string(stdout.Bytes())
	split := strings.Split(outStr, "\n")
	results := make([]ShellResult, 0)
	for idx, item := range split {
		if idx == 0 {
			continue
		}
		info := strings.Fields(item)
		if len(info) < 10 {
			continue
		}
		application := ""
		re := regexp.MustCompile(`/Applications/([^/]+)`)
		match := re.FindStringSubmatch(info[10])
		if len(match) > 0 {
			application = match[len(match)-1]
		}

		re = regexp.MustCompile(`/(PrivateFrameworks|Frameworks)/([^/]+)`)
		match = re.FindStringSubmatch(info[10])
		if len(match) > 0 {
			application = match[len(match)-1]
		}

		re = regexp.MustCompile(`/Frameworks/([^/]+)`)
		match = re.FindStringSubmatch(info[10])
		if len(match) > 0 {
			application = match[len(match)-1]
		}

		results = append(results, ShellResult{
			User:        info[0],
			Cpu:         info[2],
			Memory:      info[3],
			Cmd:         info[10],
			Application: application,
		})
	}
	if err != nil {
		log.Fatalf("cmd.Run() failed with %s\n", err)
	}
	//log.Println(Struct2Json(results))
	return results, err
}
