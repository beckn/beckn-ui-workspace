import { Box } from '@chakra-ui/react'
import PreferenceComponent from '../components/energyPurchaseForm'

const BuyingPreference = () => {
  return (
    <Box
      margin={'0 auto'}
      maxW={['100%', '100%', '40rem', '40rem']}
      className="hideScroll"
      maxH={'calc(100vh - 80px)'}
      overflowY="scroll"
    >
      <PreferenceComponent preferenceType={'buy'} />
    </Box>
  )
}

export default BuyingPreference
