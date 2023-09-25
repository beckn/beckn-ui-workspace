import { JobResponse } from './JobsSearch.types'

export const getTransformedDataFromJobsResponse = (jobs: JobResponse[]) => {
  const transformedData = []

  for (const platformData of jobs) {
    const {
      jobProviderPlatform,
      context: { transactionId, bppId, bppUri },
      jobResults
    } = platformData

    for (const companyData of jobResults) {
      const { company, jobs } = companyData

      for (const job of jobs) {
        const { jobId, role: jobRole, description, locations } = job

        for (const location of locations) {
          const { id: locationId, city, state, country } = location

          const transformedItem = {
            jobRole,
            jobId,
            companyName: company.name,
            platformName: jobProviderPlatform,
            bppId,
            bppUri,
            transactionId,
            location: city,
            jobDescription: description
          }

          transformedData.push(transformedItem)
        }
      }
    }
  }

  return transformedData
}
