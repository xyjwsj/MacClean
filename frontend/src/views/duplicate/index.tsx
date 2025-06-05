import duplicate3dIcon from "@/assets/png/duplicate-3d.png";
import RotateImage from "@/components/rotateImage";
import {FolderOutlined} from "@ant-design/icons-vue";
import {Progress} from "ant-design-vue";
import {defineComponent, inject, reactive, ref, Transition} from "vue";
import styled from "vue3-styled-components";

export default defineComponent({
    name: "Cache",
    setup(_, {expose}) {
        const Container = styled.div`
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 50px;

            /* 右进右出动画样式 */

            .slide-right-enter-active,
            .slide-right-leave-active {
                transition: all 0.5s ease;
            }

            .slide-right-enter-from {
                transform: translateX(30%);
                opacity: 0;
            }

            .slide-right-enter-to {
                transform: translateX(0);
                opacity: 1;
            }

            .slide-right-leave-from {
                transform: translateX(0);
                opacity: 1;
            }

            .slide-right-leave-to {
                transform: translateX(30%);
                opacity: 0;
            }

            .content {
                width: calc(100% - 100px);
                height: calc(100% - 50px);
                background: rgba(255, 255, 255, 0.1);
                border-radius: 30px;
                box-shadow: 0 0 3px 3px rgba(255, 255, 255, 0.1);
                display: flex;
                justify-content: flex-end;
                align-items: center;
                position: relative;

                .rotateImg {
                    left: 50%;
                    top: 50px;
                    transform: translate(-50%);
                    transition: transform 0.8s;
                    position: absolute;
                }

                .rotateImgStart {
                    transform: translate(-300px, 100px);
                    transition: transform 0.8s;
                }

                .description {
                    position: absolute;
                    width: 100%;
                    text-align: center;
                    bottom: 20%;
                    font-size: 25px;
                    color: lightgray;
                }
            }
        `;

        const ListView = styled.div`
            width: 50%;
            height: 75%;
            /* background-color: rgba(255, 255, 255, 0.05); */
            border-radius: 15px;
            margin-right: 10px;
            padding: 10px;
            /* position: relative; */
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            .item {
                width: 100%;
                height: 50px;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;

                .text {
                    width: 50%;
                }

                .size {
                    width: 10%;
                    font-size: 12px;
                }
            }

            .itemSelect {
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }
        `;

        const scan = reactive({
            status: false,
            num: 0,
            size: "",
        });

        const stopScan: any = inject("stopScan");

        const executeAction = () => {
            if (!scan.status) {
                scan.status = true;
                setTimeout(() => {
                    scan.status = false;
                    scan.num++;
                    stopScan(false);
                    scan.size = "重复文件总计24个";
                }, 5000);
            }
            return scan.status;
        };

        expose({executeAction});

        const data = ref<string[]>([
            "Racing car sprays burning fuel into crowd.",
            "Japanese princess to wed commoner.",
            "Australian walks 100km after outback crash.",
            "Man charged over missing wedding girl.",
            "Los Angeles battles huge wildfires.",
        ]);

        return () => (
            <Container>
                <div class={"content"}>
                    <RotateImage
                        class={["rotateImg", scan.status ? "rotateImgStart" : ""]}
                        icon={duplicate3dIcon}
                        animation={true}
                        width={200}
                        auto={scan.status}
                    ></RotateImage>
                    <Transition name="slide-right" mode="out-in">
                        {!scan.status && (
                            <div key={"desc"} class={"description"}>
                                {scan.size === "" ? "欢迎使用重复文件清理功能" : scan.size}
                            </div>
                        )}
                        {scan.status && (
                            <ListView key={"data"} class={"listView"}>
                                {data.value.map((_, idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            class={[
                                                "item",
                                                idx === data.value.length - 1 ? "itemSelect" : "",
                                            ]}
                                        >
                                            <FolderOutlined/>
                                            <span class={"text"}>{"Google"}</span>
                                            <span class={"size"}>{"100MB"}</span>
                                            <Progress
                                                type="dashboard"
                                                size={20}
                                                strokeColor={"white"}
                                                trailColor={"white"}
                                            />
                                        </div>
                                    );
                                })}
                            </ListView>
                        )}
                    </Transition>
                </div>
            </Container>
        );
    },
});
