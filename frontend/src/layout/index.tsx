import {defineComponent, KeepAlive, ref, Transition} from 'vue';
import styled from "vue3-styled-components";
import {RouterView} from "vue-router";

export default defineComponent({
    name: 'Layout',
    setup() {

        const Container = styled.div`
            margin: 0 auto;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            position: relative;
        `

        const MenuView = styled.div`
            padding: 35px 0;
            width: 80px;
            //background-color: lightgray;
            box-shadow: 10px 10px 350px rgba(255, 255, 255, 0.3);
            &::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(to left, rgba(0, 0, 0, 0.1) 0%, transparent 50%, rgba(0, 0, 0, 0.1) 100%);
                pointer-events: none;
            }
        `

        const RouterViewCon = styled.div`
            height: 100%;
            overflow-y: auto;
            width: calc(100% - 80px);

            ::-webkit-scrollbar {
                display: none;
            }

            .nav {
                height: 40px;
                color: white;
                line-height: 40px;
                padding-left: 20px;
            }
            
            .body {
                height: calc(100% - 40px);
            }
            
            /* 路由切换动画 */
            .fade-enter-active,
            .fade-leave-active {
                transition: all 0.5s ease-in-out;
                transform: translate3d(0, 0, 0); /* 启用GPU加速 */
                backface-visibility: hidden; /* 防止闪烁 */
                perspective: 1000px;
            }

            .fade-enter-from {
                opacity: 0;
                transform: translateY(-30px);
            }

            .fade-enter-to {
                opacity: 1;
                transform: translateY(0);
            }

            .fade-leave-to {
                opacity: 0;
                transform: translateY(30px);
            }
        `

        const currentCom = ref(null)


        return () => (
            <Container>
                <MenuView></MenuView>
                <RouterViewCon>
                    <div class={'nav'}>fadsaff</div>
                    <div class={'body'}>
                        <RouterView
                            v-slots={{
                                default: ({Component, route}: any) => (
                                    <Transition name={route.meta.transition || 'fade'} mode='out-in'>
                                        <KeepAlive>
                                            <Component is={Component} key={route.path} ref={currentCom}></Component>
                                        </KeepAlive>
                                    </Transition>
                                )
                            }}
                        />
                    </div>
                </RouterViewCon>
            </Container>
        )
    }
})