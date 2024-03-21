'use client'

import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { LeftSection } from '../../../lib/shared/graphics/left-section'

import styles from './sign-in-with-email.module.scss'
import { DarkLayout } from '@/lib/shared/layout/dark-layout'
import { userAction } from '../auth-services'
import { Link, useRouter } from '@/navigation'
import { AppRoutes } from '@/lib/constant'

// TODO :- To check the styles and functionality of the following component

const SignInWithEmail = () => {
  const router = useRouter()

  const [Name, setName] = useState('')
  const [Password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let path = 'login'
    let data = {
      User: {
        Name: Name,
        Password: Password
      }
    }
    userAction(path, data, null).then(res => {
      router.push('/dashboard')
    })
  }

  return (
    <DarkLayout>
      <section>
        <Container
          fluid
          className="vh-100"
        >
          <Row className="vh-100">
            <Col
              lg="3"
              className="p-0"
            >
              <LeftSection />
            </Col>
            <Col
              lg="9"
              className="d-flex align-items-center justify-content-center"
            >
              <div className="w-100">
                <div className={`${styles.row} w-100 justify-content-center p-3`}>
                  <div className="col-6 mb-3 col-12 col-lg-6 ">
                    <h2>
                      Welcome to
                      <br />
                      the Taxi Hub
                    </h2>
                  </div>
                </div>
                <form
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    // TODO :- To enable event after proper implementation of components
                    handleSubmit(e)
                  }}
                >
                  <div className={`${styles.row} w-100 justify-content-center`}>
                    <div className="col-6 col-12 col-lg-6">
                      <div className={styles.row}>
                        <div className="col mb-4 ">
                          <input
                            type="text"
                            className="form-control"
                            value={Name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter Email ID"
                          />
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div className="col mb-3 ">
                          <input
                            type="password"
                            className="form-control"
                            value={Password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter Password"
                          />
                        </div>
                      </div>
                      <div className={`${styles.row} mb-3`}>
                        <div className="col ">
                          <Link
                            href={'#'}
                            // to="#"
                            className="link-primary"
                          >
                            Forgot Password
                          </Link>
                        </div>
                        {/* <div className="col text-end ">
                          <Link
                            href={'#'}
                            // to={AppRoutes.signInOtp}
                            className="link-primary"
                          >
                            Sign in with Mobile
                          </Link>
                        </div> */}
                      </div>
                      <div className={`${styles.row} btn-lg btn-block`}>
                        <button
                          type="submit"
                          className="btn w-100 btn-primary"
                          disabled={!Name || !Password}
                        >
                          Sign In
                        </button>
                      </div>
                      {/* <div className="row mb-3">
                        <Link
                          to={AppRoutes.admin}
                          role="button"
                          className="link-primary"
                        >
                          Cancel
                        </Link>
                      </div> */}
                      <div className={`${styles.row} mt-5`}>
                        <div className="col-12 col-lg-6 ">
                          New User?{' '}
                          <Link
                            href={AppRoutes.signUp}
                            className="link-primary d-lg-block"
                          >
                            Sign Up
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </DarkLayout>
  )
}

export default SignInWithEmail
