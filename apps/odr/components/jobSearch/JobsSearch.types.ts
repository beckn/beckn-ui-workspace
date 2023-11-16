export interface Location {
  id: string
  city: string
  state: string
  country: string
}

export interface Job {
  jobId: string
  role: string
  description: string
  additionalDesc: any // You can define a more specific type if needed
  userSavedItem: boolean
  userAppliedItem: boolean
  locations: Location[]
}

export interface Company {
  id: string
  name: string
}

interface JobResult {
  company: Company
  jobs: Job[]
}

export interface Context {
  transactionId: string
  messageId: string
  bppId: string
  bppUri: string
}

export interface JobResponse {
  context: Context
  jobProviderPlatform: string
  jobResults: JobResult[]
}

export interface JobsSearchPropsModel {
  jobs: JobResponse[]
  searchvalue?: string
  handleChange?: Function
}

export interface JobInfo {
  jobRole: string
  jobId: string
  companyName: string
  platformName: string
  bppId: string
  bppUri: string
  transactionId: string
  location: string
  jobDescription: string
  companyId: string
}
