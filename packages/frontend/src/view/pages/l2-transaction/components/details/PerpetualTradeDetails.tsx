import { getCollateralAssetIdFromHash } from '@explorer/shared'
import React from 'react'

import { Card } from '../../../../components/Card'
import { InlineEllipsis } from '../../../../components/InlineEllipsis'
import { Link } from '../../../../components/Link'
import { TransactionField } from '../../../transaction/components/TransactionField'
import { PerpetualTransactionDetailsProps } from '../../common'
import { AssetTradeCard } from '../AssetTradeCard'
import { CurrentStatusField } from '../CurrentStatusField'

export function PerpetualTradeDetails(
  props: PerpetualTransactionDetailsProps<'Trade'>
) {
  const syntheticBuyer = props.data.partyAOrder.isBuyingSynthetic
    ? props.data.partyAOrder
    : props.data.partyBOrder
  const syntheticSeller = props.data.partyAOrder.isBuyingSynthetic
    ? props.data.partyBOrder
    : props.data.partyAOrder
  const collateralAssetId = getCollateralAssetIdFromHash(
    props.data.partyAOrder.collateralAssetId,
    props.collateralAsset
  )
  return (
    <Card className="flex flex-col gap-6">
      <TransactionField label="Current status">
        <CurrentStatusField stateUpdateId={props.stateUpdateId} />
      </TransactionField>
      <div className="grid grid-cols-3 gap-x-2">
        <TransactionField label="Synthetic buyer position">
          #{syntheticBuyer.positionId.toString()}
        </TransactionField>
        <TransactionField
          label="Synthetic seller position"
          className="col-start-3"
        >
          #{syntheticSeller.positionId.toString()}
        </TransactionField>
      </div>
      <div className="grid grid-cols-3 gap-x-2">
        <TransactionField label="Synthetic buyer stark key">
          <Link href={`/users/${syntheticBuyer.starkKey.toString()}`}>
            <InlineEllipsis className="max-w-[250px]">
              {syntheticBuyer.starkKey.toString()}
            </InlineEllipsis>
          </Link>
        </TransactionField>
        <TransactionField
          label="Synthetic seller stark key"
          className="col-start-3"
        >
          <Link href={`/users/${syntheticSeller.starkKey.toString()}`}>
            <InlineEllipsis className="max-w-[250px]">
              {syntheticSeller.starkKey.toString()}
            </InlineEllipsis>
          </Link>
        </TransactionField>
      </div>
      <AssetTradeCard
        synthetic={{
          asset: { hashOrId: syntheticBuyer.syntheticAssetId },
          amount: props.data.actualSynthetic,
        }}
        collateral={{
          asset: { hashOrId: collateralAssetId },
          amount: props.data.actualCollateral,
        }}
      />
    </Card>
  )
}