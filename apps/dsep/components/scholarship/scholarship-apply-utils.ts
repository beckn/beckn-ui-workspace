import { ConfirmResponseModel } from '../../lib/types/confirm.types'
import { InitResponseModel } from '../../lib/types/init.types'
import { SelectResponseModel } from '../../lib/types/select.types'
import { ParsedItemModel } from '../../types/search.types'

export const getSelectPayloadForScholarship = (scholarshipForApply: ParsedItemModel) => {
  const { bppId, bppUri, transactionId, domain, providerId, item } = scholarshipForApply
  const payload = {
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
            // TODO :- to check if it is necessary or not
            // fulfillments: [
            //   {
            //     id: 'DSEP_FUL_63587501'
            //   }
            // ],
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

  return payload
}

export const getInitPayloadForScholarship = (scholarshipSelectRes: SelectResponseModel) => {
  const { transaction_id, bpp_id, bpp_uri, domain } = scholarshipSelectRes.data[0].context
  const {
    order: {
      items,
      provider: { id, name, short_desc },
      fulfillments
    }
  } = scholarshipSelectRes.data[0].message
  const { id: itemId, name: itemName, short_desc: itemShortDesc, price, tags } = items[0]
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
            type: 'DEFAULT',
            provider: {
              id,
              descriptor: {
                name,
                short_desc
              },
              // TODO :- check for this field in response
              rateable: false
            },
            items: [
              {
                id: itemId,
                descriptor: {
                  name: itemName,
                  short_desc: itemShortDesc
                },
                price: price,
                xinput: {
                  required: true,
                  form: {
                    url: 'http://localhost:8001/public/getForm/a9aaecca-10b7-4d19-b640-022723112309/da0052a822dc4cdf95ab136b5614d0c9',
                    mime_type: 'text/html',
                    data: {
                      name: 'James',
                      phone: '498674',
                      address: 'Mumbai',
                      needOfScholarship: 'higher education',
                      docUrl: 'http://abc.co/docs'
                    },
                    submission_id: '8203501c-8934-468c-b947-1d5317847e9a'
                  }
                },
                rateable: false,
                tags: tags,
                // TODO :- from where I will get this
                category_ids: ['DSEP_CAT_1']
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

export const getConfirmPayloadForScholarship = (scholarshipInitRes: InitResponseModel) => {
  const { transaction_id, bpp_id, bpp_uri, domain } = scholarshipInitRes.data[0].context
  const {
    items,
    fulfillments,
    provider: { id, name, short_desc }
  } = scholarshipInitRes.data[0].message.order
  const { id: itemID, price, tags, name: itemName, short_desc: itemShortDesc } = items[0]
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
            type: 'DEFAULT',
            provider: {
              id,
              descriptor: {
                name,
                short_desc
              },
              rateable: false
            },
            items: [
              {
                id: itemID,
                descriptor: {
                  itemName,
                  itemShortDesc
                },
                price: price,
                xinput: {
                  required: true,
                  // TODO :- To fill the correct user name and details in the below form and check for x-input details
                  form: {
                    url: 'http://localhost:8001/public/getForm/a9aaecca-10b7-4d19-b640-022723112309/da0052a822dc4cdf95ab136b5614d0c9',
                    data: {
                      name: 'James',
                      phone: '498674',
                      address: 'Mumbai',
                      needOfScholarship: 'higher education',
                      docUrl: 'http://abc.co/docs'
                    },
                    mime_type: 'text/html',
                    submission_id: '8203501c-8934-468c-b947-1d5317847e9a'
                  }
                },
                rateable: false,
                tags: tags,
                // TODO :- check for the below field in the init response
                category_ids: ['DSEP_CAT_1']
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
      set: [2]
    }
  }

  return ordersPayload
}
