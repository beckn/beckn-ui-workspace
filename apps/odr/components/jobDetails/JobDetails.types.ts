import { JobInfo } from '../jobSearch/JobsSearch.types'

export interface JobDetailsPagePropsModel {
  jobDetails: JobInfo
  encodedJobDetails: string | string[]
}
