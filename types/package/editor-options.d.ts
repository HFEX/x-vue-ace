declare const editorOptions: string[];
declare const editorEvents: string[];
/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
declare function debounce(func: Function, wait?: number, immediate?: boolean): (this: any, ...params: any[]) => void;
export { editorOptions, editorEvents, debounce, };
