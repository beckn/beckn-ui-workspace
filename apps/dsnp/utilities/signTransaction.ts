// import { web3FromAddress } from "@polkadot/extension-dapp";
// import { U8aLike } from "@polkadot/util/types";

// const createRegistry = async ()=>{
//   const {TypeRegistry} = await import("@polkadot/types");
// return Registry = new TypeRegistry();
// }

// let Registry = createRegistry();
// Registry.register({
//   AddProvider: {
//     authorizedMsaId: "u64",
//     schemaIds: "Vec<u16>",
//     expiration: "u32",
//   },
// });

// const Registry = new TypeRegistry();
// Registry.register({
//   AddProvider: {
//     authorizedMsaId: "u64",
//     schemaIds: "Vec<u16>",
//     expiration: "u32",
//   },
// });

export async function signPayloadWithExtension(address: string, payload: any) {
  const { web3FromAddress } = await import('@polkadot/extension-dapp')
  const { isFunction, u8aWrapBytes, u8aToHex } = await import('@polkadot/util')
  const walletAccount = await web3FromAddress(address)
  const signRaw = walletAccount.signer?.signRaw
  let signed
  if (signRaw && isFunction(signRaw)) {
    const payloadWrappedToU8a = u8aWrapBytes(payload)
    try {
      signed = await signRaw({
        address,
        data: u8aToHex(payloadWrappedToU8a),
        type: 'bytes'
      } as any)

      return signed?.signature
    } catch (e) {
      console.log(e)
      return 'ERROR!'
    }
  }
  return 'Unknown error'
}

export const payloadHandle = async (expiration: number, handle: string) => {
  const { TypeRegistry, Bytes } = await import('@polkadot/types')
  // const {Bytes}  = await  import('@polkadot/types');

  const Registry = new TypeRegistry()
  Registry.register({
    AddProvider: {
      authorizedMsaId: 'u64',
      schemaIds: 'Vec<u16>',
      expiration: 'u32'
    },
    ClaimHandle: {
      baseHandle: 'Bytes',
      expiration: 'u32'
    }
  })
  const handleBytes = new Bytes(Registry, handle)
  const claimHandlePayload = Registry.createType('ClaimHandle', {
    baseHandle: handleBytes,
    expiration
  })

  return claimHandlePayload
}

export const payloadAddProvider = async (expiration: number, providerId: string, schemaIds: number[]) => {
  const { TypeRegistry } = await import('@polkadot/types')

  const Registry = new TypeRegistry()
  Registry.register({
    AddProvider: {
      authorizedMsaId: 'u64',
      schemaIds: 'Vec<u16>',
      expiration: 'u32'
    }
  })
  schemaIds.sort()
  const claimHandlePayload = Registry.createType('AddProvider', {
    authorizedMsaId: providerId,
    expiration,
    schemaIds
  })

  return claimHandlePayload
}
