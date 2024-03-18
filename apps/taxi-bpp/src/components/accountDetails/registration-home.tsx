'use client'

import React, { useState, useEffect } from 'react'
import styles from './registration.module.scss'
import { LogOut, Upload } from 'react-feather'
import { userSave } from '@/lib/apiClient'
import { LocalKey, AppRoutes, DocumentType } from '@/lib/constant'
import { getCookie } from '@/lib/CookiesHandler'
import { UserFields } from '@/lib/fieldsSet'
import { Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import DriverAppFooter from '../navFooter/nav-footer'
import { getAge } from '../switchButton/switchButton.utils'
import { uploadFile } from '../Account/Account.Services'
import { useRouter } from '@/navigation'
import DriverAppHeader from '../header/header'

export default function Registration() {
  const User = JSON.parse(getCookie(LocalKey.saveUser)) || null
  const [flag, setFlag] = useState(false)

  return (
    <div>
      <DriverAppHeader title={'Account'} />
      <div>
        {flag ? (
          <RegistrationSubmit />
        ) : (
          <RegistrationHome
            Flag={setFlag}
            User={User}
          />
        )}
      </div>
      <DriverAppFooter title="Account" />
    </div>
  )
}
const getDocumentDetails = (user: any, type: any) => {
  return user?.DriverDocuments?.find((x: any) => x.Document === type)?.DocumentNumber || ''
}
function RegistrationHome({ Flag, User }: any) {
  const [name, setName] = useState(User.LongName || '')
  const [mobileno, setMobileNo] = useState(User.PhoneNumber || '')
  const [email, setEmail] = useState(User.Name || '')
  const [dob, setDateOfBirth] = useState(User.DateOfBirth || '')
  const isVerified = User?.Approved === 'Y' ? true : false
  const IsStore = User ? true : false
  const isDataChange = !(
    name === User.LongName &&
    mobileno === User.PhoneNumber &&
    email === User.Name &&
    dob === User.DateOfBirth
  )
  const getUpload = () => {
    let userId = User.Id
    const user = {
      Id: userId,
      LongName: name,
      Name: email,
      PhoneNumber: mobileno,
      DateOfBirth: dob
    }

    const userData = {
      Users: [{ ...user }]
    }

    userSave('users/save/', userData, UserFields, IsStore, 'driver').then(res => {})
  }
  const isValid = getAge(dob)
  const NextButton = () => {
    if (name && mobileno && email && isValid) {
      return (
        <button
          type="button"
          onClick={e => {
            e.preventDefault()
            Flag(true)
            isDataChange && getUpload()
          }}
          className={`btn  ${styles['btn-secondary']} ${styles.coloract}`}
        >
          Next
        </button>
      )
    } else {
      return (
        <button
          type="button"
          className={`btn  ${styles['btn-secondary']}`}
          disabled
        >
          Next
        </button>
      )
    }
  }

  const [file, setFile] = useState('')
  function handleChange(e: any) {
    setFile(URL.createObjectURL(e.target.files[0]))
  }
  return (
    <div>
      <div className={styles['Registration-body']}>
        {/* <div className="logout" onClick={logout}>
          <LogOut />
          LogOut
        </div> */}

        <div className={styles['imgcenter']}>
          {/* <input type="file" onChange={handleChange} />
          <img src={file} className="profileimg"/> */}
          <img
            src={'/dummy-image.jpg'}
            alt="Driver Image"
            className={styles['profileimg']}
          />
        </div>

        <div className={styles['top-padding']}>
          <span className={styles['bold-text']}>Name :</span>
          <span className={styles['top-padding4']}>
            <input
              placeholder="Enter your Name"
              value={name}
              disabled={isVerified}
              onChange={e => setName(e.target.value)}
              type="text"
              className={styles['top-padding4']}
            />
          </span>
        </div>

        <div className={styles['top-padding']}>
          <span className={styles['bold-text']}>Email ID :</span>
          <span className={`${styles['top-padding4']} ${styles['align-left']}`}>
            <input
              placeholder="Enter Your Email ID"
              type="text"
              value={email}
              disabled={isVerified}
              onChange={e => setEmail(e.target.value)}
              className={styles['top-padding4']}
            />
          </span>
        </div>

        <div className={styles['top-padding']}>
          <span className={styles['bold-text']}>Mobile Number :</span>
          <span className={`${styles['top-padding4']} ${styles['align-left']}`}>
            <input
              placeholder="Enter Your Mobile Number"
              type="text"
              id="PhoneNumber"
              pattern="/^(\+\d{1,3}[- ]?)?\d{10}$/"
              title="Please Not Enter spaces"
              maxLength={10}
              minLength={10}
              value={mobileno}
              disabled={isVerified}
              onChange={(e: any) => setMobileNo(e.target.value)}
              className={styles['top-padding4']}
            />
          </span>
        </div>

        <div className={styles['top-padding']}>
          <span className={styles['bold-text']}>Date Of Birth :</span>
          <span className={`${styles['top-padding4']} ${styles['align-left']}`}>
            <input
              placeholder="Enter Your Date Of Birth(YYYY-MM-DD)"
              type="text"
              value={dob}
              disabled={isVerified}
              onChange={e => setDateOfBirth(e.target.value)}
              className={styles['top-padding4']}
            />
          </span>
          {dob.length > 8 && !isValid && (
            <span className={styles['color-red']}>Please enter valid date in (YYYY-MM-DD) format</span>
          )}
        </div>

        {!isVerified && (
          <div className={styles['top-padding2']}>
            <NextButton />
          </div>
        )}
      </div>
    </div>
  )
}

function RegistrationSubmit() {
  const User = JSON.parse(getCookie(LocalKey.saveUser)) || null
  const [showModal, setShowModal] = useState(false)
  const [eKycPassword, setEKycPassword] = useState('')
  const [PanNumber, setPanNumber] = useState('')
  const [LicenseNumber, setLicenseNumber] = useState('')
  const [eKycPasswordFile, setEKycPasswordFile] = useState('')
  const [PanNumberFile, setPanNumberFile] = useState('')
  const [LicenseNumberFile, setLicenseNumberFile] = useState('')
  const router = useRouter()
  // const navigate = useNavigate()
  useEffect(() => {
    init()
  }, [])

  const renderImageTooltip = (props: any) => <Tooltip {...props}>Upload JPG or PNG file</Tooltip>
  const renderZipTooltip = (props: any) => <Tooltip {...props}>Upload Zip file</Tooltip>
  const init = () => {
    document.title = `taxi BPP - Account Information`
    if (User && User?.DriverDocuments) {
      let LicenceNo = User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Licence)?.DocumentNumber
      let PanNumber = User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Pan)?.DocumentNumber
      setLicenseNumber(LicenceNo?.toUpperCase())
      setPanNumber(PanNumber?.toUpperCase())
    }
  }

  const getUpload = (e: any, type: any) => {
    let file = e.target.files[0]
    let formData = new FormData()
    let number = type === DocumentType.Licence ? LicenseNumber : PanNumber
    let userId = User.Id
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

    uploadFile('driver_documents/save', formData, '', true).then(res => {})
  }

  function SubmitButton() {
    if (PanNumber && LicenseNumber && eKycPassword && eKycPasswordFile && LicenseNumberFile && PanNumberFile) {
      return (
        <button
          onClick={() => setShowModal(true)}
          type="button"
          className={`btn ${styles['btn-secondary']} ${styles.coloract}`}
        >
          <span className="cart">Submit</span>
        </button>
      )
    } else {
      return (
        <button
          type="button"
          className={`btn  ${styles['btn-secondary']}`}
          disabled
        >
          Submit
        </button>
      )
    }
  }

  return (
    <>
      <div className={styles['Registrationsubmit']}>
        <div className={styles['top-padding']}>
          <span className={styles['bold-text']}>Aadhaar Card :</span>
          <div className={styles['top-padding4']}>
            <OverlayTrigger
              placement="top"
              overlay={renderZipTooltip}
            >
              <span className={styles['upload-btn-wrapper']}>
                <label
                  className={styles.uploadbtn}
                  htmlFor="AadharFile"
                  role={'button'}
                >
                  <img
                    alt="upload-button"
                    src={'/upload.png'}
                    className={styles.AccountIcon}
                  />
                </label>
                <input
                  type="file"
                  id="AadharFile"
                  name="AadharFile"
                  onChange={e => {
                    setEKycPasswordFile(e.target.value)
                    getUpload(e, DocumentType.Aadhar)
                  }}
                />
              </span>
            </OverlayTrigger>
            <input
              placeholder="Enter your E-KYC Zip password."
              type="text"
              className={`${styles['top-padding4']} ${styles['align-left']}`}
              value={eKycPassword}
              disabled={User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Aadhar)}
              onChange={e => setEKycPassword(e.target.value)}
            />
          </div>
        </div>

        <span className="mt-1 mb-0 small">
          {User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Aadhar)?.VerificationStatus}
        </span>

        <div className={styles['top-padding']}>
          <span className={styles['bold-text']}>PAN Number :</span>
          <div className={styles['top-padding4']}>
            <OverlayTrigger
              placement="top"
              overlay={renderImageTooltip}
            >
              <span className={styles['upload-btn-wrapper']}>
                <label
                  className={styles.uploadbtn}
                  htmlFor="PanFile"
                  role={'button'}
                >
                  <img
                    alt="upload-button"
                    src={'/upload.png'}
                    className={styles.AccountIcon}
                  />
                </label>
                <input
                  type="file"
                  name="PanFile"
                  id="PanFile"
                  disabled={PanNumber == '' || User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Pan)}
                  onChange={e => {
                    setPanNumberFile(e.target.value)
                    getUpload(e, DocumentType.Pan)
                  }}
                />
              </span>
            </OverlayTrigger>
            <input
              placeholder="Enter your PAN Number"
              type="text"
              className={`${styles['top-padding4']} ${styles['align-left']} ${styles['bold-text']}`}
              value={PanNumber}
              disabled={User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Pan)}
              onChange={e => setPanNumber(e.target.value)}
            />
          </div>
        </div>

        <span className="mt-1 mb-0 small">
          {PanNumber ? (
            User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Pan)?.VerificationStatus
          ) : !PanNumber ? (
            ''
          ) : (
            <span className={styles['color-red']}>please enter valid Pan Number</span>
          )}
        </span>

        <div className={styles['top-padding']}>
          <span className={styles['bold-text']}>Driving License :</span>
          <div className={styles['top-padding4']}>
            <OverlayTrigger
              placement="top"
              overlay={renderImageTooltip}
            >
              <span className={styles['upload-btn-wrapper']}>
                <label
                  className={styles.uploadbtn}
                  htmlFor="LicenseFile"
                  role={'button'}
                >
                  <img
                    alt="upload-button"
                    src={'/upload.png'}
                    className={styles.AccountIcon}
                  />
                </label>
                <input
                  type="file"
                  name="LicenseFile"
                  id="LicenseFile"
                  disabled={
                    LicenseNumber == '' || User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Licence)
                  }
                  onChange={e => {
                    setLicenseNumberFile(e.target.value)
                    getUpload(e, DocumentType.Licence)
                  }}
                />
              </span>
            </OverlayTrigger>
            <input
              placeholder="Enter your Driving License Number"
              type="text"
              className={`${styles['top-padding4']} ${styles['align-left']} ${styles['bold-text']}`}
              value={LicenseNumber}
              disabled={User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Licence)}
              onChange={e => setLicenseNumber(e.target.value)}
            />
          </div>
        </div>
        {/* && /^[A-Za-z][0-9/\W/]{2,20}$/i.test(LicenseNumber) 
        && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(PanNumber)
        */}
        <span className="mt-1 mb-0 small">
          {LicenseNumber ? (
            User?.DriverDocuments?.find((x: any) => x.Document === DocumentType.Licence)?.VerificationStatus
          ) : !LicenseNumber ? (
            ''
          ) : (
            <span className={styles['color-red']}>please enter valid License Number</span>
          )}
        </span>
        <div className={styles['top-padding2']}>
          <SubmitButton />
        </div>

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
        >
          <div>
            <button
              className={styles.close}
              onClick={() => {
                setShowModal(false)
                router.push(AppRoutes.driverDashboard)
              }}
            >
              ×
            </button>
          </div>

          <Modal.Body className={styles.mbody}>
            <div>
              <img
                alt="success-image"
                src={'/success.png'}
                className={styles.success}
              />
            </div>
            <br />
            <span className={styles['bold-text']}>Registration successfull!</span>
          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}
