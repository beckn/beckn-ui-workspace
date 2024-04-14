import { base58btc } from 'multiformats/bases/base58'
import { blake2AsU8a, randomAsU8a } from '@polkadot/util-crypto'

export const makeInteractionIdAndNonce = async (dsnpId: string, nonceBytes?: Uint8Array) => {
  // FIXME make this a bitwise uint64 encoding rather than a text encoding
  // const { blake2AsU8a,randomAsU8a } = await import('@polkadot/utils-crypto')
  if (!nonceBytes) nonceBytes = randomAsU8a(24)
  const dsnpIdBytes = new TextEncoder().encode(dsnpId)

  const interactionHash = blake2AsU8a(new Uint8Array([...dsnpIdBytes, ...nonceBytes]))

  // [160,228,2] = blake2-256 multicodec value
  return {
    interactionId: base58btc.encode(new Uint8Array([160, 228, 2, ...interactionHash])),
    nonce: base58btc.encode(nonceBytes)
  }
}
