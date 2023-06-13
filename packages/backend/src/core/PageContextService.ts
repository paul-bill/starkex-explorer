import {
  CollateralAsset,
  PageContext,
  PageContextWithUser,
  PageContextWithUserAndStarkKey,
  UserDetails,
} from '@explorer/shared'

import { Config } from '../config'
import { UserService } from './UserService'

export class PageContextService {
  constructor(
    private readonly config: Config,
    private readonly userService: UserService
  ) {}

  async getPageContext(givenUser: Partial<UserDetails>): Promise<PageContext> {
    const user = await this.userService.getUserDetails(givenUser)

    if (this.config.starkex.tradingMode === 'perpetual') {
      return {
        user,
        tradingMode: this.config.starkex.tradingMode,
        instanceName: this.config.starkex.instanceName,
        collateralAsset: this.config.starkex.collateralAsset,
      }
    }

    return {
      user,
      tradingMode: this.config.starkex.tradingMode,
      instanceName: this.config.starkex.instanceName,
    }
  }

  async getPageContextWithUser(
    givenUser: Partial<UserDetails>
  ): Promise<PageContextWithUser | undefined> {
    const context = await this.getPageContext(givenUser)

    if (context.user === undefined) {
      return undefined
    }

    return context as PageContextWithUser
  }

  async getPageContextWithUserAndStarkKey(
    givenUser: Partial<UserDetails>
  ): Promise<PageContextWithUserAndStarkKey | undefined> {
    const context = await this.getPageContextWithUser(givenUser)

    if (!context || !context.user.starkKey) {
      return undefined
    }

    return context as PageContextWithUserAndStarkKey
  }

  getCollateralAsset(context: PageContext): CollateralAsset | undefined {
    if (context.tradingMode === 'perpetual') {
      return context.collateralAsset
    }

    return undefined
  }
}