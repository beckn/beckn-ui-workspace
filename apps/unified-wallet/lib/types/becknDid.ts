export type PurposeType =
  | 'Authentication'
  | 'Assertion'
  | 'CapabilityDelegation'
  | 'KeyAgreement'
  | 'CapabilityInvocation'

export type HashingAlgorithmType = 'Blake512' | 'sha256' | 'sha512'
export type SignatureAlgorithmType = 'Ed25519' | 'X25519' | 'Phone' | 'Email' | 'Dns'

export interface VerificationResult {
  challenge?: string
  controller?: {
    did: string
  }
  did: string
  public_key?: string
  purpose?: string
  type?: string
  verified: 'Y' | 'N'
}

// Define Types
export interface VerificationMethod {
  public_key: string
  hashing_algorithm: HashingAlgorithmType
  purpose: PurposeType
  type: SignatureAlgorithmType
}

export interface RegisterSubject {
  did: string
  verification_methods: VerificationResult[]
}

export interface Subject {
  name: string
  verification_methods?: VerificationMethod[]
}

export interface VerifyResponse {
  challenge: string
  controller: { did: string; id: string }
  created_at: string
  did: string
  hashing_algorithm: 'Blake512'
  id: string
  lock_id: string
  name: string
  public_key: string
  purpose: 'Authentication'
  response: string
  type: 'Ed25519'
  updated_at: string
  verified: 'Y' | 'N'
}

export interface DocumentPayload {
  name: string
  stream: string
}
