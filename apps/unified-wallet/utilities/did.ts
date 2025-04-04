import { AttestationData, ParsedData } from '@lib/types/becknDid'

export const parseDIDData = (data: { did: string; attestations?: AttestationData[] }[]): ParsedData => {
  const result: ParsedData = {
    identities: [],
    assets: {
      credentials: [],
      physical: []
    },
    transactions: []
  }

  const fileRegex = /^[^\/]+\.[a-zA-Z0-9]+$/

  data.forEach(({ did, attestations }) => {
    // Remove the prefix before processing
    const normalizedDID = did.replace(/^\/subjects\/users\/phone\/\d+\/documents\//, '')
    const parts = normalizedDID.split('/')

    if (parts[0] === 'identities') {
      // Extract identity type and ID
      result.identities.push({
        type: formatType(parts[2]), // Convert to title case
        id: parts[4],
        did,
        attestations: attestations!,
        createdAt: parts[5]
      })
    } else if (parts[0] === 'assets') {
      const category = parts[1] // credentials | physical
      if (category === 'credentials') {
        const attachment = fileRegex.test(parts[6] || '') ? parts[6] : null
        result.assets.credentials.push({
          type: formatType(parts[3]),
          name: formatType(parts[5]),
          //   attachment,
          did,
          attestations: attestations!,
          createdAt: parts[7]
        })
      } else if (category === 'physical') {
        const attachment = fileRegex.test(parts[6] || '') ? parts[6] : null
        result.assets.physical.push({
          type: formatType(parts[3]),
          source: parts[5],
          attachment,
          did,
          attestations: attestations!,
          createdAt: parts[6]
        })
      }
    } else if (parts[0] === 'transactions') {
      console.log(parts)
      result.transactions.push({
        type: formatType(parts[2]),
        category: formatType(parts[3]),
        id: parts[5],
        amount: parts[7],
        name: parts[9],
        did,
        attestations: attestations!,
        placedAt: parts[10]
      })
    }
  })
  console.log(result)
  return result
}

// Helper function to format type names (e.g., "aadhar_card" -> "Aadhar Card")
const formatType = (str: string): string => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
