import React, { Component } from "react";

import styles from "./UpdateUser.module.css";
import InputTag from "../../components/forms/InputTag";

export default class UpdateUser extends Component {
  state = {
    username: '',
    email: '',
    password: ''
  }

  componentDidMount() {
    this.getUser()
  }

  getUser = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    };

    if (!this.props.auth.user) return;

    await fetch(`http://localhost:8080/${this.props.auth.user.userType === 'propertyOwner' ? 'property-owners' : 'users'}/information`, options)
      .then(res => res.json())
      .then(res => {
        this.setState({
          username: res.user.username,
          email: res.user.email,
        })
      })
      .catch(err => console.log(err))
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

    await fetch(`http://localhost:8080/${this.props.auth.user.userType === 'propertyOwner' ? 'property-owners' : 'users'}`, options)
      .then(res => res.json())
      .then(res => this.props.updateAuth())
      .catch(err => console.log(err))
  }

  render() {
    const {
      username,
      email,
      password
    } = this.state;


    return (
      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <h1 className={styles.title}>Update profile</h1>
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={this.handleSubmit}>
              <div className={styles.wrapper}>
                <div className={styles.wrapperContainer}>
                  <div className={styles.inputContainer}>
                    <div className={styles.subTitle} />
                    <InputTag type="text" value={username} label="Username" name="username" onChange={event => this.setState({ username: event.target.value })} />
                    <InputTag type="text" value={email} label="E-mail" name="email" onChange={event => this.setState({ email: event.target.value })} />
                    <InputTag type="password" value={password} label="Password" name="password" onChange={event => this.setState({ password: event.target.value })} />
                  </div>
                  <div className={styles.submitContainer}>
                    <button className={styles.submitButton}>
                      Update profile
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
