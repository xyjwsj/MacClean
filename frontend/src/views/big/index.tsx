import big3dIcon from "@/assets/png/bigfile-3d.png";
import RotateImage from "@/components/rotateImage";
import { defineComponent, inject, reactive } from "vue";
import styled from "vue3-styled-components";

export default defineComponent({
  name: "BigFile",
  setup(_, { expose }) {
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
        background: rgba(255, 255, 255, 0.1);
        border-radius: 30px;
        box-shadow: 0 0 3px 3px rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
      }
    `;

    const scan = reactive({
      status: false,
      num: 0,
    });

    const stopScan: any = inject("stopScan");

    const executeAction = () => {
      if (!scan.status) {
        scan.status = true;
        setTimeout(() => {
          scan.status = false;
          scan.num++;
          stopScan(false);
        }, 5000);
      }
      return scan.status;
    };

    expose({ executeAction });

    return () => (
      <Container>
        <div class={"content"}>
          <RotateImage
            icon={big3dIcon}
            width={200}
            auto={scan.status}
          ></RotateImage>
        </div>
      </Container>
    );
  },
});
