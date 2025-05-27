import {defineComponent} from 'vue';
import styled from "vue3-styled-components";

export default defineComponent({
    name: 'Cache',
    setup() {
        const Container = styled.div`
            width: 100%;
            height: 100%;
            padding-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 50px;
        `

        return () => (
            <Container>fadsfa</Container>
        )
    }
})