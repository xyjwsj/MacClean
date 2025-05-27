import { Image } from "ant-design-vue";
import { defineComponent, reactive, ref } from "vue";
import styled from "vue3-styled-components";

export default defineComponent({
  name: "RotateImage",
  props: {
    icon: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const Contianer = styled.div`
      .imageCard {
        border-radius: 15px;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        box-shadow: rgba(rgb(0, 0, 0), 0.66) 0 30px 60px 0, inset #333 0 0 0 5px,
          inset rgba(rgb(255, 255, 255), 0.5) 0 0 0 6px;
        /* transition: all 0.5s; */
      }
    `;

    const cardRef = ref();
    const position = reactive({ x: 0, y: 0 });
    const handleMouseMove = (e: any) => {
      position.x = e.offsetX;
      position.y = e.offsetY;

      let roX = position.x / 9 - 15;
      let roY = -((position.y / 300) * 14 - 7);
      cardRef.value.style.transform = `perspective(300px) rotateY(${roX}deg) rotateX(${roY}deg)`;
    };

    const handleMouseLeave = (_: any) => {
      //   cardRef.value.style.transition = "all 0.5s";
      //   setTimeout(() => {
      //     cardRef.value.style.transition = "none";
      //     cardRef.value.style.transform =
      //       "perspective(300px) rotateY(0deg) rotateX(0deg)";
      //   }, 100);
    };

    return () => (
      <Contianer>
        <div
          class={"imageCard"}
          onMouseleave={handleMouseLeave}
          onMousemove={handleMouseMove}
          ref={cardRef}
        >
          <Image src={props.icon} preview={false} width={350}></Image>
        </div>
      </Contianer>
    );
  },
});
