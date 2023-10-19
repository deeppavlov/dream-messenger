/// <reference types="vite/client" />

declare module '*.module.scss' {
  interface IClassNames {
    [className: string]: string
  }
  export const classNames: IClassNames
}

declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}
