import { ROLE, ROUTE_TYPE } from '@lib/config'
import axios from '@services/axios'
import Cookies from 'js-cookie'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useDispatch } from 'react-redux'
import CredLayoutRenderer, { CredFormErrors, FormProps } from '@components/credLayoutRenderer/LayoutRenderer'
import { validateCredForm } from '@utils/form-utils'
import { InputProps } from '@beckn-ui/molecules'
import { ItemMetaData } from '@components/credLayoutRenderer/CatalogueRenderer'

const options = [
  { label: 'Refrigerator', value: 'refrigerator' },
  { label: 'Air Conditioner', value: 'air_conditioner' },
  { label: 'Washing Machine', value: 'washing_machine' },
  { label: 'Microwave Oven', value: 'microwave_oven' },
  { label: 'Dishwasher', value: 'dishwasher' },
  { label: 'Television', value: 'television' },
  { label: 'Laptop', value: 'laptop' },
  { label: 'Smartphone', value: 'smartphone' },
  { label: 'Printer', value: 'printer' },
  { label: 'CCTV Camera', value: 'cctv_camera' }
]

const PhysicalAssets = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken')

  const [items, setItems] = useState<ItemMetaData[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormProps>({
    type: '',
    credName: ''
  })
  const [formErrors, setFormErrors] = useState<CredFormErrors>({
    type: '',
    credName: ''
  })

  const { t } = useLanguage()
  const dispatch = useDispatch()

  const fetchPairedData = async () => {
    try {
      const response = await axios.get(`${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/der`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        withCredentials: true
      })

      const result = response.data
      const mappedDevices = result.map((item: { category: string; id: number }) => ({
        name: item.category,
        paired: true,
        id: item.id
      }))
      setItems(mappedDevices)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  useEffect(() => {
    console.log(searchKeyword)
    // fetchPairedData()
  }, [searchKeyword])

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const handleOnSubmit = () => {
    const errors = validateCredForm(formData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      ...Object.keys(errors).reduce((acc: any, key) => {
        acc[key] = t[`${errors[key]}`] || ''
        return acc
      }, {} as CredFormErrors)
    }))

    const data = {
      type: formData.type
      // credName: formData.credName?.trim()
    }
    setIsLoading(true)

    const payload = JSON.stringify(data)
    console.log(payload)
    // axios
    //   .post(`${strapiUrl}/profiles`, currentFormData, requestOptions)
    //   .then(response => {
    //     dispatch(
    //       feedbackActions.setToastData({
    //         toastData: { message: 'Success', display: true, type: 'success', description: 'Added Successfully!' }
    //       })
    //     )
    //     setOpenModal(false)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
    //   .finally(() => {
    //     setIsLoading(false)
    //   })
    setOpenModal(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevFormData: FormProps) => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    const errors = validateCredForm(updatedFormData) as any
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: t[`${errors[name]}`] || ''
    }))
  }

  const handleSelectChange = (selectedItem: any) => {
    const { label, value } = selectedItem

    setFormData(prevFormData => ({
      ...prevFormData,
      ['type']: value
    }))

    const updatedFormData = {
      ...formData,
      ['type']: value
    }

    const errors = validateCredForm(updatedFormData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      ['type']: t[`${errors['type' as keyof CredFormErrors]}`] || ''
    }))
  }

  const isFormFilled = useMemo(() => {
    const { credName, ...restFormData } = formData
    const { credName: credNameError, ...restFormErrors } = formErrors

    return (
      Object.values(restFormData).every(value => value !== '') &&
      Object.values(restFormErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  const getInputs = useCallback(() => {
    const inputs: InputProps[] = [
      {
        type: 'text',
        name: 'type',
        value: formData.type!,
        handleChange: handleInputChange,
        label: 'Type',
        error: formErrors.type
      }
      // {
      //   type: 'text',
      //   name: 'deviceLocation',
      //   value: formData.deviceLocation!,
      //   handleChange: handleInputChange,
      //   label: 'Device Location',
      //   error: formErrors.deviceLocation
      // },
      // {
      //   type: 'text',
      //   name: 'assetsMaker',
      //   value: formData?.assetsMaker!,
      //   handleChange: handleInputChange,
      //   label: 'Assets Make',
      //   error: formErrors?.assetsMaker!
      // },
      // {
      //   type: 'text',
      //   name: 'modelNumber',
      //   value: formData?.modelNumber!,
      //   handleChange: handleInputChange,
      //   label: 'Model Number',
      //   error: formErrors?.modelNumber!
      // },
      // {
      //   type: 'text',
      //   name: 'serialNumber',
      //   value: formData?.serialNumber!,
      //   handleChange: handleInputChange,
      //   label: 'Serial Number',
      //   error: formErrors?.serialNumber!
      // }
    ]

    return inputs
  }, [formData])

  return (
    <CredLayoutRenderer
      schema={{
        items,
        search: {
          searchInputPlaceholder: 'Search Assets',
          searchKeyword,
          setSearchKeyword
        },
        modal: {
          schema: {
            header: 'Add New Asset',
            inputs: getInputs(),
            buttons: [
              {
                text: 'Add',
                handleClick: handleOnSubmit,
                disabled: !isFormFilled,
                variant: 'solid',
                colorScheme: 'primary'
              }
            ]
          },
          openModal,
          handleOpenModal,
          handleCloseModal,
          renderFileUpload: true
        }
      }}
    />
  )
}

export default PhysicalAssets
