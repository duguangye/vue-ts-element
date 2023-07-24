import type {MaybeRef} from '@vueuse/core'
// loading 组件需要用到的值
export type LoadingOptionsResolved = {
    parent: LoadingParentElement,
    background: MaybeRef<string>,
    svg: MaybeRef<string>,
    svgViewBox: MaybeRef<string>,
    spinner: MaybeRef<string>,
    fullscreen:boolean
}

//
export type LoadingOptions = Partial<Omit<LoadingOptionsResolved, 'parent' | 'target'> & { target: HTMLElement | string, body: boolean }>

export interface LoadingParentElement extends HTMLElement {
    vLoadingAddClassList?: () => void
}
