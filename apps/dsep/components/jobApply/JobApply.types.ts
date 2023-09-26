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
