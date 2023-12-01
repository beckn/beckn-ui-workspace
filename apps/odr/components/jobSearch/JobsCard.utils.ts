import { JobResponse } from './JobsSearch.types'

export const getTransformedDataFromJobsResponse = (jobs: JobResponse[]) => {
  const transformedData = []
  try {
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

          const transformedItem = {
            jobRole,
            jobId,
            companyName: company.name,
            companyId: company.id,
            platformName: jobProviderPlatform,
            bppId,
            bppUri,
            transactionId,
            location: 'Bengaluru',
            jobDescription: description
          }

          transformedData.push(transformedItem)
        }
      }
    }
  } catch (error) {
    console.error(error)
  }

  return transformedData
}
