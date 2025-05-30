import { Image } from "ant-design-vue";
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import styled from "vue3-styled-components";

export default defineComponent({
  name: "RotateImage",
  props: {
    icon: {
      type: String,
      required: true,
    },
    animation: {
      type: Boolean,
      required: false,
      default: true,
    },
    auto: {
      type: Boolean,
      required: false,
      default: false,
    },
    width: {
      type: Number,
      required: false,
      default: 350,
    },
  },
  setup(props) {
    const Container = styled.div`
      height: ${() => `${props.width}px`};
      width: ${() => `${props.width}px`};
      .imageCard {
        border-radius: ${() => props.width > 150 ? `55px` : '20px'};
        height: ${() => `${props.width}px`};
        /* display: flex;
        align-items: center;
        justify-content: center; */
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background: transparent !important;
        padding: 0;
        //box-shadow: rgba(rgb(0, 0, 0), 0.6) 0 30px 60px 0, inset #333 0 0 0 5px,
        //  inset rgba(rgb(255, 255, 255), 0.5) 0 0 0 6px;
        box-shadow: 0 0 50px 60px rgba(255, 255, 255, 0.1);
        .ant-image {
          position: static;
        }
        //transition-duration: 80ms;
        .img {
          box-shadow: 0 0 10px 10px rgba(255, 255, 255, 0.1);
          border-radius: ${() => props.width > 150 ? `55px` : '20px'};
          opacity: 0.8;
          background-size: cover;
        }
      }
    `;

    const cardRef = ref();
    const position = reactive({ x: 0, y: 0 });
    let animationFrameId: any = null;

    const autoRotate = () => {
      if (!props.auto || !cardRef.value) return;

      // 模拟一个动态的旋转角度（类似鼠标移动）
      const time = Date.now() * 0.002; // 控制速度
      const roX = Math.sin(time) * 10; // 左右晃动幅度
      const roY = Math.cos(time) * 10; // 上下晃动幅度

      cardRef.value.style.transform = `perspective(300px) rotateY(${roY}deg) rotateX(${roX}deg)`;

      animationFrameId = requestAnimationFrame(autoRotate);
    };

    const handleMouseMove = (e: any) => {
      if (!props.animation) {
        return false;
      }
      position.x = e.offsetX;
      position.y = e.offsetY;

      let roX = position.x / 9 - 15;
      let roY = -((position.y / 300) * 14 - 7);
      cardRef.value.style.transform = `perspective(300px) rotateY(${roX}deg) rotateX(${roY}deg)`;
    };

    const handleMouseLeave = (_: any) => {
      if (!props.animation) {
        return false;
      }
    };

    watch(
      () => props.auto,
      (newVal, oldVal) => {
        console.log("监听基本类型数据testStr");
        console.log("new", newVal);
        console.log("old", oldVal);
        if (newVal) {
          autoRotate();
        }
      }
    );

    onMounted(() => {
      if (props.auto) {
        autoRotate();
      }
    });

    onBeforeUnmount(() => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });

    return () => (
      <Container>
        <div
          class={"imageCard"}
          onMouseleave={handleMouseLeave}
          onMousemove={handleMouseMove}
          ref={cardRef}
        >
          <Image
            class={"img"}
            src={props.icon}
            preview={false}
            width={props.width}
          ></Image>
        </div>
      </Container>
    );
  },
});
