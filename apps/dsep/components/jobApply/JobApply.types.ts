export interface JobApplyFormData {
  name: string
  mobileNumber: string
  email: string
}

export interface JobApplyPropsMdoel {
  formData: JobApplyFormData
  setFormData: React.Dispatch<React.SetStateAction<JobApplyFormData>>
}

export interface JobCredential {
  url: string
  type: string
}
interface Location {
  id: string
  city: string
}

interface FulfillmentCategory {
  id: string
  type: string
  tracking: boolean
}

interface EducationalQualification {
  code?: string
  name?: string
  value: string
}

interface WorkExperience {
  code?: string
  name?: string
  value: string
}

interface JobResponsibility {
  [index: number]: string
}

interface EmploymentInfo {
  code?: string
  name?: string
  value: string
}

interface SalaryInfo {
  name: string
  value: string
}

interface SelectedJob {
  jobId: string
  role: string
  description: string
  additionalDesc?: any
  locations: Location[]
  fulfillmentCategory: FulfillmentCategory[]
  educationalQualifications: {
    category: string
    qualification: EducationalQualification[]
  }[]
  workExperience: {
    key: string
    experience: WorkExperience[]
  }
  responsibilities: JobResponsibility
  employmentInformation: {
    code: string
    name: string
    employmentInfo: EmploymentInfo[]
  }
  compensation: {
    code: string
    name: string
    salaryInfo: SalaryInfo[]
  }
  additionalFormUrl: string
}

interface Company {
  name: string
}

interface Context {
  transactionId: string
  bppId: string
  bppUri: string
}

export interface JobSelectResponseModel {
  context: Context
  company: Company
  selectedJobs: SelectedJob[]
}

interface JobApplicantProfile {
  name: string
  language: string[]
  profileUrl: string
  creds: {
    type: string
    url: string
  }[]
  skills: string[]
}
interface JobFulfillment {
  jobFulfillmentCategoryId: string
  jobApplicantProfile: JobApplicantProfile
}

export interface JobInitResponseModel {
  context: Context
  company: Company
  initiatedJobs: SelectedJob[]
  jobFulfillments: JobFulfillment[]
  additionalFormData: any[]
}
