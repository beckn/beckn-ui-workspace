import React from 'react'
import JobDetails from '../components/jobDetails/JobDetails'

const jobDetailsResponse = [
  {
    jobTitle: 'Senior UX Analyst',
    companyName: 'EMinds',
    jobDesc:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam perspiciatis eum exercitationem blanditiis reiciendis sequi? Nihil velit ipsa facere veritatis ipsam, reprehenderit obcaecati consectetur assumenda nesciunt nulla minima non nisi!',
    requirements:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos voluptatem incidunt modi excepturi omnis provident. Nihil quaerat a doloribus accusamus temporibus corrupti perferendis sequi? Facere autem id repellat! Veniam, necessitatibus?',
    qualifications: 'BTech/Mtech',
    jobType: 'Full Time'
  }
]

const jobDetails = () => {
  return (
    <div>
      <JobDetails response={jobDetailsResponse[0]} />
    </div>
  )
}

export default jobDetails
