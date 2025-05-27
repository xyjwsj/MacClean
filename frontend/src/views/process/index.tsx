import appIcon from "@/assets/png/mac-app.png";
import RotateImage from "@/components/rotateImage";
import { defineComponent } from "vue";
import styled from "vue3-styled-components";

export default defineComponent({
  name: "Process",
  setup() {
    const Container = styled.div`
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 50px;
      .content {
        width: calc(100% - 100px);
        height: calc(100% - 50px);
        background: rgba(255, 255, 255, 0.2);
        border-radius: 30px;
        box-shadow: 0 0 10px 10px rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: center;
      }
    `;

    return () => (
      <Container>
        <div class={"content"}>
          <RotateImage icon={appIcon}></RotateImage>
        </div>
      </Container>
    );
  },
});
