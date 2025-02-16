import {
  VerifyResponse,
  Subject,
  VerificationMethod,
  VerificationResult,
  RegisterSubject,
  AttestationData
} from '@lib/types/becknDid'
import Api from './didApi'

const extendedWalletApi = Api.injectEndpoints({
  endpoints: build => ({
    registerLoginUser: build.mutation<RegisterSubject[], { subject: Subject; publicKey: string }>({
      query: ({ subject: { name }, publicKey }) => ({
        url: '/subjects',
        method: 'POST',
        body: {
          name,
          verification_methods: [
            {
              public_key: publicKey,
              hashing_algorithm: 'Blake512',
              purpose: 'Authentication',
              type: 'Ed25519'
            } as VerificationMethod
          ]
        }
      })
    }),
    getUser: build.mutation<RegisterSubject[], string>({
      query: subjectId => `/subjects/${subjectId}`
    }),
    getVerificationMethods: build.mutation<VerificationResult[], string>({
      query: subjectId => `${subjectId}/verification_methods`
    }),
    addDocument: build.mutation<
      { user: RegisterSubject[] },
      { subjectId: string; payload: { name: string; stream: string }; authorization: string }
    >({
      query: ({ subjectId, payload, authorization }) => ({
        url: `${subjectId}/documents`,
        headers: { Authorization: authorization },
        method: 'POST',
        body: payload
      })
    }),
    getDocuments: build.mutation<{ did: string; attestations?: AttestationData[] }[], string>({
      query: subjectId => `${subjectId}/documents`
    }),
    verify: build.mutation<VerifyResponse, { subjectId: string; verificationId: string; signedDetails: string }>({
      query: ({ subjectId, verificationId, signedDetails }) => {
        return {
          url: `${subjectId}/verification_methods/verify/${verificationId}`,
          method: 'POST',
          body: signedDetails
        }
      }
    }),
    decodeStream: build.mutation<VerifyResponse, { subjectId: string }>({
      query: ({ subjectId }) => {
        return {
          url: `${subjectId}/stream`,
          method: 'GET'
        }
      }
    }),
    deleteDocument: build.mutation<
      VerifyResponse,
      { subjectId: string; payload: { name: string; stream: string }; authorization: string }
    >({
      query: ({ subjectId, payload, authorization }) => ({
        url: `${subjectId}`,
        headers: { Authorization: authorization },
        method: 'DELETE',
        body: payload
      })
    })
  })
})

export const {
  useRegisterLoginUserMutation,
  useGetUserMutation,
  useVerifyMutation,
  useGetVerificationMethodsMutation,
  useAddDocumentMutation,
  useGetDocumentsMutation,
  useDecodeStreamMutation,
  useDeleteDocumentMutation
} = extendedWalletApi

export const {
  endpoints: {
    getUser,
    getVerificationMethods,
    verify,
    registerLoginUser,
    addDocument,
    getDocuments,
    decodeStream,
    deleteDocument
  }
} = extendedWalletApi

export default extendedWalletApi
