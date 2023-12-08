declare module 'webfontloader' {
  export function load(config: any): void
}

declare module 'vant/es/action-sheet/style/index.mjs' {
  const ActionSheet: any
  export default ActionSheet
}

declare module '*.csv' {
  const content: {
    month: string
    p3: number
    p10: number
    p25: number
    p50: number
    p75: number
    p90: number
    p97: number
  }[]
  export default content
}
