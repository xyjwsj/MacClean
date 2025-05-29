import applicationImg from "@/assets/png/application.png";
import bigFileImg from "@/assets/png/bigFile.png";
import cacheImg from "@/assets/png/cache.png";
import dashboardImg from "@/assets/png/dashboard.png";
import duplicateImg from "@/assets/png/duplicate.png";
import processImg from "@/assets/png/process.png";
import router from "@/router";
import { TipWarning } from "@/util/messageUtil";
import { Button, Image } from "ant-design-vue";
import { defineComponent, KeepAlive, provide, ref, Transition } from "vue";
import { RouterView } from "vue-router";
import styled from "vue3-styled-components";

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
      height: 100%;
      box-shadow: 10px 10px 350px rgba(255, 255, 255, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 30px;
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
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      gap: 5px;

      ::-webkit-scrollbar {
        display: none;
      }

      .nav {
        height: 40px;
        color: #fafafa;
        width: 100%;
        text-align: center;
        line-height: 40px;
        transition: all 0.5s;
      }

      .body {
        height: calc(100% - 160px);
        width: 100%;
      }

      .start {
        margin-top: 20px;
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
          inset: 5px;
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
        router: "Dashboard",
      },
      {
        key: "cache",
        width: 35,
        img: cacheImg,
        description: "缓存",
        router: "Cache",
      },
      {
        key: "process",
        width: 30,
        img: processImg,
        description: "进程",
        router: "Process",
      },
      {
        key: "application",
        width: 45,
        img: applicationImg,
        description: "应用",
        router: "Application",
      },
      {
        key: "bigFile",
        width: 30,
        img: bigFileImg,
        description: "大文件",
        router: "BigFile",
      },
      {
        key: "duplicate",
        width: 30,
        img: duplicateImg,
        description: "重复文件",
        router: "Duplicate",
      },
    ];

    const menuSelect = ref("dashboard");
    const selectDesc = () => {
      const filter = menuItem.filter((item) => item.key === menuSelect.value);
      if (filter.length) {
        return filter[0].description;
      }
      return "";
    };

    const startAction = () => {
      if (currentCom.value) {
        (currentCom.value as any).executeAction();
        scan.value = true;
      }
    };

    const stopScan = (val: boolean) => {
      scan.value = val;
    };

    provide("stopScan", stopScan);

    const scan = ref(false);

    return () => (
      <Container>
        <MenuView>
          {menuItem.map((item) => {
            return (
              <Button
                size="large"
                class={[
                  "btn",
                  menuSelect.value === item.key ? "btnSelect" : "",
                ]}
                icon={
                  <Image src={item.img} preview={false} width={item.width} />
                }
                onClick={() => {
                  menuSelect.value = item.key;
                  if (item.router !== "") {
                    router.replace({ name: item.router });
                  }
                }}
              ></Button>
            );
          })}
        </MenuView>
        <RouterViewCon>
          <div class={"nav"}>{selectDesc()}</div>
          <div class={"body"}>
            <RouterView
              v-slots={{
                default: ({ Component, route }: any) => (
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
          <div
            class={["start", scan.value ? "startAnimation" : ""]}
            onClick={() => {
              if (scan.value) {
                TipWarning("正在扫描中，请稍后");
                return;
              }
              startAction();
            }}
          >
            {"扫描"}
          </div>
        </RouterViewCon>
      </Container>
    );
  },
});
