/** 自动补全的类型声明 */
export interface Completer {
  getCompletions: (
    _editor: unknown,
    _session: unknown,
    _pos: unknown,
    prefix: string,
    callback: (
      arg0: null,
      arg1: { caption: string; meta: string; value: string; score: number }[]
    ) => unknown
  ) => unknown;
}