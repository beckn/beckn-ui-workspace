import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ResponseModel } from '../lib/types/responseModel'
import { ConsentFormData, DisputeFormData, ShippingFormData } from '../pages/checkoutPage'

const initialState = {
  transactionId: '',
  quoteResponse: null as (ResponseModel & ResponseModel[]) | null,
  customerDetails: null as ShippingFormData | null,
  disputeDetails: null as DisputeFormData | null,
  consentDetails: null as ConsentFormData | null,
  initResponse: null as (ResponseModel & ResponseModel[]) | null
}

const responseDataSlice = createSlice({
  name: 'responseData',
  initialState,
  reducers: {
    addTransactionId(state, action: PayloadAction<string>) {
      state.transactionId = action.payload
    },
    addQuoteResponse(state, action: PayloadAction<(ResponseModel & ResponseModel[]) | null>) {
      state.quoteResponse = action.payload
    },
    addCustomerDetails(state, action: PayloadAction<ShippingFormData | null>) {
      state.customerDetails = action.payload
    },
    addDisputeDetails(state, action: PayloadAction<DisputeFormData | null>) {
      state.disputeDetails = action.payload
    },
    addConsentDetails(state, action: PayloadAction<DisputeFormData | null>) {
      state.consentDetails = action.payload
    },
    addInitResponse(state, action: PayloadAction<(ResponseModel & ResponseModel[]) | null>) {
      state.initResponse = action.payload
    }
  }
})

export const responseDataActions = responseDataSlice.actions

export default responseDataSlice.reducer
