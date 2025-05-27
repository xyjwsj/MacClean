import bkImage from "@/assets/png/background.png";
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import styled from "vue3-styled-components";

export default defineComponent({
  setup() {
    const RootView = styled.div`
      width: 100vw;
      height: 100vh;
      position: relative; /* 设置相对定位，以便伪元素可以相对于此元素定位 */

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url(${() => bkImage}) no-repeat center / cover; /* 设置背景图片 */
        z-index: 1; /* 确保伪元素在其他内容之下 */
      }

      > * {
        position: relative;
        z-index: 2; /* 确保子元素在伪元素之上 */
      }
    `;

    return () => (
      <RootView>
        <RouterView />
      </RootView>
    );
  },
});
