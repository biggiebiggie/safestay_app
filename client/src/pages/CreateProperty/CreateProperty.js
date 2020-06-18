import React, { Component } from "react";

import styles from "./CreateProperty.module.css";
import InputTag from "../../components/forms/InputTag";

export default class CreateProperty extends Component {
  state = {
    propertyType: '',
    title: '',
    description: '',
    zipCode: '',
    cityName: '',
    familyFriendly: false,
    houseSize: '',
    address: '',
    size: '',
    price: '',
    image: '',
    ethernet: false,
    animals: false
  }

  handleSubmit = async event => {
    event.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state),
      credentials: 'include'
    };

    await fetch('http://localhost:8080/properties/create', options)
      .then(res => res.json())
      .then(res => {
        window.scrollTo(0, 0);
        this.props.history.push('/profile')
      })
      .catch(err => console.log(err))
  }

  render() {
    const {
      title,
      description,
      propertyType,
      zipCode,
      cityName,
      address,
      size,
      price,
      image
    } = this.state;

    return (
      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <h1 className={styles.title}>Create Property</h1>
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={this.handleSubmit}>
              <div className={styles.wrapper}>
                <div className={styles.wrapperContainer}>
                  <div className={styles.inputContainer}>
                    <div className={styles.subTitle} />
                    <InputTag type="text" value={title} label="Title" name="title" onChange={event => this.setState({ title: event.target.value })} />
                    <InputTag type="text" value={description} label="Description" name="description" onChange={event => this.setState({ description: event.target.value })} />
                    <InputTag type="text" value={propertyType} label="Type" name="type" onChange={event => this.setState({ propertyType: event.target.value })} />
                    <InputTag type="text" value={zipCode} label="Zipcode" name="zipcode" onChange={event => this.setState({ zipCode: event.target.value })} />
                    <InputTag type="text" value={cityName} label="City" name="city" onChange={event => this.setState({ cityName: event.target.value })} />
                    <InputTag type="text" value={address} label="Address" name="address" onChange={event => this.setState({ address: event.target.value })} />
                    <InputTag type="number" value={size} label="Property size" name="size" onChange={event => this.setState({ size: event.target.value })} />
                    <InputTag type="number" value={price} label="Price" name="price" onChange={event => this.setState({ price: event.target.value })} />
                    <InputTag type="text" value={image} label="Image url" name="image" onChange={event => this.setState({ image: event.target.value })} />
                  </div>
                </div>

                <div className={styles.wrapperContainer}>
                  <div className={styles.inputContainer}>
                    <div className={styles.subTitle} />
                    <InputTag type="checkbox" label="Wifi" name="wifi" onChange={event => this.setState({ ethernet: event.target.checked })} />
                    <InputTag type="checkbox" label="Animals" name="animals" onChange={event => this.setState({ animals: event.target.checked })} />
                    <InputTag
                      type="checkbox"
                      label="Family Friendly"
                      name="family"
                      onChange={event => this.setState({ familyFriendly: event.target.checked })}
                    />
                    <div className={styles.submitContainer}>
                      <button className={styles.submitButton}>
                        Create property
                      </button>
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
