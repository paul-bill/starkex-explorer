import { pedersen, PedersenHash } from '@explorer/crypto'
import { AssetId, encodeAssetId } from '@explorer/encoding'

import { MerkleValue } from './MerkleValue'

const MIN_INT_64 = -(2n ** 63n)

export interface PositionAsset {
  readonly assetId: AssetId
  readonly balance: bigint
  readonly fundingIndex: bigint
}

export class Position extends MerkleValue {
  static EMPTY = new Position('0x' + '0'.repeat(64), 0n, [])

  constructor(
    public readonly publicKey: string,
    public readonly collateralBalance: bigint,
    public readonly assets: readonly PositionAsset[],
    protected knownHash?: PedersenHash
  ) {
    super()
  }

  async calculateHash() {
    const packedPosition = packBytes([
      { bytes: 8, value: this.collateralBalance - MIN_INT_64 },
      { bytes: 2, value: this.assets.length },
    ])
    const items = [
      ...this.assets.map(packAsset).sort(),
      this.publicKey.substring(2),
      packedPosition,
    ]
    let hash = PedersenHash.ZERO
    for (const item of items) {
      hash = await pedersen(hash, PedersenHash(item))
    }
    return hash
  }

  getData() {
    return {
      publicKey: this.publicKey,
      collateralBalance: this.collateralBalance,
      assets: this.assets,
    }
  }
}

function packAsset(asset: PositionAsset) {
  return packBytes([
    { bytes: 16, value: encodeAssetId(asset.assetId) },
    { bytes: 8, value: asset.fundingIndex - MIN_INT_64 },
    { bytes: 8, value: asset.balance - MIN_INT_64 },
  ])
}

function packBytes(
  values: { bytes: number; value: string | bigint | number }[]
) {
  return values
    .map(({ bytes, value }) => {
      const string = typeof value === 'string' ? value : value.toString(16)
      return string.padStart(bytes * 2, '0')
    })
    .join('')
}