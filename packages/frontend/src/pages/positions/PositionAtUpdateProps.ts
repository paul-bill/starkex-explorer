import { AssetId, EthereumAddress, StarkKey, Timestamp } from '@explorer/types'

import { ForcedTransactionEntry } from '../forced-transactions/ForcedTransactionsIndexProps'

export interface PositionAtUpdateProps {
  readonly account: EthereumAddress | undefined
  readonly stateUpdateId: number
  readonly positionId: bigint
  readonly lastUpdateTimestamp: Timestamp
  readonly previousPublicKey?: StarkKey
  readonly publicKey: StarkKey
  readonly assetChanges: readonly AssetChangeEntry[]
  readonly transactions: readonly ForcedTransactionEntry[]
}

export interface AssetChangeEntry {
  readonly assetId: AssetId
  readonly previousBalance: bigint
  readonly currentBalance: bigint
  readonly balanceDiff: bigint
}