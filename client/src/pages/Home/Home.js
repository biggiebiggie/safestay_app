import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

// Component
import InputTag, { TextareaTag } from "./../../components/forms/InputTag";
import LocationWidget from "./../../components/Home/LocationWidget";
import HeaderFrontpage from "./../../components/header/HeaderFrontpage";

import { FaArrowRight } from 'react-icons/fa'

// Styles
import styles from "./Home.module.css";

class Home extends Component {
  state = {
    isRed: true,

    destination: "",
    checkIn: "",
    checkOut: "",
    guests: ""

  };

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onFormSubmit = e => {
    e.preventDefault()
    const { destination, checkIn, checkOut, guests } = this.state;
    this.props.handleTravelChanges(destination, checkIn, checkOut, guests);
    this.props.history.push("/search")
  }


  render() {
    const home1 = "/images/home1.jpg"
    const home2 = "/images/home2.jpg"
    const home3 = "/images/home3.jpg"
    const home4 = "/images/home4.jpg"
    const contact = "/images/contact.jpg"
    return (
      <main className={styles.pageContainer}>
        <section className={styles.textContainer}>
          <HeaderFrontpage auth={this.props.auth} updateAuth={this.props.updateAuth} />
          <h2 className={styles.headline}>
            Your home in the holidays - <br />Start your search now.
          </h2>
          <form className={styles.form} onSubmit={this.onFormSubmit}>
            <InputTag type="text" label="Destination" name="destination" onChange={this.handleInputChange} />
            <InputTag
              type="date"
              label="Check in / check out"
              name="checkIn"
              name2="checkOut"
              onChange={this.handleInputChange}
            />
            <InputTag type="number" label="Guests" name="guests" onChange={this.handleInputChange} />
            <button className={styles.submitButton}><FaArrowRight className={styles.arrow} /></button>
          </form>
        </section>
        <section className={styles.imageContainer}>
          <div className={styles.imageContent}>
            <div className={styles.wideImageContent} style={{
              backgroundImage: `url("${home4}")`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }} >
              <Link to="/" className={styles.categoryButtons}>
                Explore the world
              </Link>
            </div>
            <div className={styles.thinImageContent} style={{
              backgroundImage: `url("${home2}")`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}>
              <Link to="/" className={styles.categoryButtons}>
                Rustic and natural
              </Link>
            </div>
            <div className={styles.thinImageContent} style={{
              backgroundImage: `url("${home3}")`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}>
              <Link to="/" className={styles.categoryButtons}>Warm and cozy</Link>
            </div>
          </div>
        </section>
        <section className={styles.ctaImageContainer} style={{
          backgroundImage: `url("${home1}")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }} />
        <section className={styles.textContainer}>
          <div className={styles.blueLine} />
          <h2 className={styles.headline}>
            We strive to find the perfect fit for your next holiday
          </h2>
          <div className={styles.bodyText}>
            <p>
              Find your next holiday home, whether you're looking for new adventures, a quiet place, in the city or something completly different we always provide a safestay for you.
            </p>
            <p>
              We have locations all around the world - we will stand you on your next holiday home.
            </p>
          </div>
        </section>
        <LocationWidget />
        <section className={styles.textContainer}>
          <div className={styles.blueLine} />
          <h2 className={styles.headline}>
            Inquiries and questions - Contact us
          </h2>
          <form className={styles.form}>
            <InputTag type="email" label="Email" name="EmailTxt" />
            <TextareaTag label="Subject" name="BodyTxt" />
            <button className={styles.submitButton}><FaArrowRight className={styles.arrow} /></button>
          </form>
        </section>
        <section className={styles.ctaImageContainer} style={{
          backgroundImage: `url("${contact}")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }} />
      </main>
    );
  }
}

export default withRouter(Home)