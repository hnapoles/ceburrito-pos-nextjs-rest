// heroicon-named.ts[x] - tsx is optional, since JSX syntax is not used
import { createElement } from 'react'
import * as solid from '@heroicons/react/24/solid'
import * as outline from '@heroicons/react/24/outline'

export function HeroIconNamed<T extends 'solid' | 'outline' = 'solid'>(props: {
  name: T extends 'solid' ? keyof typeof solid : keyof typeof outline
  type?: T
  className?: string
}) {
  const { name, type, className: overrides } = props
  // latest classes override the defaults
  const className = ['h-6', 'w-6', 'text-black']
    .concat(overrides?.split(' ') || []).join(' ')
  const icon = { solid, outline }[type ? type : 'solid'][name]
  // no need to use JSX syntax for "dynamically" acquired component
  return createElement(icon, { className })
}