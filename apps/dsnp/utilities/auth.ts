import jwt from 'jsonwebtoken'
import { IUser } from '../lib/types/user'
import { payloadHandle, signPayloadWithExtension, payloadAddProvider } from '../utilities/signTransaction'
import { payloadData } from './static'
import axios from 'axios'

function customToU8a(obj) {
  // This is a simplistic implementation and should be tailored to your specific needs.
  const keys = Object.keys(obj)
  const buffer = new ArrayBuffer(keys.length * 2) // Example: 2 bytes per value
  const view = new Uint8Array(buffer)

  let offset = 0
  keys.forEach(key => {
    const value = obj[key]

    // This example assumes each value is a number and fits in 2 bytes.
    // Adjust this logic based on how you need to serialize your data.
    view[offset] = value & 0xff
    view[offset + 1] = (value >> 8) & 0xff
    offset += 2
  })

  return view
}

export const signToken = (user: IUser) => {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: '30d'
  })
}

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
