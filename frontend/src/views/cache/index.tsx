import cache3dIcon from "@/assets/png/cache-3d.png";
import RotateImage from "@/components/rotateImage";
import {defineComponent, reactive, ref, Transition} from "vue";
import styled from "vue3-styled-components";

export default defineComponent({
    name: "Cache",
    setup(_, {expose}) {
        const Container = styled.div`
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 50px;

            /* 右进右出动画样式 */
            .slide-right-enter-active,
            .slide-right-leave-active {
                transition: all 0.5s ease;
            }

            .slide-right-enter-from {
                transform: translateX(30%);
                opacity: 0;
            }

            .slide-right-enter-to {
                transform: translateX(0);
                opacity: 1;
            }

            .slide-right-leave-from {
                transform: translateX(0);
                opacity: 1;
            }

            .slide-right-leave-to {
                transform: translateX(30%);
                opacity: 0;
            }

            .content {
                width: calc(100% - 100px);
                height: calc(100% - 50px);
                background: rgba(255, 255, 255, 0.1);
                border-radius: 30px;
                box-shadow: 0 0 3px 3px rgba(255, 255, 255, 0.1);
                display: flex;
                justify-content: flex-end;
                align-items: center;
                position: relative;

                .rotateImg {
                    left: 50%;
                    top: 30px;
                    transform: translate(-50%);
                    transition: transform 0.8s;
                    position: absolute;
                }

                .rotateImgStart {
                    transform: translate(-320px, 100px);
                    transition: transform 0.8s;
                }

                .description {
                    width: 100%;
                    text-align: center;
                }

                
            }
        `;

        const ListView = styled.div`
            width: 60%;
            height: 75%;
            color: white;
            margin-right: 10px;
            position: relative;

            .item {
                line-height: 40px;
                color: white;
                width: 100%;
            }
        `

        const scan = reactive({
            status: false,
            num: 0
        })

        const executeAction = () => {
            if (!scan.status && scan.num == 0) {
                scan.status = true
                setTimeout(() => {
                    scan.status = false
                    scan.num++
                }, 5000)
            }
            return scan.status
        }

        expose({executeAction})

        const data = ref<string[]>([
            'Racing car sprays burning fuel into crowd.',
            'Japanese princess to wed commoner.',
            'Australian walks 100km after outback crash.',
            'Man charged over missing wedding girl.',
            'Los Angeles battles huge wildfires.',
        ]);

        return () => (
            <Container>
                <div class={"content"}>

                    <RotateImage
                        class={['rotateImg', scan.status ? 'rotateImgStart' : '']}
                        icon={cache3dIcon}
                        animation={true}
                        width={200}
                        auto={scan.status}></RotateImage>
                    <Transition name="slide-right" mode="out-in">
                        {!scan.status && <div key={'desc'} class={"description"}>{'欢迎使用缓存清理功能'}</div>}
                        {scan.status && <ListView  key={'data'} class={'listView'}>
                            {data.value.map((item, idx) => {
                                return <span key={idx} class={'item'}>{item}</span>
                            })}
                        </ListView>}
                    </Transition>
                </div>
            </Container>
        );
    },
});
