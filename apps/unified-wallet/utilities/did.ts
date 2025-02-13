import { ParsedData } from '@lib/types/becknDid'

export const parseDIDData = (data: { did: string }[]): ParsedData => {
  const result: ParsedData = {
    identities: [],
    assets: {
      credentials: [],
      physical: []
    }
  }

  const fileRegex = /^[^\/]+\.[a-zA-Z0-9]+$/

  data.forEach(({ did }) => {
    // Remove the prefix before processing
    const normalizedDID = did.replace(/^\/subjects\/users\/phone\/\d+\/documents\//, '')
    const parts = normalizedDID.split('/')

    if (parts[0] === 'identities') {
      // Extract identity type and ID
      result.identities.push({
        type: formatType(parts[2]), // Convert to title case
        id: parts[4],
        did
      })
    } else if (parts[0] === 'assets') {
      const category = parts[1] // credentials | physical
      if (category === 'credentials') {
        const attachment = fileRegex.test(parts[6] || '') ? parts[6] : null
        result.assets.credentials.push({
          type: formatType(parts[3]),
          name: formatType(parts[5]),
          //   attachment,
          did
        })
      } else if (category === 'physical') {
        const attachment = fileRegex.test(parts[4] || '') ? parts[4] : null
        result.assets.physical.push({
          type: formatType(parts[3]),
          source: 'wallet',
          attachment,
          did
        })
      }
    }
  })
  console.log(result)
  return result
}

// Helper function to format type names (e.g., "aadhar_card" -> "Aadhar Card")
const formatType = (str: string): string => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
