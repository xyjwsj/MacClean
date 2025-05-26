import {defineComponent} from 'vue';
import styled from "vue3-styled-components";

export default defineComponent({
    name: 'Home',
    setup() {
        const Container = styled.div`
            width: 100%;
            height: 100%;
            //background-color: lightgray;
        `
        return () => (
            <Container>fadsfa</Container>
        )
    }
})