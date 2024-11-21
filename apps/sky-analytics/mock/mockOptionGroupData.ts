export const mockData1 = {
  modelConfidenceLevels: {
    heading: 'Model confidence levels:',
    type: 'checkbox',
    options: [
      { label: '90%', value: '90' },
      { label: '85%', value: '85' }
    ]
  },
  floodPredictionDataPoints: {
    heading: 'Flood prediction datapoints',
    type: 'checkbox',
    options: [
      { label: 'Annual Exceedance Probability (AEP)', value: 'aep' },
      { label: 'Return periods', value: 'returnPeriods' },
      { label: 'Flood onset date', value: 'floodOnsetDate' },
      { label: 'Flood duration', value: 'floodDuration' },
      { label: 'Flood depth', value: 'floodDepth' },
      { label: 'Flood peak flow velocity', value: 'floodPeakFlowVelocity' },
      { label: 'Flood runoff Volumes', value: 'floodRunoffVolumes' },
      { label: 'Flood runoff coefficient', value: 'floodRunoffCoefficient' }
    ]
  },
  spatialRepresentationType: {
    heading: 'Spatial representation type',
    type: 'checkbox',
    options: [
      { label: 'Vector', value: 'vector' },
      { label: 'Raster', value: 'raster' }
    ]
  },
  spatialCoverage: {
    heading: 'Spatial Coverage',
    type: 'checkbox',
    options: [
      { label: 'Balaganj', value: 'balaganj' },
      { label: 'Beanibazar', value: 'beanibazar' },
      { label: 'Bishwanath', value: 'bishwanath' },
      { label: 'Companiganj', value: 'companiganj' },
      { label: 'Fenchuganj', value: 'fenchuganj' },
      { label: 'Gopalganj', value: 'gopalganj' },
      { label: 'Gowainghat', value: 'gowainghat' },
      { label: 'Jaintiapur', value: 'jaintiapur' },
      { label: 'Kanaighat', value: 'kanaighat' },
      { label: 'Sylhetsardar', value: 'sylhetsardar' },
      { label: 'Zakiganj', value: 'zakiganj' },
      { label: 'Dakshinsurma', value: 'dakshinsurma' },
      { label: 'Osmaninagar', value: 'osmaninagar' }
    ]
  },
  spatialResolutions: {
    heading: 'Spatial Resolutions',
    type: 'checkbox',
    options: [
      { label: '80 m', value: '80m' },
      { label: '1.5 km', value: '1.5km' },
      { label: '5 km', value: '5km' }
    ]
  },
  temporalCoverage: {
    heading: 'Temporal Coverage',
    type: 'checkbox',
    options: [
      { label: '5 days', value: '5days' },
      { label: '10 days', value: '10days' },
      { label: '20 days', value: '20days' }
    ]
  },
  temporalResolutions: {
    heading: 'Temporal Resolutions',
    type: 'checkbox',
    options: [
      { label: '15 days', value: '15days' },
      { label: '30 days', value: '30days' }
    ]
  }
}

export const mockData2 = {
  dataFormats: {
    heading: 'Data formats',
    type: 'checkbox',
    options: [
      { label: 'WaterML', value: 'waterML' },
      { label: 'BUFR', value: 'bufr' },
      { label: 'CSV', value: 'csv' },
      { label: 'SQL', value: 'sql' }
    ]
  },
  dataSharingModes: {
    heading: 'Data sharing modes',
    type: 'radio',
    options: [
      { label: 'FTP', value: 'ftp' },
      { label: 'SOAP API', value: 'soapApi' },
      { label: 'Email', value: 'email' },
      { label: 'Cloud Storage', value: 'cloudStorage' }
    ]
  },
  subscriptionDuration: {
    heading: 'Subscription duration',
    type: 'radio',
    options: [
      { label: 'One time', value: 'oneTime' },
      { label: '15 days', value: '15days' },
      { label: '1 month', value: '1month' },
      { label: '2 months', value: '2months' },
      { label: '3 months', value: '3months' }
    ]
  }
}
