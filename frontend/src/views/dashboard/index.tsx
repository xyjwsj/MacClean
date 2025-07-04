import bigfile3dIcon from "@/assets/png/bigfile-3d.png";
import cache3dIcon from "@/assets/png/cache-3d.png";
import duplicate3dIcon from "@/assets/png/duplicate-3d.png";
import process3dIcon from "@/assets/png/process-3d.png";
import {Scan} from "@/bindings/changeme/handler/scanhandler.ts";
import {Events} from "@wailsio/runtime";
import {defineComponent, inject, onUnmounted, reactive} from "vue";
import styled from "vue3-styled-components";
import RotateImage from "@/components/rotateImage.tsx";

export default defineComponent({
    name: "Dashboard",
    setup(_, {expose}) {
        const Container = styled.div`
            width: 100%;
            height: calc(100% - 20px);
            padding-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 50px;

            .an-container {
                margin: 0 auto;
                width: calc(100% - 60px);
                height: 480px;
                display: flex;
                flex-direction: column;
                position: relative;
                gap: 20px;

                .an-content {
                    display: flex;
                    position: relative;
                    flex-grow: 1;
                    transition: flex-grow 0.5s;
                    gap: 20px;

                    .an-item {
                        height: 100%;
                        padding: 20px;
                        border-radius: 20px;
                        /* 玻璃核心样式 */
                        //flex-grow: 1;
                        flex: 1;
                        transition: flex-grow 0.5s;
                        position: relative;
                        overflow: hidden;
                        background: rgba(255, 255, 255, 0.1);
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;

                        .rotate {
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            background: transparent;
                            border-radius: 20px;
                            top: 0;
                            left: 0;
                            opacity: 0.1;
                            transition: all 1s;
                            //z-index: -1;
                            overflow: hidden;
                        }

                        .startRotate {
                            &:after {
                                content: "";
                                display: block;
                                width: 300%;
                                height: 300%;
                                position: absolute;
                                z-index: -3;
                                top: -100%;
                                left: -100%;
                                background: conic-gradient(
                                        rgba(212, 214, 240, 0.5),
                                        rgba(212, 214, 240, 0.9)
                                );
                                border-radius: 20px;
                                transform-origin: center center;
                                animation: loader 3s linear infinite;
                            }
                        }

                        .title {
                            color: #fafafa;
                            width: 100%;
                            //height: 20%;
                            //line-height: 20%;
                            /* background-color: yellow; */
                        }

                        .runTip {
                            width: 100%;
                            height: 100%;
                            color: wheat;
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-end;
                            align-items: center;
                            transition: all 1s;
                            gap: 5px;

                            .idxImg {
                                position: absolute;
                                top: 55px;
                                max-width: 150px;
                            }

                            .title {
                                width: 100%;
                                font-size: 32px;
                            }

                            .content {
                                max-width: 200px;
                                max-height: 50px;
                                font-size: 19px;
                                //line-height: 30px;
                                overflow: hidden;
                            }

                            .desc {
                                width: 100px;
                                font-size: 15px;
                                color: lightgray;
                            }
                        }

                        .content {
                            display: flex;
                            height: 70%;
                            flex-direction: column;
                            justify-content: flex-end;

                            .body {
                                color: white;
                                font-size: 32px;
                                max-width: 150px;
                                max-height: 45px;
                                font-weight: 700;
                                height: 60px;
                                overflow: hidden;
                            }

                            .footer {
                                max-width: 80px;
                                //height: 10%;
                                max-height: 15px;
                                color: lightgray;
                                /* background-color: green; */
                            }
                        }
                    }
                }
            }

            @keyframes loader {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        `;

        const BkImg = styled.div`
            background: url(${(props: any) => props.icon});
            width: 100%;
            height: 100%;
            position: absolute;
            background-size: cover;
            left: 0;
            top: 0;
            opacity: 0.2;
            transform: scale(1.3);
            //transform: translate(-50%, -50%);
            transition: all 1s;
            z-index: -1;
        `;

        const cardData = reactive([
            {
                key: "row1",
                flexGrow: 1,
                data: [
                    {
                        key: "cache",
                        flexGrow: 1,
                        title: "缓存",
                        icon: cache3dIcon,
                        finish: false,
                    },
                    {
                        key: "process",
                        flexGrow: 1,
                        title: "进程",
                        icon: process3dIcon,
                        finish: false,
                    },
                    // {
                    //     key: "application",
                    //     flexGrow: 1,
                    //     title: "应用",
                    //     icon: appstore3dIcon,
                    //     finish: false,
                    // },
                ],
            },
            {
                key: "row2",
                flexGrow: 1,
                data: [
                    {
                        key: "bigFile",
                        flexGrow: 1,
                        title: "大文件",
                        icon: bigfile3dIcon,
                        finish: false,
                    },
                    {
                        key: "duplicate",
                        flexGrow: 1,
                        title: "重复文件",
                        icon: duplicate3dIcon,
                        finish: false,
                    },
                ],
            },
        ]);

        const items = reactive([
            {
                key: "cache",
                size: ""
            },
            {
                key: "process",
                size: ""
            },
            // {
            //     key: "application",
            //     size: ""
            // },
            {
                key: "bigFile",
                size: ""
            },
            {
                key: "duplicate",
                size: ""
            }
        ])

        const collect = (key: string) => {
            const filter = items.filter(item => item.key === key);
            if (filter.length > 0) {
                return filter[0].size === "" ? "无结果" : filter[0].size
            }
            return ""
        }

        const start = async () => {
            scan.status = true;
            scan.finish = false;
            for (let idx = 0; idx < items.length; idx++) {
                startScan(idx);
                let item = items[idx];
                const result = await Scan(item.key);
                items[idx].size = result
                console.log(item, idx, result);
            }
            startScan(items.length);
            scan.status = false;
            scan.finish = true;
            finishScan()
        };

        const startScan = (idx: number) => {
            const oldIdx = idx - 1;
            const newIdx = idx;
            const oldKey = oldIdx < 0 ? "" : items[oldIdx].key;
            const newKey = newIdx > items.length - 1 ? "" : items[newIdx].key;
            cardData.forEach((item) => {
                item.data.forEach((itm) => {
                    if (itm.key === newKey) {
                        itm.flexGrow = 3;
                        item.flexGrow = 2;
                    } else if (itm.key === oldKey) {
                        itm.flexGrow = 1;
                        item.flexGrow = 1;
                        resInfo.app = "扫描中"
                        resInfo.size = '统计中'
                        itm.finish = true;
                    } else {
                        itm.flexGrow = 1;
                    }
                });
            });
        };

        const executeAction = () => {
            if (!scan.status) {
                Events.On("scanEvent", (data: any) => {
                    console.log("收到数据:", data);
                    resInfo.app = data.data[0].app
                    resInfo.size = data.data[0].size
                });

                cardData.forEach((item) => {
                    item.data.forEach((itm) => {
                        itm.finish = false;
                    });
                });

                start();
                return scan.status;
            }
            console.log("==========", scan.status);
            return scan.status;
        };

        onUnmounted(() => {
            Events.Off("go-event");
        });

        expose({executeAction});

        const finishScan: any = inject("finishScan");

        const resInfo = reactive({
            app: '',
            size: '',
        })

        const scan = reactive({
            status: false,
            finish: false,
        });

        return () => (
            <Container>
                <div class={"an-container"}>
                    {cardData.map((row) => {
                        return (
                            <div class={"an-content"} style={{flexGrow: row.flexGrow}}>
                                {row.data.map((col) => {
                                    return (
                                        <div
                                            class="an-item"
                                            style={{
                                                flexGrow: col.flexGrow,
                                            }}
                                        >
                                            {
                                                //@ts-ignore
                                                <BkImg icon={col.icon}></BkImg>
                                            }
                                            <div
                                                class={[
                                                    "rotate",
                                                    col.flexGrow > 1 ? "startRotate" : "",
                                                ]}
                                            ></div>
                                            <div class={"title"}>{col.title}</div>
                                            {col.flexGrow > 1 && (
                                                <div class={"runTip"}>
                                                    <RotateImage class={'idxImg'} icon={col.icon} width={100}
                                                                 auto={true}></RotateImage>
                                                    <div class={"title"}>{resInfo.app}</div>
                                                    <div class={"content"}>{resInfo.size}</div>
                                                </div>
                                            )}
                                            {col.finish && (
                                                <div class={"content"}>
                                                    {col.finish && <div class={"body"}>{collect(col.key)}</div>}
                                                    {col.finish && <div class={"footer"}>{"可清除"}</div>}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </Container>
        );
    },
});
