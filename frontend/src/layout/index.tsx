import {defineComponent, h, KeepAlive, reactive, ref, Transition, type VueElement} from 'vue';
import styled from "vue3-styled-components";
import {RouterView} from "vue-router";
import {type ItemType, Menu} from "ant-design-vue";
import {AppstoreOutlined, MailOutlined, SettingOutlined} from "@ant-design/icons-vue";

export default defineComponent({
    name: 'Layout',
    setup() {

        const Container = styled.div`
            margin: 0 auto;
            width: 100%;
            height: 100%;
            display: flex;

        `

        const RouterViewCon = styled.div`
            min-height: 500px; /* 固定最小高度，防抖动 */
            overflow-y: auto;
            width: calc(100% - 50px);

            ::-webkit-scrollbar {
                display: none;
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
        const getItem = (
            label: VueElement | string,
            key: string,
            icon?: any,
            children?: ItemType[],
            type?: 'group',
        ): ItemType  => {
            return {
                key,
                icon,
                children,
                label,
                type,
            } as ItemType;
        }

        const items: ItemType[] = reactive([
            getItem('Navigation One', 'sub1', () => h(MailOutlined), [
                getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
                getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
            ]),

            getItem('Navigation Two', 'sub2', () => h(AppstoreOutlined), [
                getItem('Option 5', '5'),
                getItem('Option 6', '6'),
                getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
            ]),

            { type: 'divider' },

            getItem('Navigation Three', 'sub4', () => h(SettingOutlined), [
                getItem('Option 9', '9'),
                getItem('Option 10', '10'),
                getItem('Option 11', '11'),
                getItem('Option 12', '12'),
            ]),

            getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
        ]);


        const currentCom = ref(null)

        const openKeys = ref<string[]>(['sub1']);
        const selectedKeys = ref<string[]>(['1']);

        return () => (
            <Container>
                <Menu
                    openKeys={openKeys.value}
                    selectedKeys={selectedKeys.value}
                    style="width: 256px"
                    mode="inline"
                    items={items}
                 ></Menu>
                <RouterViewCon>
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
                </RouterViewCon>
            </Container>
        )
    }
})