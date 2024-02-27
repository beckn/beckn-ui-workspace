/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
// import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../../core/common.functions";
import { AppRoutes } from "../../../core/constant";
import { ErrorMessage } from "../../../shared/ErrorMessage/ErrorMessage";
import { LeftSection } from "../../../shared/graphics/LeftSection";
import { DarkLayout } from "../../../shared/layout/DarkLayout";
import "../Login.scss";
import { getCompanies, getRoles, userAction } from "../Login.services";

export const SignInPassword = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [Associations, setAssociation] = useState(null);
  const [Roles, setRoles] = useState(0);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    isAuthenticated(navigate);
    document.title = `Driver App Sign up`;
    !Associations && getRequiredList();
    // spinnerService.show(LocalKey.spinnerKey);
  };

  const navigateTo = (key) => navigate(key);

  const getRequiredList = () => {
    let initData = [getCompanies("companies")];
    Promise.all(initData).then((allData) => {
      // console.log("All Predata", allData);
      setAssociation(allData[0].data.Companies);
      //setRoles(allData[1].data.Roles);
    });
  };

  const handleSubmitForm = (formData) => {
    const {
      Email,
      Password1,
      Password2,
      FirstName,
      LastName = " ",
      PhoneNumber,
      Company,
      Role,
    } = formData;

    let path = "login";
    let data = {
      User: {
        Name: Email,
        Password: Password1,
        Password2: Password2,
        LongName: FirstName.concat(" ", LastName),
        PhoneNumber: PhoneNumber,
        Company: {
          Id: Company,
        },
        UserRole: {
          Id: "3",
        },
      },
    };

    userAction(path, data).then((res) => {
      navigateTo(AppRoutes.driverDashboard);
    });
  };

  return (
    <DarkLayout>
      <section>
        <Container fluid className="vh-100">
          <Row className="vh-100">
            <Col lg="3" className="p-0">
              <LeftSection />
            </Col>
            <Col
              lg="9"
              className="d-flex align-items-center justify-content-center"
            >
              <div className="w-100">
                <div className="row mt-3 w-100 justify-content-center">
                  <div className="col-12 col-lg-6">
                    <h1 className="mb-4">
                      Welcome <br /> to the Taxi Hub
                    </h1>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit((formData) =>
                    handleSubmitForm(formData),
                  )}
                >
                  <div className="row w-100 justify-content-center">
                    <div className="col-5 mb-4 col-12 col-lg-6">
                      <input
                        type="text"
                        {...register("FirstName", {
                          required: "First name is required",
                          pattern: {
                            value: /^[a-zA-Z][\sa-zA-Z]*/,
                            message:
                              "Can use upper and lower letters, and spaces but must not start with a space",
                          },
                          maxLength: {
                            value: 20,
                            message: "Character limit exceeded",
                          },
                          minLength: {
                            value: 20,
                            message: "Please enter Character",
                            value: 2,
                            message: "Please enter Valid FirstName",
                          },
                        })}
                        className={`form-control ${
                          errors?.FirstName ? "is-invalid" : ""
                        }`}
                        name="FirstName"
                        id="FirstName"
                        placeholder="Full Name*"
                      />
                      <ErrorMessage fieldError={errors?.FirstName} />
                    </div>

                    <div className="col-5 mb-4 col-12 col-lg-6">
                      <select
                        name="Company"
                        id="Company"
                        {...register("Company", {
                          required: "Select Company",
                        })}
                        //defaultValue={Company}
                        className={`form-control${
                          errors?.Company ? "is-invalid" : ""
                        }`}
                      >
                        <option value="" selected disabled>
                          Select Association Name*
                        </option>
                        {Associations &&
                          Associations.map((x) => (
                            <option value={x.Id} key={x.Id}>
                              {x.Name}
                            </option>
                          ))}
                      </select>
                      <ErrorMessage fieldError={errors?.Company} />
                    </div>
                    {/* <div className="col-5  mb-4 col-12 col-lg-6">
                      <select
                        name="Role"
                        id="Role"
                        {...register("Role", {
                          required: "Select Role",
                        })}
                        className={`form-control ${
                          errors?.Company ? "is-invalid" : ""
                        }`}
                      >
                        <option value="" selected disabled>
                          Select your role*
                        </option>
                        {Roles &&
                          Roles.map((x) => (
                            <option value={x.Id} key={x.Id}>
                              {x.Name}
                            </option>
                          ))}
                      </select>
                      <ErrorMessage fieldError={errors?.Role} />
                    </div> */}
                    <div className="col-5 mb-4 col-12 col-lg-6">
                      <input
                        type="text"
                        name="PhoneNumber"
                        id="PhoneNumber"
                        {...register("PhoneNumber", {
                          required: "Number is required",
                          pattern: {
                            value: /^[0-9\b]+$/,
                            message: "Please Not Enter spaces",
                          },
                          maxLength: {
                            value: 10,
                            message: "Please enter valid number",
                          },
                          minLength: {
                            value: 10,
                            message: "Please enter valid number",
                          },
                        })}
                        //value={PhoneNumber}
                        className={`form-control ${
                          errors?.PhoneNumber ? "is-invalid" : ""
                        }`}
                        placeholder="Enter Mobile Number*"
                      />
                      <ErrorMessage fieldError={errors?.PhoneNumber} />
                    </div>
                    <div className="col-5  mb-4 col-12 col-lg-6">
                      <input
                        type="email"
                        {...register("Email", {
                          required: "Email is required",
                          pattern: {
                            value:
                              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Please Enter valid Email Address",
                          },
                        })}
                        id="Email"
                        //value={Name}
                        className={`form-control ${
                          errors?.Email ? "is-invalid" : ""
                        }`}
                        placeholder="Enter Email ID*"
                      />
                      <ErrorMessage fieldError={errors?.Email} />
                    </div>
                    <div className="col-5 mb-4 col-12 col-lg-6">
                      <input
                        type="password"
                        name="Password1"
                        id="Password1"
                        {...register("Password1", {
                          required: "Password is required",
                          pattern: {
                            value: /^(?!.* )(?=.*[A-Za-z0-9]).{3,15}$/,
                            message: "Please Enter Valid Password Format",
                          },
                        })}
                        className={`form-control ${
                          errors?.PhoneNumber ? "is-invalid" : ""
                        }`}
                        placeholder="Create New Password*"
                      />
                      <ErrorMessage fieldError={errors?.Password1} />
                    </div>
                    <div className="col-5  mb-4 col-12 col-lg-6">
                      <input
                        type="password"
                        name="Password2"
                        id="Password2"
                        {...register("Password2", {
                          required: "Password is required",
                          pattern: {
                            value: /^(?!.* )(?=.*[A-Za-z0-9]).{3,15}$/,
                            message: "Please Enter Valid Password Format",
                          },
                          validate: (val) => {
                            if (watch("Password1") !== val) {
                              return "Your passwords do no match";
                            }
                          },
                        })}
                        className={`form-control ${
                          errors?.PhoneNumber ? "is-invalid" : ""
                        }`}
                        placeholder="Confirm Password*"
                      />
                      <ErrorMessage fieldError={errors?.Password2} />
                    </div>
                  </div>
                  <div className="row w-100 justify-content-center">
                    <div className="col-5 mb-3 d-grid col-12 col-lg-6">
                      <button className="btn btn-primary" type="submit">
                        submit
                      </button>
                    </div>
                    <div className="col-5 mb-3 d-grid col-12 col-lg-6">
                      <a
                        href={AppRoutes.admin}
                        role="button"
                        type="reset"
                        className="btn btn-dark"
                      >
                        cancel
                      </a>
                    </div>
                  </div>
                </form>
                <div className="row w-100 justify-content-left">
                  <div className="col-10 col-12 col-lg-6">
                    <p className="mt-5">
                      Existing User?{" "}
                      <Link
                        to={AppRoutes.signInPassword}
                        className="link-primary"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </DarkLayout>
  );
};

export default SignInPassword;
