import { ScholarshipSearchResponse } from './Scholarship.types'

export const getTransformedDataFromScholarshipsResponse = (scholarShips: ScholarshipSearchResponse[]) => {
  const transformedData = []

  for (const platformData of scholarShips) {
    const {
      scholarshipProviderPlatform,
      context: { transactionId, bppId, bppUri },
      scholarshipProviders
    } = platformData

    for (const provider of scholarshipProviders) {
      const { id: providerId, name: providerName, scholarships } = provider

      for (const scholarship of scholarships) {
        const { amount, description, id, name, scholarshipDetails } = scholarship

        const transformedItem = {
          providerName,
          platformName: scholarshipProviderPlatform,
          bppId,
          bppUri,
          transactionId,
          description,
          amount,
          id,
          name,
          scholarshipDetails,
          providerId
        }

        transformedData.push(transformedItem)
      }
    }
  }

  return transformedData
}
