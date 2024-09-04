export const countries = [
  { value: 'india', name: 'India' },
  { value: 'usa', name: 'USA' },
  { value: 'egypt', name: 'Egypt' }
]
export const cities = [
  { value: 'bangalore', name: 'Bangalore' },
  { value: 'delhi', name: 'Delhi' },
  { value: 'mumbai', name: 'Mumbai' },
  { value: 'chennai', name: 'Chennai' },
  { value: 'hyderabad', name: 'Hyderabad' },
  { value: 'pune', name: 'Pune' },
  { value: 'ahmedabad', name: 'Ahmedabad' },
  { value: 'vishakhapatnam', name: 'Vishakhapatnam' },
  { value: 'jaipur', name: 'Jaipur' },
  { value: 'noida', name: 'Noida' }
]

export const infoCategories = [
  { value: 'geofence', name: 'Geofence' },
  { value: 'privacy', name: 'Privacy' },
  { value: 'alcohol', name: 'Alcohol' }
]

// remove once dynamically json generation is done
export const mockedRulesData = {
  // Your JSON data here
  content: {
    context: { action: 'policy', domain: 'mobility', location: { country: 'IND', city: '080' }, version: '1.0.0' },
    message: {
      policy: {
        id: '1',
        owner: { descriptor: { name: 'covid', contact: { email: 'support@moh.gov.in' } } },
        descriptor: {
          name: 'testing policy',
          short_desc: 'lorem epsum',
          '\tmedia': [{ mimetype: 'application/pdf', url: '' }]
        },
        type: 'Geofence',
        coverage: [
          {
            spatial: [{ country: 'IND', city: 'std:080' }],
            temporal: [{ range: { start: '2024-08-01', end: '2024-08-23' } }],
            subscribers: [{ type: 'bap' }, { type: 'bpp' }]
          }
        ],
        geofences: [{ polygon: [] }]
      }
    }
  }
}
