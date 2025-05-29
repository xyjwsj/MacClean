import appstore3dIcon from "@/assets/png/appstore-3d.png";
import bigfile3dIcon from "@/assets/png/bigfile-3d.png";
import cache3dIcon from "@/assets/png/cache-3d.png";
import duplicate3dIcon from "@/assets/png/duplicate-3d.png";
import process3dIcon from "@/assets/png/process-3d.png";
import {defineComponent, onUnmounted, reactive} from "vue";
import styled from "vue3-styled-components";
import {Scan} from "@/bindings/changeme/handler/scanhandler.ts";
import {TipSuccess} from "@/util/messageUtil.ts";
import {Events} from "@wailsio/runtime";

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
                        flex-grow: 1;
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
                            top: 0;
                            left: 0;
                            opacity: 0.1;
                            transition: all 1s;
                            z-index: -1;
                        }

                        .startRotate {
                            &:after {
                                content: "";
                                display: block;
                                width: 300%;
                                height: 300%;
                                position: absolute;
                                z-index: -2;
                                top: -100%;
                                left: -100%;
                                background: conic-gradient(
                                        rgba(212, 214, 240, 0.5),
                                        rgba(212, 214, 240, 0.9)
                                );
                                transform-origin: center center;
                                animation: loader 3s linear infinite;
                            }
                        }

                        .title {
                            color: #fafafa;
                            width: 100%;
                            height: 20%;
                            line-height: 20%;
                            /* background-color: yellow; */
                        }

                        .runTip {
                            width: 100%;
                            height: 80%;
                            color: wheat;
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-end;
                            align-items: center;
                            transition: all 1s;

                            .title {
                                width: 100%;
                                height: 100px;
                                line-height: 100px;
                                font-size: 32px;
                            }

                            .content {
                                //width: 100%;
                                height: 50px;
                                font-size: 19px;
                                line-height: 50px;
                            }

                            .desc {
                                //width: 100%;
                                height: 35px;
                                font-size: 15px;
                                color: lightgray;
                                line-height: 35px;
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
                                width: 100%;
                                font-weight: 700;
                                height: 60px;
                                /* background-color: red; */
                            }

                            .footer {
                                width: 100%;
                                height: 10%;
                                color: lightgray;
                                /* background-color: green; */
                            }
                        }

                    }
                }
            }

            .start {
                width: 60px;
                height: 60px;
                border-radius: 30px;
                //background: rgba(212, 214, 240, .2);
                //background-color: black;
                -webkit-backdrop-filter: blur(5px);
                backdrop-filter: blur(5px);
                line-height: 60px;
                text-align: center;
                box-shadow: 0 0 10px 10px rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.5);
                font-weight: bold;
                z-index: 2;
                position: relative;
                overflow: hidden;
                transition: all 0.4s;

                &:hover {
                    background: rgba(212, 214, 240, 0.4);
                    color: rgba(255, 255, 255, 0.9);
                }
            }

            .startAnimation {
                &:after {
                    content: "";
                    display: block;
                    width: 300%;
                    height: 300%;
                    position: absolute;
                    z-index: -2;
                    top: -100%;
                    left: -100%;
                    background: conic-gradient(
                            rgba(212, 214, 240, 0.5),
                            rgba(212, 214, 240, 0.9)
                    );
                    transform-origin: center center;
                    animation: loader 3s linear infinite;
                }

                &:before {
                    content: "";
                    display: block;
                    position: absolute;
                    inset: 3px;
                    z-index: -1;
                    background: orange;
                    //background: rgba(212, 214, 240, .8);
                    border-radius: inherit;
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
        `

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
                    {
                        key: "application",
                        flexGrow: 1,
                        title: "应用",
                        icon: appstore3dIcon,
                        finish: false,
                    },
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

        const items = [
            "cache",
            "process",
            "application",
            "bigFile",
            "duplicate",
        ]

        const start = async () => {
            scan.status = true
            scan.finish = false
            startScan(1)
            for (let idx = 0; idx < items.length; idx++) {
                startScan(idx)
                let item = items[idx];
                const result = await Scan(item)
                console.log(item, idx, result)
            }
            startScan(items.length)
            scan.status = false
            scan.finish = true
        }

        const startScan = (idx: number) => {
            const oldIdx = idx - 1;
            const newIdx = idx;
            const oldKey = oldIdx < 0 ? "" : items[oldIdx]
            const newKey = newIdx > items.length - 1 ? "" : items[newIdx]
            cardData.forEach((item) => {
                item.data.forEach((itm) => {
                    if (itm.key === newKey) {
                        itm.flexGrow = 4
                    } else if (itm.key === oldKey) {
                        itm.flexGrow = 1
                        itm.finish = true
                    } else {
                        itm.flexGrow = 1
                    }
                })
            })
        }


        const executeAction = async () => {
            if (!scan.status && !scan.finish) {
                Events.On("go-event", (data: any) => {
                    console.log("收到数据:", data);
                    TipSuccess("后端数据" + JSON.stringify(data));
                })
                await start()
                return scan.status
            }
            return scan.status
        };

        onUnmounted(() => {
            (window as any).runtime.EventsOff('go-event')
        })

        expose({executeAction});

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
                                        <div class="an-item" style={{
                                            flexGrow: col.flexGrow
                                        }}>
                                            {//@ts-ignore
                                                <BkImg icon={col.icon}></BkImg>
                                            }
                                            <div class={['rotate', col.flexGrow > 1 ? "startRotate" : '']}></div>
                                            <div class={"title"}>{col.title}</div>
                                            {col.flexGrow > 1 && <div class={"runTip"}>
                                                <div class={'title'}>{'TITLE'}</div>
                                                <div class={'content'}>{'CONTENT'}</div>
                                                <div class={'desc'}>{'DESC'}</div>
                                            </div>}
                                            {col.finish && <div class={'content'}>
                                                {col.finish && <div class={"body"}>{"无结果"}</div>}
                                                {col.finish && <div class={"footer"}>{"可清除"}</div>}
                                            </div>}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                {/* <div class={['start', scan.value ? 'startAnimation' : '']} onClick={() => {
                    if (scan.value) {
                        TipWarning('正在扫描中，请稍后')
                        return
                    }
                    scan.value = next()
                    const timer = setInterval( () => {
                        scan.value = next()
                        if (!scan.value) {
                            clearInterval(timer)
                        }
                    }, 5000);
                }}>{'扫描'}</div> */}
            </Container>
        );
    },
});
