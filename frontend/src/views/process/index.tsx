import process3DIcon from "@/assets/png/process-3d.png";
import RotateImage from "@/components/rotateImage";
import {FolderOutlined} from "@ant-design/icons-vue";
import {defineComponent, inject, reactive, Transition} from "vue";
import styled from "vue3-styled-components";
import {Scan} from "@/bindings/changeme/handler/scanhandler.ts";
import {Events} from "@wailsio/runtime";

export default defineComponent({
  name: "Cache",
  setup(_, { expose }) {
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
      overflow-y: auto;

      ::-webkit-scrollbar {
        display: none;
      }
      
      .item {
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        .text {
          height: 50px;
          width: 50%;
          line-height: 50px;
          white-space: nowrap;
          overflow-x: hidden;
        }
        .size {
          width: 10%;
          font-size: 12px;
        }
      }

      .itemSelect {
        border-radius: 10px;
        background-image: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 100%
        );
        background-size: 200% 100%;
        animation: marquee 3s linear infinite;
      }

      @keyframes marquee {
        0% {
          background-position: 100% 0;
        }
        100% {
          background-position: -100% 0;
        }
      }
    `;

    const scan = reactive({
      status: false,
      num: 0,
      size: "",
    });
    const start = async () => {
      console.log("==========", scan.status);
      const result = await Scan("process");
      Events.Off('scanEvent')
      scan.size = result
      scan.status = false
      finishScan()
    }

    const finishScan: any = inject("finishScan");

    const executeAction = () => {
      if (!scan.status) {
        scan.status = true;
        Events.On("scanEvent", (data: any) => {
          requestAnimationFrame(() => {

            const app = data.data[0].app;
            const size = data.data[0].size;

            dataInfo.unshift({
              app: app,
              size: size
            })
          })
        });
        start()
      }
      return scan.status;
    };

    expose({executeAction});

    const dataInfo = reactive([{
      app: '',
      size: ''
    }]);

    return () => (
      <Container>
        <div class={"content"}>
          <RotateImage
            class={["rotateImg", scan.status ? "rotateImgStart" : ""]}
            icon={process3DIcon}
            animation={true}
            width={200}
            auto={scan.status}
          ></RotateImage>
          <Transition name="slide-right" mode="out-in">
            {!scan.status && (
              <div key={"desc"} class={"description"}>
                {scan.size === "" ? "欢迎使用进程清理功能" : scan.size}
              </div>
            )}
            {scan.status && (
              <ListView key={"data"} class={"listView"}>
                {dataInfo.map((itm, idx) => {
                  return (
                    <div
                      key={idx}
                      class={[
                        "item",
                        idx === dataInfo.length - 1 ? "itemSelect" : "",
                      ]}
                    >
                      <FolderOutlined />
                      <span class={"text"}>{itm.app}</span>
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
