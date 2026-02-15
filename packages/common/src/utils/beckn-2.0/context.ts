import type { BecknContext } from '../../lib/types/beckn-2.0/context.types'
import type { BuildContextOptions } from './types'

const defaultLocation = {
  id: 'default',
  gps: '',
  country: { name: 'India', code: 'IN' }
}

/**
 * Build Beckn 2.0 context for any action (select, init, confirm, etc.).
 * Generic: any app can use with domain, bpp_id, bpp_uri, transaction_id.
 */
export function buildContext(opts: BuildContextOptions): BecknContext {
  const now = new Date().toISOString()
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const envBapId = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_BAP_ID : undefined
  const envBapUri = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_BAP_URI : undefined
  const bapId = opts.bapId ?? envBapId ?? 'bap.sandbox.example.com'
  const bapUri = opts.bapUri ?? envBapUri ?? 'https://bap.example.com'

  return {
    domain: opts.domain ?? 'nic2004:52110',
    location: (opts.location as BecknContext['location']) ?? defaultLocation,
    version: opts.version ?? '2.0.0',
    bap_id: bapId,
    bap_uri: bapUri,
    bpp_id: opts.bppId,
    bpp_uri: opts.bppUri,
    transaction_id: opts.transactionId,
    message_id: messageId,
    timestamp: now,
    action: opts.action,
    ttl: opts.ttl ?? 'PT30S',
    schema_context: opts.schemaContext
  }
}
