import { AssetId, EthereumAddress } from '@explorer/types'
import React from 'react'

import { Page } from '../common'
import { EtherscanLink } from '../common/EtherscanLink'
import { ForcedHistory } from '../common/ForcedHistory'
import { ForcedPageHeader } from '../common/ForcedPageHeader'
import { PageHeaderStats } from '../common/PageHeaderStats'
import { SimpleLink } from '../common/SimpleLink'
import { formatCurrency } from '../formatting'
import { AcceptOfferForm } from './accept-form/AcceptOfferForm'
import { CancelOfferForm } from './cancel-form'
import { FinalizeOfferForm } from './finalize-form'
import { ForcedTradeOfferDetailsProps } from './ForcedTradeOfferDetailsProps'

export function toStatsRows(
  offer: Omit<ForcedTradeOfferDetailsProps['offer'], 'id' | 'addressA'> & {
    addressA?: EthereumAddress
  }
) {
  const partyA = offer.type === 'buy' ? 'Buyer' : 'Seller'
  const partyB = offer.type === 'buy' ? 'Seller' : 'Buyer'

  const rows = [
    {
      title: `${partyA} position id`,
      content: (
        <SimpleLink href={`/positions/${offer.positionIdA}`}>
          #{offer.positionIdA.toString()}
        </SimpleLink>
      ),
    },
    {
      title: `${partyA} ethereum address`,
      content: offer.addressA ? (
        <EtherscanLink address={offer.addressA}>{offer.addressA}</EtherscanLink>
      ) : (
        '-'
      ),
    },
    {
      title: 'Tokens sold',
      content: formatCurrency(offer.amountSynthetic, offer.syntheticAssetId),
    },
    {
      title: 'Value received',
      content: formatCurrency(offer.amountCollateral, AssetId.USDC),
    },
  ]

  if (offer.positionIdB) {
    rows.push({
      title: `${partyB} position id`,
      content: (
        <SimpleLink href={`/positions/${offer.positionIdB}`}>
          #{offer.positionIdB.toString()}
        </SimpleLink>
      ),
    })
  }

  if (offer.addressB) {
    rows.push({
      title: `${partyB} ethereum address`,
      content: offer.addressB ? (
        <EtherscanLink address={offer.addressB}>{offer.addressB}</EtherscanLink>
      ) : (
        '-'
      ),
    })
  }

  return rows
}

export function ForcedTradeOfferDetails({
  account,
  offer,
  history,
  acceptForm,
  cancelForm,
  finalizeForm,
}: ForcedTradeOfferDetailsProps) {
  return (
    <Page
      title="L2BEAT dYdX Explorer"
      description="Site under construction"
      url="https://dydx.l2beat.com"
      image="/images/under-construction.png"
      stylesheets={['/styles/main.css']}
      scripts={['/scripts/main.js']}
      account={account}
    >
      <ForcedPageHeader displayId={offer.id} type={offer.type}>
        <div className="flex gap-x-2">
          {acceptForm && (
            <AcceptOfferForm {...acceptForm}>
              <button className="bg-blue-100 text-white px-4 py-2 text-base rounded-md">
                Accept {`& ${offer.type ? 'sell' : 'buy'}`}
              </button>
            </AcceptOfferForm>
          )}
          {cancelForm && (
            <CancelOfferForm {...cancelForm}>
              <button className="bg-blue-100 text-white px-4 py-2 text-base rounded-md">
                Cancel
              </button>
            </CancelOfferForm>
          )}
          {finalizeForm && (
            <FinalizeOfferForm {...finalizeForm}>
              <button className="bg-blue-100 text-white px-4 py-2 text-base rounded-md">
                Finalize
              </button>
            </FinalizeOfferForm>
          )}
        </div>
      </ForcedPageHeader>
      <div className="mb-1.5 font-medium text-lg text-left">Stats</div>
      <PageHeaderStats rows={toStatsRows(offer)} />
      <ForcedHistory events={history} />
    </Page>
  )
}