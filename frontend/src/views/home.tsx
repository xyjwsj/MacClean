import appIcon from "@/assets/png/mac-app.png";
import { Image } from "ant-design-vue";
import { defineComponent } from "vue";
import styled from "vue3-styled-components";

export default defineComponent({
  name: "Home",
  setup() {
    const Container = styled.div`
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
    `;

    return () => (
      <Container>
        <Image src={appIcon} preview={false} width={350}></Image>
        <span>欢迎使用Mac Clean</span>
        <span></span>
      </Container>
    );
  },
});
