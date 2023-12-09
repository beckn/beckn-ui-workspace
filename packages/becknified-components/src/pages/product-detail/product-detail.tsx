import { Button } from '@beckn-ui/molecules'
import { Box } from '@chakra-ui/react'
import React from 'react'
import { ProductDescription, ProductSummary } from '../../components'

//TODO :- This component is in progress

const ProductDetailPage = () => {
  return (
    <>
      <ProductSummary
        name="hajsdajgd ahgdha ahsgdahsgdhagsd hags"
        imageSrc="https://tourism-bpp-infra2.becknprotocol.io/attachments/view/292.jpg?imwidth=750"
      />
      <ProductDescription
        description="<div>
            <p><b>About the course:</b> This course will help you set up WordPress on AWS EC2, link to the RDS database, build a reliable NodeJS backend using Elastic Beanstalk, manage files via AWS S3, send emails with SES, and set CloudWatch alarms.</p>
            <p><b>Course details:</b></p>
            <p>Course Provider: ShopNotch</p>
            <p>Course Instructor: BackSpace Academy</p>
            <p>Course Length: 3 hours</p>
            <p>Modules: 14</p>
            <p>Skills taught: AWS, NodeJS</p>
            <p>Level: Beginner</p>
            <p>Schedule: Flexible</p>
            <p>Course delivery: Online</p>
        </div>"
        // description="taushd asjhd ajshdjahsd ajhsdjahsd jh jahsjd ajshdjahsd jahs djhas jhdwjd  jhasjhajshdjahsd jhs djahs dajhds "
      />
      <Box mt={'20px'}>
        <Button text="Proceed" />
      </Box>
    </>
  )
}

export default ProductDetailPage
