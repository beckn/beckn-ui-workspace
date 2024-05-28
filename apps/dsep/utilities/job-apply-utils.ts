import { JobCredential } from '../components/jobApply/JobApply.types'
import { ConfirmResponseModel } from '../lib/types/confirm.types'
import { InitResponseModel } from '../lib/types/init.types'
import { SelectResponseModel } from '../lib/types/select.types'
import { ParsedItemModel } from '../types/search.types'

export const getSelectPayloadForJobs = (jobForApply: ParsedItemModel) => {
  const { bppId, bppUri, transactionId, domain, providerId, item } = jobForApply
  const payloadForjobSelect = {
    data: [
      {
        context: {
          transaction_id: transactionId,
          bpp_id: bppId,
          bpp_uri: bppUri,
          domain: domain
        },
        message: {
          orders: {
            provider: {
              id: providerId
            },
            items: [
              {
                id: item.id
              }
            ]
          }
        }
      }
    ]
  }

  return payloadForjobSelect
}

export const getInitPayloadForJobs = (
  jobsSelectRes: SelectResponseModel,
  // credentials: JobCredential[],
  name: string
) => {
  const { transaction_id, bpp_id, bpp_uri, domain } = jobsSelectRes.data[0].context
  const {
    order: {
      items,
      provider: { id }
    }
  } = jobsSelectRes.data[0].message
  const { id: itemId } = items[0]
  const payload = {
    data: [
      {
        context: {
          transaction_id,
          bpp_id,
          bpp_uri,
          domain
        },
        message: {
          orders: {
            provider: {
              id
            },
            items: [
              {
                id: itemId
              }
            ],
            fulfillments: [
              // TODO :- To add dynamic fulfilllment here if we get that from select response of job and also there are lot of gaps here
              {
                id: '',
                customer: {
                  person: {
                    name: name,
                    languages: [
                      {
                        code: 'ENG'
                      },
                      {
                        code: 'HIN'
                      }
                    ],
                    url: 'https://www.google.com',
                    // creds: credentials,
                    skills: [
                      {
                        name: 'NodeJS'
                      },
                      {
                        name: 'React'
                      },
                      {
                        name: 'Project Management'
                      },
                      {
                        name: 'Enterprise Architecture'
                      }
                    ]
                  }
                }
              }
            ],
            xinput: {
              data: {
                resume: 'data:application/pdf;base64,JVBERi0xLjUKJd...c3RyZWFtCnjarVhLc9s2...',
                'work-mode': 'hybrid',
                'exp-years': '10',
                sop: 'I am interested in this job because my prior experience is highly relevant to this role.'
              },
              submission_id: 12345
            }
          }
        }
      }
    ]
  }

  return payload
}

export const getConfirmPayloadForJobs = (jobInitRes: InitResponseModel) => {
  const { transaction_id, bpp_id, bpp_uri, domain } = jobInitRes.data[0].context
  const { items, fulfillments } = jobInitRes.data[0].message.order
  const { id: itemID } = items[0]
  const payload = {
    data: [
      {
        context: {
          transaction_id,
          bpp_id,
          bpp_uri,
          domain
        },
        message: {
          orders: {
            // TODO :- from which field this ID would be matched
            id: 'jdhflks',
            items: [
              {
                id: itemID,
                // TODO :- This fulfillment id is not coming
                fulfillment_ids: ['1']
              }
            ],
            fulfillments: fulfillments
          }
        }
      }
    ]
  }

  return payload
}

export const getPostOrderPayload = (jobConfirmRes: ConfirmResponseModel) => {
  const { context, message } = jobConfirmRes.data[0]
  const {
    orderId,
    provider: { id, images, long_desc, name, short_desc },
    items,
    fulfillments
  } = message

  const ordersPayload = {
    context: context,
    message: {
      order: {
        id: orderId,
        provider: {
          id,
          descriptor: {
            name,
            short_desc
          }
        },
        items,
        fulfillments
      }
    },
    category: {
      set: [3]
    }
  }

  return ordersPayload
}
