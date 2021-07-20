/*
 * @Author: yanghuayun
 * @Date: 2021-07-19 00:47:27
 * @LastEditors: yanghuayun
 * @LastEditTime: 2021-07-20 23:14:10
 * @Description: file content
 */
import invariant from 'tiny-invariant'
import { Currency, NativeCurrency, Token } from '@uniswap/sdk-core'

export const WFTM = new Token(250, '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', 18, 'WFTM', 'Wrapped FTM')

/**
 * Fantom is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */
export class Fantom extends NativeCurrency {
  protected constructor(chainId: number) {
    super(chainId, 18, 'FTM', 'Fantom')
  }

  public get wrapped(): Token {
    const wftm = WFTM
    invariant(!!wftm, 'WRAPPED')
    return wftm
  }

  private static _etherCache: { [chainId: number]: Fantom } = {}

  public static onChain(chainId: number): Fantom {
    return this._etherCache[chainId] ?? (this._etherCache[chainId] = new Fantom(chainId))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}
