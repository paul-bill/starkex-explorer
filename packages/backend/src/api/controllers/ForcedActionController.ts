import {
  renderNewPerpetualForcedActionPage,
  renderNewSpotForcedWithdrawPage,
} from '@explorer/frontend'
import { UserDetails } from '@explorer/shared'
import { AssetHash, AssetId, EthereumAddress } from '@explorer/types'

import { PageContextService } from '../../core/PageContextService'
import { AssetRepository } from '../../peripherals/database/AssetRepository'
import { PreprocessedAssetHistoryRepository } from '../../peripherals/database/PreprocessedAssetHistoryRepository'
import { getAssetPriceUSDCents } from '../../utils/assets'
import { ControllerResult } from './ControllerResult'

export class ForcedActionController {
  constructor(
    private readonly pageContextService: PageContextService,
    private readonly preprocessedAssetHistoryRepository: PreprocessedAssetHistoryRepository,
    private readonly assetRepository: AssetRepository,
    private readonly starkExAddress: EthereumAddress
  ) {}

  async getSpotForcedWithdrawalPage(
    givenUser: Partial<UserDetails>,
    vaultId: bigint
  ): Promise<ControllerResult> {
    const context = await this.pageContextService.getPageContextWithUser(
      givenUser
    )

    if (!context) {
      return { type: 'not found', content: 'User not found' }
    }

    if (context.tradingMode !== 'spot') {
      return { type: 'not found', content: 'Page not found' }
    }

    const assets =
      await this.preprocessedAssetHistoryRepository.getCurrentByPositionOrVaultId(
        vaultId
      )

    const asset = assets[0]
    if (!asset) {
      return { type: 'not found', content: 'Vault is empty' }
    }

    if (asset.starkKey != context.user.starkKey) {
      return { type: 'not found', content: 'Vault does not belong to user' }
    }

    const assetDetails = await this.assetRepository.findDetailsByAssetHash(
      asset.assetHashOrId as AssetHash
    )

    const content = renderNewSpotForcedWithdrawPage({
      context,
      starkExAddress: this.starkExAddress,
      positionOrVaultId: vaultId,
      starkKey: asset.starkKey,
      asset: {
        hashOrId: asset.assetHashOrId,
        balance: asset.balance,
        details: assetDetails,
        priceUSDCents: 0n,
      },
    })

    return { type: 'success', content }
  }

  async getPerpetualForcedWithdrawalPage(
    givenUser: Partial<UserDetails>,
    positionId: bigint,
    assetId: AssetId
  ): Promise<ControllerResult> {
    const context = await this.pageContextService.getPageContextWithUser(
      givenUser
    )

    if (!context) {
      return { type: 'not found', content: 'User not found' }
    }

    if (context.tradingMode !== 'perpetual') {
      return { type: 'not found', content: 'Page not found' }
    }

    const assets =
      await this.preprocessedAssetHistoryRepository.getCurrentByPositionOrVaultId(
        positionId
      )

    const asset = assets.find((asset) => asset.assetHashOrId === assetId)
    if (!asset) {
      return {
        type: 'not found',
        content:
          'Position is empty or does not contain asset with given assetId',
      }
    }

    if (asset.starkKey != context.user.starkKey) {
      return { type: 'not found', content: 'Position does not belong to user' }
    }

    if (!asset.price) {
      return { type: 'not found', content: 'Asset price is not available' }
    }

    const content = renderNewPerpetualForcedActionPage({
      context,
      starkExAddress: this.starkExAddress,
      positionOrVaultId: positionId,
      starkKey: asset.starkKey,
      asset: {
        hashOrId: asset.assetHashOrId,
        balance: asset.balance,
        priceUSDCents: getAssetPriceUSDCents(
          asset.price,
          asset.assetHashOrId as AssetId
        ),
      },
    })

    return { type: 'success', content }
  }

  async getPerpetualForcedTradePage(
    givenUser: Partial<UserDetails>,
    positionId: bigint,
    assetId: AssetId
  ): Promise<ControllerResult> {
    const context = await this.pageContextService.getPageContextWithUser(
      givenUser
    )

    if (!context) {
      return { type: 'not found', content: 'User not found' }
    }

    if (context.tradingMode !== 'perpetual') {
      return { type: 'not found', content: 'Page not found' }
    }

    const assets =
      await this.preprocessedAssetHistoryRepository.getCurrentByPositionOrVaultId(
        positionId
      )

    const asset = assets.find((asset) => asset.assetHashOrId === assetId)
    if (!asset) {
      return { type: 'not found', content: 'Position is empty' }
    }

    if (asset.starkKey != context.user.starkKey) {
      return { type: 'not found', content: 'Position does not belong to user' }
    }

    if (!asset.price) {
      return { type: 'not found', content: 'Asset price is not available' }
    }

    const content = renderNewPerpetualForcedActionPage({
      context,
      starkExAddress: this.starkExAddress,
      positionOrVaultId: positionId,
      starkKey: asset.starkKey,
      asset: {
        hashOrId: asset.assetHashOrId,
        balance: asset.balance,
        priceUSDCents: getAssetPriceUSDCents(
          asset.price,
          asset.assetHashOrId as AssetId
        ),
      },
    })
    return { type: 'success', content }
  }
}