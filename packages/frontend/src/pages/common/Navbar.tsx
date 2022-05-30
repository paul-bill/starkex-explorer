import { EthereumAddress } from '@explorer/types'
import React from 'react'

import { JazzIcon } from './jazzicon/JazzIcon'
import { DydxLogo } from './logos/DydxLogo'
import { L2beatExplorerLogo } from './logos/L2beatExplorerLogo'
import { SearchBar } from './SearchBar'

export interface NavbarProps {
  readonly account: EthereumAddress | undefined
  readonly searchBar: boolean
}

export function Navbar({ account, searchBar = true }: NavbarProps) {
  return (
    <div className="flex justify-between items-center px-4 py-2.5 border-b-[1px] border-grey-300 flex-wrap gap-y-2">
      <a className="flex" href="/">
        <span className="pr-4">
          <L2beatExplorerLogo height={36} />
        </span>
        <DydxLogo height={32} />
      </a>
      <div className="flex flex-wrap gap-y-2 gap-x-4 w-full lg:w-auto">
        {searchBar && <SearchBar className="lg:w-auto lg:min-w-[600px]" />}
        {!account && (
          <button
            id="connect-with-metamask"
            className="bg-grey-300 px-4 rounded-md h-[44px] w-full lg:w-auto"
          >
            Connect
          </button>
        )}
        {account && (
          <div className="bg-grey-300 px-4 rounded-md h-[44px] w-full lg:w-auto align-middle flex items-center justify-center space-x-2">
            <JazzIcon address={account} size={25} />
            <span className="font-mono">
              {account.slice(0, 6)}&hellip;{account.slice(-4)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}