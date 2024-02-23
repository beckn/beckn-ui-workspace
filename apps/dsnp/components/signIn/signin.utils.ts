import axios from 'axios'

export const fetchHandles = async (address: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DSNP_GATEWAY_URL}/v1/auth/handles`,
      [address] // This is the data-raw part
    )

    return response.data
  } catch (err) {
    console.log('Error while fetching handles', err)
  }
}

export const fetchChallenge = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_DSNP_GATEWAY_URL}/v1/auth/challenge`)
    return response.data
  } catch (err) {
    console.log('')
  }
}

export const dsnpLogin = async (signedChallenge: string, selectedAccount: string, challenge: string) => {
  const data = {
    algo: 'SR25519',
    encoding: 'hex',
    encodedValue: signedChallenge,
    publicKey: selectedAccount,
    challenge
  }
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_DSNP_GATEWAY_URL}/v1/auth/login`, data)
    return response.data
  } catch (err) {
    console.log(err)
  }
}
