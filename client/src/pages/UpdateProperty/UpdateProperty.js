import React, { Component } from "react";
import { withRouter } from 'react-router-dom';

import styles from "./UpdateProperty.module.css";
import InputTag from "../../components/forms/InputTag";

class UpdateProperty extends Component {
  state = {
    propertyID: null,
    title: '',
    description: '',
    price: '',
    familyFriendly: false,
    wifi: false,
    animals: false
  }

  componentDidMount() {
    this.getUser()
  }

  getUser = async () => {
    const url = new URL('http://placeholder.com' + this.props.location.search);
    const propertyID = url.searchParams.get('id');

    await fetch(`http://localhost:8080/property?id=${propertyID}`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          propertyID,
          title: res.results.cTitle,
          description: res.results.cDescription,
          price: res.results.nPrice,
          wifi: res.results.bEthernet,
          animals: res.results.bAnimals,
          familyFriendly: res.results.bFamilyFriendly,
          image: res.results.byteaImage
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

    await fetch('http://localhost:8080/property', options)
      .then(res => res.json())
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  render() {
    const {
      title,
      description,
      price,
      wifi,
      animals,
      familyFriendly,
      image
    } = this.state;

    return (
      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <h1 className={styles.title}>Update Property</h1>
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={this.handleSubmit}>
              <div className={styles.wrapper}>
                <div className={styles.wrapperContainer}>
                  <div className={styles.inputContainer}>
                    <div className={styles.subTitle} />
                    <InputTag type="text" value={title} label="Title" name="title" onChange={event => this.setState({ title: event.target.value })} />
                    <InputTag type="text" value={description} label="Description" name="description" onChange={event => this.setState({ description: event.target.value })} />
                    <InputTag type="number" value={price} label="Price" name="price" onChange={event => this.setState({ price: event.target.value })} />
                    <InputTag type="text" value={image} label="Image url" name="image" onChange={event => this.setState({ image: event.target.value })} />
                  </div>
                </div>

                <div className={styles.wrapperContainer}>
                  <div className={styles.inputContainer}>
                    <div className={styles.subTitle} />
                    <InputTag type="checkbox" checked={wifi} label="Wifi" name="wifi" onChange={event => this.setState({ ethernet: event.target.checked })} />
                    <InputTag type="checkbox" checked={animals} label="Animals" name="animals" onChange={event => this.setState({ animals: event.target.checked })} />
                    <InputTag type="checkbox" checked={familyFriendly} label="Family Friendly" name="family" onChange={event => this.setState({ familyFriendly: event.target.checked })} />
                    <div className={styles.submitContainer}>
                      <button className={styles.submitButton}>
                        Update property
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

export default withRouter(UpdateProperty);
