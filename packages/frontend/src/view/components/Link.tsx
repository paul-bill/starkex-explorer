import cx from 'classnames'
import React from 'react'

import { OutLinkIcon } from '../assets/icons/OutLinkIcon'

type LinkProps = React.HTMLProps<HTMLAnchorElement>

export function Link({ className, href, children, ...rest }: LinkProps) {
  const isOutLink = /^https?:\/\//.test(href ?? '')
  const target = isOutLink ? '_blank' : undefined
  const rel = isOutLink ? 'noreferrer noopener' : undefined
  const hasHref = href != null
  const classNames = cx(
    'group inline-flex gap-2 text-blue-500 hover:text-blue-600 underline underline-offset-[3.5px]',
    className
  )
  return hasHref ? (
    <a href={href} className={classNames} target={target} rel={rel} {...rest}>
      {children}
      {isOutLink && <OutLinkIcon className="group-hover:stroke-blue-600" />}
    </a>
  ) : (
    <span className={classNames} {...rest}>
      {children}
    </span>
  )
}