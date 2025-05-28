import appstore3dIcon from "@/assets/png/appstore-3d.png";
import bigfile3dIcon from "@/assets/png/bigfile-3d.png";
import cache3dIcon from "@/assets/png/cache-3d.png";
import duplicate3dIcon from "@/assets/png/duplicate-3d.png";
import process3dIcon from "@/assets/png/process-3d.png";
import RotateImage from "@/components/rotateImage.tsx";
import { defineComponent, reactive } from "vue";
import styled from "vue3-styled-components";

export default defineComponent({
  name: "Dashboard",
  setup(_, { expose }) {
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
        gap: 30px;

        .an-content {
          display: flex;
          position: relative;
          flex-grow: 1;
          transition: flex-grow 0.5s;
          gap: 30px;

          .an-item {
            height: 100%;
            padding: 20px;
            border-radius: 30px;
            /* 玻璃核心样式 */
            background: rgba(255, 255, 255, 0.1);
            flex-grow: 1;
            transition: flex-grow 0.5s;
            position: relative;
            overflow: hidden;

            .img {
              margin: 0 auto;
              z-index: -2;
              /* border-radius: 55px; */
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
              line-height: 40px;
              color: wheat;
              text-align: center;
              padding-top: 20px;
            }

            .body {
              color: white;
              font-size: 29px;
              width: 100%;
              font-weight: 700;
              height: 30%;
              line-height: 30%;
              /* background-color: red; */
              padding-left: 10px;
              padding-top: 20px;
            }
            .footer {
              width: 100%;
              height: 10%;
              color: white;
              padding-left: 10px;
              /* background-color: green; */
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

    const cardData = reactive([
      {
        key: "1",
        flexGrow: 1,
        data: [
          {
            key: "1-1",
            flexGrow: 1,
            title: "缓存",
            icon: cache3dIcon,
            finsish: false,
          },
          {
            key: "1-2",
            flexGrow: 1,
            title: "进程",
            icon: process3dIcon,
            finsish: false,
          },
          {
            key: "1-3",
            flexGrow: 1,
            title: "应用",
            icon: appstore3dIcon,
            finsish: false,
          },
        ],
      },
      {
        key: "2",
        flexGrow: 1,
        data: [
          {
            key: "2-1",
            flexGrow: 1,
            title: "大文件",
            icon: bigfile3dIcon,
            finsish: false,
          },
          {
            key: "2-2",
            flexGrow: 1,
            title: "重复文件",
            icon: duplicate3dIcon,
            finsish: false,
          },
        ],
      },
    ]);

    const executeAction = () => {
      let current = false;
      let change = false;
      cardData.forEach((item) => {
        item.data.forEach((itm, col) => {
          if (itm.flexGrow > 1) {
            itm.flexGrow = 1;
            itm.finsish = true;
            if (col === item.data.length - 1) {
              item.flexGrow = 1;
            }
            current = true;
            return;
          }
          if (current) {
            item.flexGrow = 4;
            itm.flexGrow = 4;
            change = true;
            current = false;
            scan.status = true;
          }
        });
      });
      if (!change && !current) {
        cardData[0].flexGrow = 4;
        cardData[0].data[0].flexGrow = 4;
        change = true;
        scan.status = true;
      }
      if (!change) {
        scan.status = false;
        scan.num++;
      }
      return change;
    };

    expose({ executeAction });

    const scan = reactive({
      status: false,
      num: 0,
    });

    return () => (
      <Container>
        <div class={"an-container"}>
          {cardData.map((row) => {
            return (
              <div class={"an-content"} style={{ flexGrow: row.flexGrow }}>
                {row.data.map((col) => {
                  return (
                    <div class="an-item" style={{ flexGrow: col.flexGrow }}>
                      <div class={"title"}>{col.title}</div>
                      <RotateImage
                        class={["img"]}
                        icon={col.icon}
                        animation={false}
                        auto={col.flexGrow > 1}
                        width={col.flexGrow > 1 ? 150 : 80}
                      ></RotateImage>
                      {col.flexGrow > 1 && <div class={"runTip"}>{"测试"}</div>}
                      {col.finsish && <div class={"body"}>{"无结果"}</div>}
                      {col.finsish && <div class={"footer"}>{"可清除"}</div>}
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
