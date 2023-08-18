import { PageContextWithUser } from '@explorer/shared'
import React from 'react'

import { WarningIcon } from '../../assets/icons/WarningIcon'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { InlineEllipsis } from '../../components/InlineEllipsis'
import { Link } from '../../components/Link'
import { ContentWrapper } from '../../components/page/ContentWrapper'
import { Page } from '../../components/page/Page'
import { reactToHtml } from '../../reactToHtml'

export const RECOVER_STARK_KEY_BUTTON_ID = 'recover-stark-key-button'

interface UserRegisterPageProps {
  context: PageContextWithUser
}

function UserRecoverPage(props: UserRegisterPageProps) {
  return (
    <Page
      context={props.context}
      description="Recover your stark key from your ethereum address"
      path="/users/recover"
    >
      <ContentWrapper className="flex gap-12">
        <div className="flex-1">
          <div className="text-xxl font-semibold">Recover Stark key</div>
          <div className="mt-6 flex flex-col gap-6 text-md font-medium leading-5 text-zinc-500">
            <span>
              Our system doesn't recognize any Stark key associated with your
              Ethereum address.
            </span>
            <span>
              To obtain the key, we will ask you to sign a message with
              MetaMask. Upon signing, MetaMask may alert that this message
              should only be signed on a given domain. You can make an exception
              for this explorer but note that{' '}
              <strong>
                this operation can be dangerous if done on a malicious website,
                so make sure you trust this website
              </strong>
              (you can read the code{' '}
              <Link href="https://github.com/l2beat/starkex-explorer">
                here
              </Link>
              ).
            </span>
            <span>
              Alternatively, you can try to figure out your Stark key by
              yourself. However, you will be unable to submit forced
              transactions without registering.
            </span>
          </div>
        </div>
        <Card className="h-min max-w-lg flex-1">
          <p className="text-sm font-semibold text-zinc-500">Stark key</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center">
              <WarningIcon />
              <p className="ml-2 font-semibold text-amber-500">Unknown</p>
            </div>
            <Button
              id={RECOVER_STARK_KEY_BUTTON_ID}
              data-instance-name={props.context.instanceName}
              data-chain-id={props.context.chainId}
            >
              Recover
            </Button>
          </div>
          <p className="mt-6 text-sm font-semibold text-zinc-500">
            Ethereum address
          </p>
          <InlineEllipsis className="mt-1 w-full max-w-[99%] font-semibold text-white ">
            {props.context.user.address.toString()}
          </InlineEllipsis>
        </Card>
      </ContentWrapper>
    </Page>
  )
}

export function renderUserRecoverPage(props: UserRegisterPageProps) {
  return reactToHtml(<UserRecoverPage {...props} />)
}
