package model

type FInfo struct {
	Name       string  `json:"name"`
	ParentPath string  `json:"parentPath"`
	Dir        bool    `json:"dir"`
	Size       int64   `json:"size"`
	Children   []FInfo `json:"children"`
}

type AppCache struct {
	Size  int64   `json:"size"`
	Files []FInfo `json:"files"`
}

type BigFiles struct {
	Count int     `json:"count"`
	Files []FInfo `json:"files"`
}
