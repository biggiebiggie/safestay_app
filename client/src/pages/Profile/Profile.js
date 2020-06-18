import React, { Component } from "react";
import { Link, withRouter } from 'react-router-dom';

// Components
import ProfileProperties from './../../components/ProfileProperties/ProfileProperties';

// Styles
import styles from "./Profile.module.css";

class Profile extends Component {
  state = {
    user: {}
  }

  seeProperty = (id) => {
    window.scrollTo(0, 0);
    this.props.history.push({
      pathname: "/property",
      search: `?id=${id}`
    })
  }

  componentDidMount() {
    this.getUser()
  }

  deleteUser = async () => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.props.auth.user.userID,
        userType: this.props.auth.user.userType
      }),
      credentials: 'include'
    }
    await fetch(`http://localhost:8080/users`, options)
      .then(res => res.json())
      .then(res => {
        if (res.status !== 1) return
        this.props.updateAuth();
        this.props.history.push("/login");
      })
      .catch(err => console.log(err))

  }

  getUser = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }
    if (!this.props.auth.loggedIn) return;
    await fetch(`http://localhost:8080/${this.props.auth.user.userType === 'propertyOwner' ? 'property-owners' : 'users'}/information`, options)
      .then(res => res.json())
      .then(res => {
        if (res.status !== 1) return;
        this.setState({ user: res.user })
      })
      .catch(err => console.log(err))
  }

  render() {
    const {
      props: {
        auth
      },
      state: {
        user
      }
    } = this;

    if (!user || !auth.user) return null

    return (
      <main>
        <div className={styles.mainContainer}>
          <div className={styles.container}>
            <h1 className={styles.title}>Profile</h1>
          </div>
          <div className={styles.container}>
            <div className={styles.wrapper}>
              <div className={styles.wrapperContainer}>
                <div className={styles.wrapperContent}>
                  <h2 className={styles.title}>User information:</h2>
                  <p>Username: {user.username}</p>
                  <p>E-mail: {user.email}</p>
                  <p>Phone number: +({user.phoneCode}) {user.phoneNumber}</p>
                  <p>Country code: {user.countryCode}</p>
                  <button className={styles.deleteButton} onClick={() => this.deleteUser()}>Delete user</button>
                  <Link className={styles.updateButton} to="/update-profile">Update profile</Link>
                </div>
              </div>

              <div className={styles.wrapperContainer}>
                <div className={styles.wrapperContent}>
                  <h2 className={styles.title}>Creditcard:</h2>
                  <p>IBAN code: {user.IBAN}</p>
                  <Link to="/update-credit-card" className={styles.updateButton}>Change card</Link>
                </div>
              </div>
            </div>
            {auth.user.userType === 'propertyOwner' ? (
              <div className={styles.container}>
                <ProfileProperties properties={user.properties} updateProperties={this.getUser} />
              </div>
            ) : null}
          </div>
        </div>
      </main>
    );
  }
}

export default withRouter(Profile);
