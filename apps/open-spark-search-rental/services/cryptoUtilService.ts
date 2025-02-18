import { DocumentPayload } from '@lib/types/becknDid'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_CRYPTO_UTILS_BASE_URL

export const generateKeyPairFromString = async (
  inputString: string
): Promise<{ privateKey: string; publicKey: string }> => {
  try {
    const response = await axios.get(`${BASE_URL}/crypto_keys/generatepublicprivatebymessage`, {
      params: {
        input: 'Ed25519:256',
        message: inputString
      }
    })

    console.log('Response:', response.data)
    return {
      privateKey: response.data.PRIVATE_KEY,
      publicKey: response.data.PUBLIC_KEY
    }
  } catch (error) {
    console.error('Error generating keys:', error)
    throw error
  }
}

export const generateSignature = async (challenge: string, privateKey: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/signature/generateSignature`,
      {
        hashAlgo: 'BLAKE2B-512',
        payload: Number(challenge),
        signatureAlgo: 'Ed25519',
        privateKey
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('Signature Response:', response.data)
    return response.data?.SIGNATURE_KEY || ''
  } catch (error) {
    console.error('Error generating signature:', error)
    throw error
  }
}

export const generateAuthHeader = async (data: {
  subjectId: string
  verification_did: string
  privateKey: string
  publicKey: string
  payload: DocumentPayload
}) => {
  const { subjectId, verification_did, privateKey, publicKey, payload } = data
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/sign`,
      {
        endpoint: `${subjectId}/documents`,
        method: 'post',
        keyId: verification_did,
        privateKey,
        publicKey,
        payload
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('Response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
