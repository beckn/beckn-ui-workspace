export enum PolicyType {
  GEOFENCE = 'geofence',
  PRIVACY = 'privacy',
  ALCOHOL = 'alcohol'
}

export enum ApplicableToType {
  BAP = 'BAP',
  BPP = 'BPP'
}

export enum PolicyStatusType {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PUBLISH = 'PUBLISH'
}

export interface RulesTemplate {
  context: {
    action: string
    domain: string
    location: {
      country: string
      city: string
    }
    version: string
  }
  message: {
    policy: {
      id: string
      status: string
      domain: string
      owner: {
        descriptor: {
          name: string
          contact: {
            email: string
          }
        }
      }
      descriptor: {
        name: string
        short_desc: string
        media: {
          mimetype: string
          url: string
        }[]
      }
      type: string
      coverage: {
        spatial: {
          country: string
          city: string
        }[]
        temporal: {
          range: {
            start: string
            end: string
          }
        }[]
        subscribers: {
          type: string
        }[]
      }[]
      geofences: {
        polygon: string[]
      }[]
    }
  }
}
