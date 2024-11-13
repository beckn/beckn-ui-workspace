export const convertProductTagsIntoFormat = (data: Record<string, any>, position: number) => {
  const mapping: Record<number, any> = {
    0: {
      confidence_levels: 'modelConfidenceLevels',
      datapoint: 'floodPredictionDataPoints',
      spatial_coverage: 'spatialCoverage',
      spatial_representation: 'spatialRepresentationType',
      spatial_resolutions: 'spatialResolutions',
      temporal_coverage: 'temporalCoverage',
      temporal_resolutions: 'temporalResolutions'
    },
    1: {
      data_formats: 'dataFormats',
      data_sharing_modes: 'dataSharingModes',
      subscription_durations: 'subscriptionDuration'
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
      type: item.code === 'data_sharing_modes' || item.code === 'subscription_durations' ? 'radio' : 'checkbox',
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
