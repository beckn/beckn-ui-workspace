interface TrackingLocationDescriptor {
  name: string
}

interface TrackingLocation {
  id: string
  descriptor: TrackingLocationDescriptor
}

interface TrackingMessage {
  tracking: {
    url: string
    status: 'active' | string // Allow for potential future status values
    id: string
    location: TrackingLocation
  }
}

interface Context {
  domain: string
  action: string // Can be "on_track" for this specific response
  version: string
  bpp_id: string
  bpp_uri: string
  country: string
  city: string
  location: Location // Reuse the Location interface from previous example
  bap_id: string
  bap_uri: string
  transaction_id: string
  message_id: string
  ttl: string
  timestamp: string
}

interface TrackingResponsePerBpp {
  context: Context
  message: TrackingMessage
}

export interface TrackingResponseModel {
  data: TrackingResponsePerBpp[]
}
