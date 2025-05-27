import dashboardImg from "@/assets/png/dashboard.png";
import duplicateImg from "@/assets/png/duplicate.png";
import bigFileImg from "@/assets/png/bigFile.png";
import cacheImg from "@/assets/png/cache.png";
import processImg from "@/assets/png/process.png";
import applicationImg from "@/assets/png/application.png";
import {Button, Image} from "ant-design-vue";
import {defineComponent, KeepAlive, ref, Transition} from "vue";
import {RouterView} from "vue-router";
import styled from "vue3-styled-components";
import router from "@/router";

export default defineComponent({
    name: "Layout",
    setup() {
        const Container = styled.div`
            margin: 0 auto;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            position: relative;
        `;

        const MenuView = styled.div`
            width: 80px;
            height: calc(100% - 170px); //???
            box-shadow: 10px 10px 350px rgba(255, 255, 255, 0.3);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 40px;
            overflow: auto;
            
            .btn {
                border: none;
                background: transparent;
                filter: grayscale(1) brightness(0.8);
                opacity: 0.5;
                display: flex;
                align-items: center;
                justify-content: center;
                
                &:hover {
                    transform: scale(1.2);
                    filter: none;
                    opacity: 0.7;
                }
                .btnImg {
                    //background-color: white;
                }
            }
            
            .btnSelect {
                filter: none;
                opacity: 0.9;
            }
        `;

        const RouterViewCon = styled.div`
            height: 100%;
            overflow-y: auto;
            width: calc(100% - 80px);

            ::-webkit-scrollbar {
                display: none;
            }

            .nav {
                height: 40px;
                color: #FAFAFA;
                width: 100%;
                text-align: center;
                line-height: 40px;
                padding-left: 20px;
                transition: all 0.5s;
            }

            .body {
                height: calc(100% - 40px);
            }

            /* 路由切换动画 */

            .fade-enter-active,
            .fade-leave-active {
                transition: all 0.5s ease-in-out;
                transform: translate3d(0, 0, 0); /* 启用GPU加速 */
                backface-visibility: hidden; /* 防止闪烁 */
                perspective: 1000px;
            }

            .fade-enter-from {
                opacity: 0;
                transform: translateY(-30px);
            }

            .fade-enter-to {
                opacity: 1;
                transform: translateY(0);
            }

            .fade-leave-to {
                opacity: 0;
                transform: translateY(30px);
            }
        `;

        const currentCom = ref(null);

        const menuItem = [
            {
                key: "dashboard",
                width: 30,
                img: dashboardImg,
                description: "自动清理",
                router: "Dashboard"
            },
            {
                key: "cache",
                width: 35,
                img: cacheImg,
                description: "缓存",
                router: "Cache"
            },
            {
                key: "application",
                width: 45,
                img: applicationImg,
                description: "应用",
                router: "Application"
            },
            {
                key: "process",
                width: 30,
                img: processImg,
                description: "进程",
                router: "Process"
            },
            {
                key: "bigFile",
                width: 30,
                img: bigFileImg,
                description: "大文件",
                router: "BigFile"
            },
            {
                key: "duplicate",
                width: 30,
                img: duplicateImg,
                description: "重复文件",
                router: "Duplicate"
            }
        ]
        
        const menuSelect = ref("dashboard")
        const selectDesc = () => {
            const filter = menuItem.filter(item => item.key===menuSelect.value);
            if (filter.length) {
                return filter[0].description
            }
            return ""
        }

        return () => (
            <Container>
                <MenuView>
                    {menuItem.map(item => {
                        return <Button
                            size="large"
                            class={['btn', menuSelect.value === item.key ? "btnSelect" : ""]}
                            icon={<Image src={item.img} preview={false} width={item.width}/>}
                            onClick={() => {
                                menuSelect.value = item.key
                                if (item.router !== "") {
                                    router.replace({name: item.router})
                                }
                            }}
                        ></Button>
                    })}
                </MenuView>
                <RouterViewCon>
                    <div class={"nav"}>{selectDesc()}</div>
                    <div class={"body"}>
                        <RouterView
                            v-slots={{
                                default: ({Component, route}: any) => (
                                    <Transition
                                        name={route.meta.transition || "fade"}
                                        mode="out-in"
                                    >
                                        <KeepAlive>
                                            <Component
                                                is={Component}
                                                key={route.path}
                                                ref={currentCom}
                                            ></Component>
                                        </KeepAlive>
                                    </Transition>
                                ),
                            }}
                        />
                    </div>
                </RouterViewCon>
            </Container>
        );
    },
});
