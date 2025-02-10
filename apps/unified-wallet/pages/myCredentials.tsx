import { ROLE, ROUTE_TYPE } from '@lib/config'
import axios from '@services/axios'
import Cookies from 'js-cookie'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { useDispatch } from 'react-redux'
import CredLayoutRenderer, { CredFormErrors, FormProps } from '@components/credLayoutRenderer/LayoutRenderer'
import { validateCredForm } from '@utils/form-utils'
import { InputProps } from '@beckn-ui/molecules'

const options = [
  { label: 'Document', value: 'document' },
  { label: 'URL', value: 'url' }
]

const MyCredentials = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken')

  const [items, setItems] = useState<{ id: number; name: string; paired?: boolean }[]>([])
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
      type: formData.type,
      credName: formData.credName?.trim()
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
    return (
      Object.values(formData).every(value => value !== '') && Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  const getInputs = useCallback(() => {
    const inputs: InputProps[] = [
      {
        type: 'select',
        name: 'type',
        options: options,
        value: formData.type!,
        handleChange: handleSelectChange,
        label: 'Credential Type',
        error: formErrors.type
      },
      {
        type: 'text',
        name: 'credName',
        value: formData.credName!,
        handleChange: handleInputChange,
        label: 'Credential Name',
        error: formErrors.credName
      }
    ]

    if (formData.type === 'url') {
      inputs.push({
        type: 'text',
        name: 'url',
        value: formData?.url!,
        handleChange: handleInputChange,
        label: 'URL',
        error: formErrors?.url!
      })
    }

    return inputs
  }, [formData])

  return (
    <CredLayoutRenderer
      schema={{
        items,
        search: {
          searchInputPlaceholder: 'Search Credentials',
          searchKeyword,
          setSearchKeyword
        },
        modal: {
          schema: {
            header: 'Add New Credential',
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
          renderFileUpload: formData.type === 'document'
        }
      }}
    />
  )
}

export default MyCredentials
