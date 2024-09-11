import axios from '@services/axios'
import jwt from 'jsonwebtoken'
import { payloadHandle, signPayloadWithExtension, payloadAddProvider } from './signTransaction'

export const getBlockNumber = async (url: string): Promise<number> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'chain_getHeader',
        params: []
      })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch block number')
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message)
    }

    if (data.result) {
      return Number(data.result.number)
    }

    throw new Error('Invalid response format')
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const dsnpCreate = async (handle: string, providerInfo: any, address: string) => {
  const blockNumber = await getBlockNumber(providerInfo.nodeUrl)
  const expiration = blockNumber + 50

  const handlePayload = await payloadHandle(expiration, handle)
  // const handlePayload = payloadData;
  const handleSignature = await signPayloadWithExtension(address, handlePayload.toU8a())

  if (!handleSignature.startsWith('0x')) throw Error('Unable to sign: ' + handleSignature)

  const addProviderPayload = await payloadAddProvider(expiration, providerInfo.providerId, providerInfo.schemas)

  const addProviderSignature = await signPayloadWithExtension(address, addProviderPayload.toU8a())

  if (!addProviderSignature.startsWith('0x')) throw Error('Unable to sign: ' + handleSignature)

  return dsnpRegister(expiration, handle, address, addProviderSignature, handleSignature)
}

export const dsnpRegister = async (
  expiration: number,
  handle: string,
  address: string,
  addProviderSignature: any,
  handleSignature: any
) => {
  const data = {
    algo: 'SR25519',
    encoding: 'hex',
    expiration,
    baseHandle: handle,
    publicKey: address,
    addProviderSignature,
    handleSignature
  }
  try {
    const response = await axios.post('https://api.dsnp-social-web.becknprotocol.io/v1/auth/create', data)
    return response.data
  } catch (err) {
    console.log(err)
  }
}
