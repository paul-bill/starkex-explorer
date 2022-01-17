export type {
  Block,
  Filter,
  FilterByBlockHash,
  Log,
} from '@ethersproject/abstract-provider'
export { BigNumber } from 'ethers'

export type BlockNumber = number
export type BlockTag = BlockNumber | 'earliest' | 'latest' | 'pending'

/**
 * inclusive on both sides
 */
export type BlockRange = {
  readonly from: BlockNumber
  readonly to: BlockNumber
}