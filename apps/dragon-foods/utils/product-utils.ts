export const convertProductTagsIntoFormat = (data: Record<string, any>, position: number) => {
  const mapping: Record<number, any> = {
    0: {
      'Confidence Levels': 'modelConfidenceLevels',
      'Flood Prediction Datapoint': 'floodPredictionDataPoints',
      'Spatial Coverage': 'spatialCoverage',
      'Spatial Representation': 'spatialRepresentationType',
      'Spatial Resolutions': 'spatialResolutions',
      'Temporal Coverage': 'temporalCoverage',
      'Temporal Resolutions': 'temporalResolutions'
    },
    1: {
      'Data Formats': 'dataFormats',
      'Data Sharing Modes': 'dataSharingModes',
      'Subscription Durations': 'subscriptionDuration'
    }
  }

  const formattedData: Record<string, any> = {}

  data.forEach((item: { code: any; list: Record<string, any>[]; description: string }) => {
    const key = mapping[position][item.code] as string
    if (!key) return

    formattedData[key] = {
      heading: key
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      type: item.code === 'Data Sharing Modes' || item.code === 'Subscription Durations' ? 'radio' : 'checkbox',
      options: item.list.map(data => ({
        label: data.value,
        value: data.value.replace(/\s+/g, '').toLowerCase(),
        data: { descriptor: { code: item.code, description: item.description }, data }
      }))
    }
  })

  return formattedData
}

const findOrCreateGroup = (descriptor: any, groupedData: any) => {
  let group = groupedData.find((item: any) => item.descriptor.code === descriptor.code)
  if (!group) {
    group = { descriptor, list: [] }
    groupedData.push(group)
  }
  return group
}
export const getSelectedProductDetails = (selectedItems: any) => {
  let groupedData: any = []

  Object.keys(selectedItems).forEach(key => {
    if (Array.isArray(selectedItems[key])) {
      selectedItems[key].forEach((item: any) => {
        if (item.data) {
          const descriptor = item.data.descriptor
          const dataItem = item.data.data

          const group = findOrCreateGroup(descriptor, groupedData)

          group.list.push(dataItem)
        }
      })
    }
  })
  return groupedData
}
