import { ApplicableToType, RulesTemplate, PolicyType, PolicyStatusType } from './types/metaData'

export const countries = [
  { value: 'india', label: 'India' },
  { value: 'gambia', label: 'Gambia' },
  { value: 'egypt', label: 'Egypt' }
]

export const indianCities = [
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

export const gambiaCities = [
  { value: 'Banjul', label: 'Banjul' },
  { value: 'Central River', label: 'Central River' },
  { value: 'Lower River', label: 'Lower River' },
  { value: 'North Bank', label: 'North Bank' },
  { value: 'Upper River', label: 'Upper River' },
  { value: 'Western', label: 'Western' }
]

export const egyptCities = [
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Alexandria', label: 'Alexandria' },
  { value: 'Giza', label: 'Giza' },
  { value: 'Minya', label: 'Minya' },
  { value: 'Suez', label: 'Suez' },
  { value: 'Damietta', label: 'Damietta' },
  { value: 'Ismailia', label: 'Ismailia' },
  { value: 'Shubra el-Kheima', label: 'Shubra el-Kheima' },
  { value: 'Aswan', label: 'Aswan' },
  { value: 'Luxor', label: 'Luxor' }
]

export const citiesByCountry = {
  india: indianCities,
  gambia: gambiaCities,
  egypt: egyptCities
}

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
  { value: PolicyStatusType.ACTIVE, label: 'Active', color: 'green' },
  { value: PolicyStatusType.INACTIVE, label: 'Inactive', color: 'red' },
  { value: PolicyStatusType.PUBLISHED, label: 'Publish', color: 'blue' }
]
