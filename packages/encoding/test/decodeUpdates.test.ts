import { expect } from 'earljs'

import { MIN_INT } from '../src/constants'
import { decodeUpdates } from '../src/decodeUpdates'
import { DecodingError } from '../src/DecodingError'
import { encodeAssetId } from '../src/encodeAssetId'
import { ByteWriter } from './ByteWriter'

describe('decodeUpdates', () => {
  it('fails for empty data', () => {
    expect(() => decodeUpdates('')).toThrow(DecodingError, 'Went out of bounds')
  })

  it('decodes multiple entries and positions', () => {
    const writer = new ByteWriter()
      .writeNumber(2, 32) // 2 entries
      .writeNumber(3, 32) // 3 indices
      .writePadding(17)
      .write(encodeAssetId('ETH-9'))
      .writeNumber(100n - MIN_INT, 32) // funding index = 100
      .writePadding(17)
      .write(encodeAssetId('BTC-10'))
      .writeNumber(-200n - MIN_INT, 32) // funding index = -200
      .writePadding(17)
      .write(encodeAssetId('ABC-1'))
      .writeNumber(0n - MIN_INT, 32) // funding index = 0
      .writeNumber(456, 32) // timestamp
      .writeNumber(2, 32) // 2 indices
      .writePadding(17)
      .write(encodeAssetId('ETH-9'))
      .writeNumber(1n - MIN_INT, 32) // funding index = 1
      .writePadding(17)
      .write(encodeAssetId('BTC-10'))
      .writeNumber(2n - MIN_INT, 32) // funding index = 2
      .writeNumber(789, 32) // timestamp
      .writeNumber(4 + 2, 32) // 2 values
      .writeNumber(123, 32) // positionId
      .write('1234abcd'.repeat(8)) // publicKey
      .writeNumber(10n - MIN_INT, 32) // collateralBalance
      .writeNumber(456, 32) // fundingTimestamp
      .writePadding(9)
      .write(encodeAssetId('ETH-9'))
      .writeNumber(50n - MIN_INT, 8)
      .writePadding(9)
      .write(encodeAssetId('BTC-10'))
      .writeNumber(20n - MIN_INT, 8)
      .writeNumber(4 + 1, 32) // 1 value
      .writeNumber(124, 32) // positionId
      .write('deadbeef'.repeat(8)) // publicKey
      .writeNumber(33n - MIN_INT, 32) // collateralBalance
      .writeNumber(457, 32) // fundingTimestamp
      .writePadding(9)
      .write(encodeAssetId('ETH-9'))
      .writeNumber(66n - MIN_INT, 8)
    expect(decodeUpdates(writer.getBytes())).toEqual({
      funding: [
        {
          indices: [
            { assetId: 'ETH-9', value: 100n },
            { assetId: 'BTC-10', value: -200n },
            { assetId: 'ABC-1', value: 0n },
          ],
          timestamp: 456n,
        },
        {
          indices: [
            { assetId: 'ETH-9', value: 1n },
            { assetId: 'BTC-10', value: 2n },
          ],
          timestamp: 789n,
        },
      ],
      positions: [
        {
          positionId: 123n,
          publicKey: '0x' + '1234abcd'.repeat(8),
          collateralBalance: 10n,
          fundingTimestamp: 456n,
          balances: [
            { assetId: 'ETH-9', balance: 50n },
            { assetId: 'BTC-10', balance: 20n },
          ],
        },
        {
          positionId: 124n,
          publicKey: '0x' + 'deadbeef'.repeat(8),
          collateralBalance: 33n,
          fundingTimestamp: 457n,
          balances: [{ assetId: 'ETH-9', balance: 66n }],
        },
      ],
    })
  })
})