import type {LoadingOptions, LoadingOptionsResolved} from "@/views/loading/src/types";
import {
  createApp,
  createVNode,
  defineComponent,
  h,
  reactive,
  ref,
  Transition,
  vShow,
  withCtx,
  withDirectives
} from "vue";

export type LoadingInstance = ReturnType<typeof createLoadingComponent>


// 创建loading组件
export function createLoadingComponent(options: LoadingOptionsResolved) {
  const data = reactive({
    ...options,
    originalPosition: '',
    originalOverflow: '',
    visible: false,
  })
  const afterLeaveFlag = ref(false)
  function handleAfterLeave() {
    if (!afterLeaveFlag.value) return
    const target = data.parent
    afterLeaveFlag.value = false
    target.vLoadingAddClassList = undefined
    destroySelf()
  }


  const elLoadingComponent = defineComponent({
    name: 'ElLoading',
    setup(_, {expose}) {
      return () => {
        const svg = data.spinner || data.svg
        const spinner = h(
          'svg',
          {
            class: 'circular',
            viewBox: data.svgViewBox ? data.svgViewBox : '0 0 50 50',
            ...(svg ? {innerHTML: svg} : {}),
          },
          [
            h('circle', {
              class: 'path',
              cx: '25',
              cy: '25',
              r: '20',
              fill: 'none',
            }),
          ]
        )
        const spinnerText = data.text ? h('p', {class: 'ns.b()'}, [data.text]) : undefined
        return h(
          Transition,
          {
            name: 'fade',
            onAfterLeave: handleAfterLeave,
          },
          {
            default: withCtx(() => [
              withDirectives(
                createVNode(
                  'div',
                  {
                    style: {
                      backgroundColor: data.background || '',
                    },
                    class: [
                      'el-loading-mask',
                      data.customClass,
                      data.fullscreen ? 'is-fullscreen' : '',
                    ],
                  },
                  [
                    h(
                      'div',
                      {
                        class:'el-loading-spinner',
                      },
                      [spinner, spinnerText]
                    ),
                  ]
                ),
                [[vShow, data.visible]]
              ),
            ]),
          }
        )
      }
    },
  })

  const loadingInstance = createApp(elLoadingComponent)
  const vm = loadingInstance.mount(document.createElement('div'))

  return {
    vm,
    get $el(): HTMLElement {
      return vm.$el
    }
  }
}