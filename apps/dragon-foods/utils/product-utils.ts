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

  data.forEach((item: { code: any; list: Record<string, any>[] }) => {
    const key = mapping[position][item.code] as string
    if (!key) return

    formattedData[key] = {
      heading: key
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      type: item.code === 'data_sharing_modes' || item.code === 'subscription_durations' ? 'radio' : 'checkbox',
      options: item.list.map(({ value }) => ({
        label: value,
        value: value.replace(/\s+/g, '').toLowerCase()
      }))
    }
  })

  return formattedData
}
