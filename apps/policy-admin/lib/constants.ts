import { ApplicableToType, RulesTemplate, PolicyType, PolicyStatusType } from './types/metaData'

export const countries = [
  { value: 'india', label: 'India' },
  { value: 'usa', label: 'USA' },
  { value: 'egypt', label: 'Egypt' }
]
export const cities = [
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'chennai', label: 'Chennai' },
  { value: 'hyderabad', label: 'Hyderabad' },
  { value: 'pune', label: 'Pune' },
  { value: 'ahmedabad', label: 'Ahmedabad' },
  { value: 'vishakhapatnam', label: 'Vishakhapatnam' },
  { value: 'jaipur', label: 'Jaipur' },
  { value: 'noida', label: 'Noida' }
]

export const infoCategories = [
  { value: PolicyType.GEOFENCE, label: 'Geofence' },
  { value: PolicyType.PRIVACY, label: 'Privacy' },
  { value: PolicyType.ALCOHOL, label: 'Alcohol' }
]

export const applicableToOptions = [
  { value: ApplicableToType.BAP, label: 'BAP' },
  { value: ApplicableToType.BPP, label: 'BPP' }
]

export const policyStatusOptions = [
  { value: PolicyStatusType.ACTIVE, label: 'Active' },
  { value: PolicyStatusType.INACTIVE, label: 'Inactive' },
  { value: PolicyStatusType.PUBLISH, label: 'Publish' }
]
