import React, { Component } from "react";
import { withRouter } from "react-router-dom";

// Components
import InputTag from "../../components/forms/InputTag";

// Styles
import styles from "./Signup.module.css";

class Signup extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    phoneCode: "",
    countryCode: "",
    ibanCode: "",
    cvv: "",
    expDate: "",
    userType: "guest",
    message: ''
  };

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onFormSubmit = async event => {
    event.preventDefault();
    const {
      username,
      email,
      password,
      phoneNumber,
      phoneCode,
      countryCode,
      ibanCode,
      cvv,
      expDate,
      userType
    } = this.state;

    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        phoneCode: phoneCode,
        countryCode: countryCode,
        IBAN: ibanCode,
        CVV: cvv,
        expirationDate: expDate
      })
    }

    await fetch(`http://localhost:8080/${userType === 'guest' ? 'users' : 'property-owners'}/create`, options)
      .then(res => res.json())
      .then(res => res.status === 1
        ? this.login(options)
        : this.setState({ message: res.message })
      )
      .catch(err => err.message
        ? this.setState({ message: err.message })
        : this.setState({ message: 'Error' })
      )
  };

  login = async (options) => {
    await fetch(`http://localhost:8080/${this.state.userType === 'guest' ? 'users' : 'property-owners'}/login`, options)
      .then(res => res.json())
      .then(res => {
        if (res.status !== 1) return
        this.props.updateAuth()
        window.scrollTo(0, 0);
        this.props.history.push('/')
      })
      .catch(err => err.message
        ? this.setState({ message: err.message })
        : this.setState({ message: 'Error' })
      )
  }

  render() {
    const {
      state: {
        message
      },
      handleInputChange,
      onFormSubmit
    } = this

    return (
      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <h1 className={styles.title}>Sign up</h1>
          {message && <p>{message}</p>}
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={onFormSubmit}>
              <div className={styles.wrapper}>
                <div className={styles.wrapperContainer}>
                  <div className={styles.inputContainer}>
                    <div className={styles.subTitle}>
                      <h3>Info</h3>
                    </div>
                    <InputTag
                      type="text"
                      label="Username"
                      name="username"
                      onChange={handleInputChange}
                    />
                    <InputTag
                      type="email"
                      label="E-mail"
                      name="email"
                      onChange={handleInputChange}
                    />
                    <InputTag
                      type="password"
                      label="Password"
                      name="password"
                      onChange={handleInputChange}
                    />
                    <InputTag
                      type="password"
                      label="Repeat password"
                      name="repeatPassword"
                    />
                    <InputTag
                      type="text"
                      label="Phone number"
                      name="phoneNumber"
                      onChange={handleInputChange}
                    />
                    <InputTag
                      type="text"
                      label="Phone code"
                      name="phoneCode"
                      onChange={handleInputChange}
                    />
                    <InputTag
                      type="text"
                      label="Country code"
                      name="countryCode"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className={styles.wrapperContainer}>
                  <div className={styles.inputContainer}>
                    <div className={styles.subTitle}>
                      <h3>Creditcard</h3>
                    </div>
                    <InputTag
                      type="number"
                      label="IBAN code"
                      name="ibanCode"
                      onChange={handleInputChange}
                    />
                    <InputTag
                      type="number"
                      label="CVV"
                      name="cvv"
                      onChange={handleInputChange}
                    />
                    <InputTag
                      type="text"
                      label="Exp Date"
                      name="expDate"
                      onChange={handleInputChange}
                    />
                    <select
                      className={styles.selectUserContainer}
                      name="userType"
                      onChange={handleInputChange}
                    >
                      <option value="guest">Guest</option>
                      <option value="property_owner">Property owner</option>
                    </select>
                    <div className={styles.submitContainer}>
                      <button className={styles.submitButton}>Signup</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    );
  }
}

export default withRouter(Signup)
