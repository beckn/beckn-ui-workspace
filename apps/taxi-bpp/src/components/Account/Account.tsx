/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import { useEffect, useState } from 'react'
import Autocomplete from 'react-autocomplete'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Edit2, Upload } from 'react-feather'
import { getAutoCompleteValues, uploadFile } from './Account.Services.js'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getAddressInfoSchema, getPersonalInfoSchema } from './Account-schema'
import { getCookie } from '@/lib/CookiesHandler.js'
import { userSave } from '@/lib/apiClient.js'
import { UserFields } from '@/lib/fieldsSet.js'
import { ErrorMessage } from '@/lib/shared/error-message/error-message.jsx'
import { getAddress } from '@/lib/common.functions.js'
import { GroupsCode, LocalKey, SearchGroupsCode, DocumentType } from '@/lib/constant.js'

const enableEdit = (e: any, func: any, state: any) => {
  e.preventDefault()
  func(state)
}

const getItemValue = (item: any, code: any) => {
  return `${item[code]}`
}

const renderItem = (item: any, isHighlighted: any, styles: any, code: any) => {
  return (
    <div
      key={item[code]}
      id={item[code]}
      className={classNames({
        active: isHighlighted,
        'autocomplete-item': true
      })}
    >
      {item[code]}
    </div>
  )
}

const personalInfoSchema = getPersonalInfoSchema()

const PersonalDetailsForm = ({ User, IsStore, isNewUser, setNewUser, roleType }: any) => {
  const [isUserEdit, setIsUserEdit] = useState(IsStore)
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors, isValid, isDirty }
  } = useForm({
    mode: 'all',
    resolver: yupResolver(personalInfoSchema),
    defaultValues: {
      DateOfBirth: User?.DateOfBirth || null,
      Name: User?.Name,
      FirstName: User?.FirstName,
      LastName: User?.LastName,
      PhoneNumber: User?.PhoneNumber
      // Company: JSON.parse(getCookie(LocalKey.saveUser)).Company
      // TODO :- uncomment the above comment if needed or get any bug
    }
  })

  const onSubmit = (data: any) => {
    const user = {
      DateOfBirth: data.DateOfBirth,
      Name: data.Name,
      LongName: data.FirstName.concat(' ', data.LastName),
      PhoneNumber: data.PhoneNumber
    }

    const UserSave = 'users/save'
    const userData = {
      Users: [{ ...user }]
    }

    userSave(UserSave, userData, UserFields, IsStore, roleType).then(res => {
      if (isNewUser) {
        setNewUser(res.data.Users[0])
        setIsUserEdit(true)
      } else {
        setIsUserEdit(true)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row mt-2">
          <div className="col">
            <h4 className="mb-0">Personal Information:</h4>
          </div>
          <div className="col text-end">
            {isUserEdit ? (
              <button
                className="btn btn-icon btn-sm"
                onClick={e => enableEdit(e, setIsUserEdit, false)}
              >
                <Edit2 />
              </button>
            ) : (
              <>
                <button
                  className="btn btn-secondary btn-sm me-2"
                  onClick={e => {
                    reset()
                    enableEdit(e, setIsUserEdit, true)
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  type="submit"
                  disabled={!isValid || !isDirty}
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        <hr className="mt-0 mb-3" />
        <div className="row w-100 justify-content-left">
          <div className="col-6 mb-3">
            <input
              type="text"
              {...register('FirstName')}
              id="FirstName"
              disabled={isUserEdit}
              className={classNames({
                'form-control': true,
                error: errors?.FirstName
              })}
              placeholder="First Name"
            />
            <ErrorMessage fieldError={errors?.FirstName} />
          </div>
          <div className="col-6 mb-3">
            <input
              type="text"
              {...register('LastName')}
              id="LastName"
              disabled={isUserEdit}
              className={classNames({
                'form-control': true,
                error: errors?.LastName
              })}
              placeholder="Last Name"
            />
            <ErrorMessage fieldError={errors?.LastName} />
          </div>
        </div>
        <div className="row w-100 justify-content-left">
          <div className="col-4 mb-3">
            <input
              type="text"
              {...register('PhoneNumber')}
              id="PhoneNumber"
              disabled={isUserEdit}
              className={classNames({
                'form-control': true,
                error: errors?.PhoneNumber
              })}
              placeholder="Mobile Number"
            />
            <ErrorMessage fieldError={errors?.PhoneNumber} />
          </div>
          <div className="col-4 mb-3">
            <input
              type="text"
              {...register('Name')}
              id="Name"
              disabled={isUserEdit}
              className={classNames({
                'form-control': true,
                error: errors?.Name
              })}
              placeholder="Email"
            />
            <ErrorMessage fieldError={errors?.Name} />
          </div>
          <div className="col-4  mb-3">
            <Controller
              control={control}
              name="DateOfBirth"
              render={({ field }) => (
                <ReactDatePicker
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  placeholderText="Enter Date Of Birth"
                  className={classNames({
                    'form-control': true,
                    error: errors?.DateOfBirth
                  })}
                  disabled={isUserEdit}
                  name="DateOfBirth"
                  id="DateOfBirth"
                  onChange={date => field.onChange(date)}
                  selected={field.value ? new Date(field.value) : field.value}
                  minDate={new Date('1980/01/01')}
                />
              )}
            />

            <ErrorMessage fieldError={errors?.DateOfBirth} />
          </div>
        </div>
      </form>
    </>
  )
}

const AddressInfoForm = ({ User, IsStore, isNewUser, NewUser, setNewUser }: any) => {
  const [isAddressEdit, setIsAddressEdit] = useState(User && isEmpty(getAddress(User)) ? false : IsStore)

  const [otherFields, setOtherFields] = useState<any>({
    autocompleteCityData: [],
    autocompleteStateData: [],
    autocompletePinCodeData: []
  })

  const addressInfoSchema = getAddressInfoSchema({
    PinCodes: otherFields.autocompletePinCodeData.map((e: any) => getItemValue(e, 'PinCode')),
    CityNames: otherFields.autocompleteCityData.map((e: any) => getItemValue(e, 'Name')),
    StateNames: otherFields.autocompleteStateData.map((e: any) => getItemValue(e, 'Name'))
  })

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors, isValid, isDirty },
    getValues,
    setValue,
    clearErrors
  } = useForm({
    mode: 'all',
    resolver: yupResolver(addressInfoSchema),
    defaultValues: {
      AddressLine1: User?.AddressLine1 || '',
      AddressLine2: User?.AddressLine2 || '',
      AddressLine3: User?.AddressLine3 || '',
      PinCode: {
        PinCode: User?.PinCode?.PinCode || ''
      },
      City: {
        Name: User?.City?.Name || '',
        State: {
          Name: User?.City?.State?.Name || ''
          //TODO :- to check this if some error comes up
          // Country: {
          //   Name: 'India'
          // }
        }
      }
    }
  })

  const retrieveData = async (searchText: any, type: any) => {
    const response = await getAutoCompleteValues(SearchGroupsCode[type], searchText, null)

    setOtherFields((otherFields: any) => ({
      ...otherFields,
      [`autocomplete${type}Data`]: response.data[GroupsCode[type]]
    }))
  }

  const onSelect = (val: any, name: any, key: any) => {
    if (key === 'PinCode') {
      let getData = (otherFields as any)[`autocomplete${key}Data`].find((x: any) => x.PinCode === val)
      let getCity = getData.City.Name
      let getState = getData.State.Name

      retrieveData(getCity, 'City').then(() => {
        setValue('City.Name', getCity)
        clearErrors('City.Name')
      })

      retrieveData(getState, 'State').then(() => {
        setValue('City.State.Name', getState)
        clearErrors('City.State.Name')
      })
    }

    if (key === 'City') {
      let getData = otherFields[`autocomplete${key}Data`].find((x: any) => x.Name === val)
      let getState = getData.State.Name
      setValue('City.State.Name', getState)
      clearErrors('City.State.Name')
    }
  }

  const onSubmit = (data: any) => {
    // window.location.href = AppRoutes.adminDashboard;
    let UserSave = 'users/save'
    let userData = {
      User: {
        Id: isNewUser ? NewUser.Id : User.Id,
        Name: isNewUser ? NewUser.Name : User.Name,

        AddressLine1: data.AddressLine1,
        AddressLine2: data.AddressLine2,
        AddressLine3: data.AddressLine3,

        PinCode: {
          PinCode: data.PinCode.PinCode
        },
        City: {
          Name: data.City.Name,
          State: {
            Name: data.City.State.Name,
            Country: {
              Name: data.City.State.Country.Name
            }
          }
        }
      }
    }

    userSave(UserSave, userData, UserFields, IsStore, null).then(res => {
      if (isNewUser) {
        setNewUser(res.data.Users[0])
        setIsAddressEdit(true)
      } else {
        setIsAddressEdit(true)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row mt-4">
        <div className="col">
          <h4 className="mb-0">Address Information:</h4>
        </div>
        <div className="col text-end">
          {isAddressEdit ? (
            <button
              className="btn btn-icon btn-sm"
              onClick={e => enableEdit(e, setIsAddressEdit, false)}
            >
              <Edit2 />
            </button>
          ) : (
            <>
              <button
                className="btn btn-secondary btn-sm me-2"
                onClick={e => {
                  reset()
                  enableEdit(e, setIsAddressEdit, true)
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                type="submit"
                disabled={!isValid || !isDirty}
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>
      <hr className="mt-0 mb-3" />
      <div className="row w-100 justify-content-left">
        <div className="col-4 mb-3">
          <input
            type="text"
            {...register('AddressLine1')}
            id="AddressLine1"
            disabled={isAddressEdit}
            className="form-control"
            placeholder="Apartment, unit, suite, or floor #"
          />

          <ErrorMessage fieldError={errors?.AddressLine1} />
        </div>
        <div className="col-4  mb-3">
          <input
            type="text"
            {...register('AddressLine2')}
            id="AddressLine2"
            disabled={isAddressEdit}
            className="form-control"
            placeholder="Locality, Area"
          />

          <ErrorMessage fieldError={errors?.AddressLine2} />
        </div>
        <div className="col-4  mb-3">
          <input
            type="text"
            {...register('AddressLine3')}
            id="AddressLine3"
            disabled={isAddressEdit}
            className="form-control"
            placeholder="Land Mark (if any)"
          />

          <ErrorMessage fieldError={errors?.AddressLine3} />
        </div>
      </div>
      <div className="row w-100 justify-content-left">
        <div className="col-4 mb-3">
          <Controller
            control={control}
            name="PinCode.PinCode"
            render={({ field }) => (
              <Autocomplete
                className="btn btn-primary"
                getItemValue={e => getItemValue(e, 'PinCode')}
                items={otherFields.autocompletePinCodeData}
                renderItem={(item, props, styles) => renderItem(item, props, styles, 'PinCode')}
                value={field.value}
                onChange={e => {
                  field.onChange(e.target.value)
                  setValue('City.Name', '', {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true
                  })
                  setValue('City.State.Name', '', {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true
                  })

                  retrieveData(e.target.value, 'PinCode')
                }}
                onSelect={e => {
                  field.onChange(e)
                  onSelect(e, 'PinCode.PinCode', 'PinCode')
                }}
                wrapperProps={{ className: 'autocomplete-box' }}
                inputProps={{
                  type: 'tel',
                  className: `form-control`,
                  name: 'PinCode.PinCode',
                  id: 'PinCode',
                  disabled: isAddressEdit,
                  placeholder: 'Enter pin code*'
                }}
              />
            )}
          />

          <ErrorMessage fieldError={errors?.PinCode?.PinCode} />
        </div>
        <div className="col-4  mb-3">
          {User?.DriverDocument}

          <Controller
            control={control}
            name="City.Name"
            render={({ field }) => (
              <Autocomplete
                className="btn btn-primary"
                getItemValue={e => getItemValue(e, 'Name')}
                items={otherFields.autocompleteCityData}
                renderItem={(item, props, styles) => renderItem(item, props, styles, 'Name')}
                value={field.value}
                onChange={e => {
                  field.onChange(e.target.value)
                  setValue('City.State.Name', '', {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true
                  })

                  retrieveData(e.target.value, 'City')
                }}
                onSelect={e => {
                  field.onChange(e)
                  onSelect(e, 'City.Name', 'City')
                }}
                wrapperProps={{ className: 'autocomplete-box' }}
                inputProps={{
                  className: `form-control`,
                  disabled: (!getValues('City.Name') && !getValues('PinCode.PinCode')) || isAddressEdit,
                  name: 'City.Name',
                  id: 'City',
                  placeholder: 'Enter city name*'
                }}
              />
            )}
          />

          <ErrorMessage fieldError={errors?.City?.Name} />
        </div>
        <div className="col-4  mb-3">
          <Controller
            control={control}
            name="City.State.Name"
            render={({ field }) => (
              <Autocomplete
                className="btn btn-primary"
                getItemValue={e => getItemValue(e, 'Name')}
                items={otherFields.autocompleteStateData}
                renderItem={(item, props, styles) => renderItem(item, props, styles, 'Name')}
                value={field.value}
                onChange={e => {
                  field.onChange(e.target.value)

                  retrieveData(e.target.value, 'State')
                }}
                onSelect={e => {
                  field.onChange(e)
                  onSelect(e, 'City.State.Name', 'State')
                }}
                wrapperProps={{ className: 'autocomplete-box' }}
                inputProps={{
                  className: `form-control`,
                  disabled: (!getValues('City.State.Name') && !getValues('PinCode.PinCode')) || isAddressEdit,
                  name: 'City.State.Name',
                  id: 'State',
                  placeholder: 'Enter state name*'
                }}
              />
            )}
          />
          <ErrorMessage fieldError={errors?.City?.State?.Name} />
        </div>
      </div>
    </form>
  )
}

export const Account = (prop: any) => {
  const { formType } = prop
  const [NewUser, setNewUser] = useState(prop?.EditUser ? prop?.EditUser : '')
  const User = prop.User ? JSON.parse(getCookie(LocalKey.saveUser)) : NewUser || null
  const IsStore = User && !prop.NewUser && !prop.EditUser ? true : false

  // const [documentInfo, setDocumentInfo] = useState([]);
  const [PanNumber, setPanNumber] = useState('')
  const [LicenseNumber, setLicenseNumber] = useState('')
  const [eKycPassword, setEKycPassword] = useState<any>(null)

  useEffect(() => {
    init()
  }, [])

  // need this when we implement custome date picker
  // const years = (startYear) => {
  //   var currentYear = new Date().getFullYear(),
  //     years = [];
  //   startYear = startYear || 1980;
  //   while (startYear <= currentYear) {
  //     years.push(startYear++);
  //   }
  //   return years;
  // };

  const init = () => {
    document.title = `taxi BPP - Account Information`
    if (User && User?.DriverDocuments) {
      let LicenceNo = User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Licence)?.DocumentNumber
      let PanNo = User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Pan)?.DocumentNumber
      setLicenseNumber(LicenceNo?.toUpperCase())
      setPanNumber(PanNo?.toUpperCase())
    }
  }

  const getUpload = (e: any, type: any) => {
    let file = e.target.files[0]
    let formData = new FormData()
    let number = type === DocumentType.Licence ? LicenseNumber : PanNumber
    let userId = prop.NewUser ? NewUser.Id : User.Id

    if (type === DocumentType.Licence || type === DocumentType.Pan) {
      formData.append('ADDRESS_LINE_1', User?.AddressLine1 || '')
      formData.append('ADDRESS_LINE_2', User?.AddressLine2 || '')
      formData.append('ADDRESS_LINE_3', User?.AddressLine3 || '')
      formData.append('CITY_NAME', User?.City?.Name || '')
      formData.append('STATE_NAME', User?.City?.State.Name || '')
      formData.append('EMAIL', User.Name)
      formData.append('PHONE_NUMBER', User.PhoneNumber)
      formData.append('DATE_OF_BIRTH', User.DateOfBirth)
    }

    formData.append('DOCUMENT', type)
    formData.append('FILE', file)
    formData.append('DRIVER_ID', userId)
    formData.append('DOCUMENT_NUMBER', number)
    type === DocumentType.Aadhar && formData.append('PASSWORD', eKycPassword)

    uploadFile('driver_documents/save', formData, '', prop.NewUser ? false : true).then(res => {
      if (prop.NewUser) {
        setNewUser({
          ...NewUser,
          DriverDocuments: NewUser.DriverDocuments ? [...NewUser?.DriverDocuments, res.data.DriverDocument] : []
        })
      }
    })
  }

  // const getSelect = (e) => {
  //   e.preventDefault();
  //   let type = {
  //     AadharFile: "AADHAR",
  //     PanFile: "PAN",
  //     LicenseFile: "LICENSE",
  //   };
  //   let fieldMap = {
  //     AadharFile: eKycPassword,
  //     // PanFile: PanNumber,
  //     LicenseFile: LicenseNumber,
  //   };
  //   let file = e.target.files[0];
  //   let name = e.target.name;
  //   let copy = documentInfo;
  //   copy.push({
  //     [name]: file,
  //     type: type[name],
  //     DocumentNumber: fieldMap[name],
  //   });
  //   setDocumentInfo(copy);
  // };

  return (
    <section>
      <div className={classNames({ 'vh-100': true, 'container-fluid g-0': User })}>
        <PersonalDetailsForm
          IsStore={IsStore}
          User={User}
          isNewUser={prop.NewUser}
          setNewUser={setNewUser}
          roleType={formType}
        />

        <AddressInfoForm
          User={User}
          IsStore={IsStore}
          isNewUser={prop.NewUser}
          NewUser={NewUser}
          setNewUser={setNewUser}
          roleType={formType}
        />

        <form onSubmit={e => {}}>
          <>
            <div className="row mt-4">
              <div className="col">
                <h4 className="mb-0">Personal Documents:</h4>
              </div>
            </div>
            <hr className="mt-0 mb-3" />
            <div className="row w-100 justify-content-left align-items-center">
              {formType && formType === 'agent' ? null : (
                <>
                  <div className="col-3 mb-3">
                    <input
                      type="text"
                      name="LicenseNumber"
                      id="LicenseNumber"
                      defaultValue={LicenseNumber}
                      disabled={User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Licence)}
                      onChange={e => setLicenseNumber(e.target.value)}
                      className="form-control"
                      placeholder="Enter License Number"
                    />
                    <p className="mt-1 mb-0 small ps-2">
                      {User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Licence)?.VerificationStatus}
                    </p>
                  </div>
                  {!User?.DriverDocuments?.find((x: any) => x.Document === 'Licence') && (
                    <div className="col-1  mb-3">
                      <input
                        type="file"
                        name="LicenseFile"
                        id="LicenseFile"
                        className="form-control d-none"
                        onChange={e => getUpload(e, DocumentType.Licence)}
                      />
                      <label
                        htmlFor="LicenseFile"
                        role={'button'}
                      >
                        <Upload />
                      </label>
                    </div>
                  )}
                </>
              )}
              <div className="col-3 mb-3">
                <input
                  type="text"
                  name="PanNumber"
                  id="PanNumber"
                  defaultValue={PanNumber}
                  disabled={User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Pan)}
                  onChange={e => setPanNumber(e.target.value.toLowerCase())}
                  className="form-control"
                  placeholder="Enter Pan Number"
                />
                <p className="mt-1 mb-0 small ps-2">
                  {User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Pan)?.VerificationStatus}
                </p>
              </div>
              {!User?.DriverDocuments?.find((x: any) => x.Document === 'Pan') && (
                <div className="col-1  mb-3">
                  <input
                    type="file"
                    name="PanFile"
                    id="PanFile"
                    className="form-control d-none"
                    onChange={e => getUpload(e, DocumentType.Pan)}
                  />
                  <label
                    htmlFor="PanFile"
                    role={'button'}
                  >
                    <Upload />
                  </label>
                </div>
              )}
              <div className="col-3  mb-3">
                {!User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Aadhar) ? (
                  <input
                    type="password"
                    name="eKycPassword"
                    id="eKycPassword"
                    value={eKycPassword}
                    onChange={e => setEKycPassword(e.target.value)}
                    className="form-control"
                    placeholder="E-Kyc Aadhar File Password"
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      name="eKycPassword"
                      id="eKycPassword"
                      disabled={User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Aadhar)}
                      value={User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Aadhar).Document}
                      onChange={e => setEKycPassword(e.target.value)}
                      className="form-control"
                      placeholder="E-Kyc Aadhar File Password"
                    />
                    <p className="mt-1 mb-0 small ps-2">
                      {User?.DriverDocuments.find((x: any) => x.Document === DocumentType.Aadhar).VerificationStatus}
                    </p>
                  </>
                )}
              </div>
              {!User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Aadhar) && (
                <div className="col-1 mb-3">
                  <input
                    type="file"
                    name="AadharFile"
                    id="AadharFile"
                    onChange={e => getUpload(e, DocumentType.Aadhar)}
                    className="form-control d-none"
                  />
                  <label
                    htmlFor="AadharFile"
                    role={'button'}
                  >
                    <Upload />
                  </label>
                </div>
              )}
            </div>
            {prop.NewUser && (
              <div className="row">
                <div className="col text-end">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={e => prop.onChange(e, false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={e => prop.onChange(e, false)}
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
          </>
        </form>
      </div>
    </section>
  )
}

export default Account
