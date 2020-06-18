import React, { Component } from "react";

import styles from "./UpdateCreditCard.module.css";
import InputTag from "../../components/forms/InputTag";

export default class UpdateCreditCard extends Component {
  state = {
    CVV: '',
    IBAN: '',
    expDate: ''
  }

  handleSubmit = async event => {
    event.preventDefault();

    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state),
      credentials: 'include'
    };
    if (!this.props.auth.user) return;
    if(this.props.auth.user.userType !== 'user') return;
    await fetch(`http://localhost:8080/users/credit-card`, options)
      .then(res => res.json())
      .then(res => {
            window.scrollTo(0, 0);
            this.props.updateAuth()
            this.props.history.push('/profile')
        })
      .catch(err => console.log(err))
  }

  render() {
    const {
      CVV,
      IBAN,
      expDate
    } = this.state;

    return (
      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <h1 className={styles.title}>Update credit card</h1>
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={this.handleSubmit}>
              <div className={styles.wrapper}>
                <div className={styles.wrapperContainer}>
                  <div className={styles.inputContainer}>
                    <div className={styles.subTitle} />
                    <InputTag type="text" value={IBAN} label="IBAN code" name="IBAN" onChange={event => this.setState({ IBAN: event.target.value })} />
                    <InputTag type="text" value={expDate} label="Expiration date" name="expDate" onChange={event => this.setState({ expDate: event.target.value })} />
                    <InputTag type="text" value={CVV} label="CVV" name="CVV" onChange={event => this.setState({ CVV: event.target.value })} />
                  </div>
                  <div className={styles.submitContainer}>
                    <button className={styles.submitButton}>
                      Update Credit card
                      </button>
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
