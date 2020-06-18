import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import styles from "./HeaderFrontpage.module.css";

class HeaderMain extends Component {
  state = {
  };



  logOut = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }

    await fetch("http://localhost:8080/users/logout", options)
      .then(res => res.json())
      .then(res => {
        if (res.status !== 1) return console.log(res)
        this.props.updateAuth()
        this.props.history.push("/")
      })
      .catch(error => console.log(error))
  }

  render() {
    const image = "/images/ss_logo.png"
    return (
      <section className={styles.headerContainer}>
        <div className={styles.wrapper}>
          <div className={styles.logoContainer}>
            <Link to="/">
              <div className={styles.logo} style={{
                backgroundImage: `url("${image}")`,
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
              }}>
              </div></Link>
          </div>
          {
            !this.props.auth.loggedIn ? (
              <div className={styles.menuContainer}>
                <div className={styles.menuItem}>
                  <Link to="/login">Login</Link>
                </div>
                <div className={styles.menuItem}>
                  <Link to="/signup">Sign up</Link>
                </div>
              </div>
            ) : (
                <div className={styles.menuContainer}>
                  <div className={styles.menuItem}>
                    <Link to="/profile">Profile</Link>
                  </div>
                  <div className={styles.menuItem}>
                    <button onClick={this.logOut}>
                      Logout
                    </button>
                  </div>
                </div>
              )
          }
        </div >
      </section >
    );
  }
}

export default withRouter(HeaderMain)