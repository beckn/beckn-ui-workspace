export interface BecknLocation {
  id: string
  descriptor?: {
    name?: string
    code?: string
    short_desc?: string
    long_desc?: string
    additional_desc?: {
      url?: string
      content_type?: string
    }
    media?: Array<{
      mimetype?: string
      url?: string
      signature?: string
      dsa?: string
    }>
    images?: Array<{
      url: string
      size_type?: string
      width?: string
      height?: string
    }>
  }
  map_url?: string
  gps: string
  address?: string
  city?: {
    name?: string
    code?: string
  }
  district?: string
  state?: {
    name?: string
    code?: string
  }
  country?: {
    name?: string
    code?: string
  }
  area_code?: string
  circle?: {
    gps: string
    radius?: {
      type?: string
      unit?: string
      value?: number
    }
  }
  polygon?: string
  rating?: string
}

export interface BecknContext {
  domain: string
  location: BecknLocation
  version: string
  bap_id: string
  bap_uri: string
  bpp_id: string
  bpp_uri: string
  transaction_id: string
  message_id: string
  timestamp: string
  key?: string
  ttl?: string
  schema_context?: string[]
  action: string
}

export interface BecknRequest<TMessage = unknown> {
  context: BecknContext
  message: TMessage
}
