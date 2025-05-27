import {defineComponent} from 'vue';
import styled from "vue3-styled-components";
import {Image} from "ant-design-vue";
import appIcon from '@/assets/png/mac-app.png'

export default defineComponent({
    name: 'Home',
    setup() {
        const Container = styled.div`
            width: 100%;
            height: calc(100%- 10px);
            background-color: red;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 20px;
        `

        return () => (
            <Container>
                <Image src={appIcon} preview={false} width={350}></Image>
                <span>欢迎使用Mac Clean</span>
                <span></span>
            </Container>
        )
    }
})