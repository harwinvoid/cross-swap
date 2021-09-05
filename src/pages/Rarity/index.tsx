/*
 * @Author: yanghuayun
 * @Date: 2021-09-05 21:46:23
 * @LastEditors: yanghuayun
 * @LastEditTime: 2021-09-06 00:21:32
 * @Description: file content
 */

import { ButtonLight, ButtonPrimary } from 'components/Button'
import { useNFTContrct } from 'hooks/useContract'
import { useActiveWeb3React } from 'hooks/web3'
import React, { useContext, useEffect, useState } from 'react'
import { useWalletModalToggle } from 'state/application/hooks'
import styled, { ThemeContext } from 'styled-components/macro'

const Input = styled.input<{ error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error ? theme.red1 : theme.text1)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 500px;
  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  padding: 16px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`

const Rarity = () => {
  const { account } = useActiveWeb3React()
  const [tokenId, setTokenId] = useState('')
  const [tokenUri, setTokenUri] = useState(null)
  const toggleWalletModal = useWalletModalToggle()
  const rarityContract = useNFTContrct('0xce761d788df608bd21bdd59d6f4b54b2e27f25bb')

  const tokenBalance = async () => {
    if (!account) return
    const data = await rarityContract?.balanceOf(account)
    console.log(1, data?.toString())
  }

  const getRoleInfo = async () => {
    if (!tokenId) {
      toggleWalletModal()
      return
    }
    const data = await rarityContract?.tokenURI(tokenId)
    //@ts-ignore
    const decodedRequestBodyString = Buffer.from(data?.split(',')[1], 'base64')
    //@ts-ignore
    const requestBodyObject = JSON.parse(decodedRequestBodyString)
    setTokenUri(requestBodyObject)
  }

  const getLevel = async () => {
    try {
      if (!tokenId) {
        throw new Error('tokenId 呢')
      }
      await rarityContract?.adventure(tokenId)
      await getRoleInfo()
    } catch (error) {
      alert(error.message)
    }
  }

  const levelUp = async () => {
    try {
      if (!tokenId) {
        throw new Error('tokenId 呢')
      }
      await rarityContract?.level_up(tokenId)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleInput = (e: any) => {
    setTokenId(e.target.value)
  }

  useEffect(() => {
    tokenBalance()
  }, [account])

  //   console.log(123, rarityContract?.tokenByIndex(0))
  //   console.log(rarityContract?.balanceOf('0x14fd7D24eBF81196dfd6d3AF740D5024071859f8'))
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
        <Input
          style={{ marginBottom: 16 }}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder={'请输入tokenId'}
          error={false}
          pattern="^(0x[a-fA-F0-9]{40})$"
          onChange={handleInput}
          value={tokenId}
        />
        <ButtonPrimary onClick={getRoleInfo}>{!account ? '链接钱包' : '查找角色'}</ButtonPrimary>
      </div>

      {tokenUri ? (
        <div style={{ display: 'flex', marginTop: 32, flexDirection: 'column' }}>
          {/* @ts-ignore */}
          <img style={{ width: 400, marginRight: 16 }} src={tokenUri?.image} alt="" />
          <div style={{ display: 'flex', marginTop: 16 }}>
            <ButtonPrimary style={{ marginRight: 16 }} onClick={getLevel}>
              刷经验
            </ButtonPrimary>
            <ButtonLight onClick={levelUp}>升级</ButtonLight>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Rarity
