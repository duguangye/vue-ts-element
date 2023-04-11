import { capitalize as toCapitalize} from '@vue/shared'
// 真的第一次export 还能from
export {
    camelize,
} from '@vue/shared'
export const capitalize = <T extends string>(str: T) => toCapitalize(str) as Capitalize<T>
