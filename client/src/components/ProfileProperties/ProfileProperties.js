import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Component
import PropertyCard from './../Property/PropertyCard';

// Styles
import styles from './ProfileProperties.module.css';

export default class ProfileProperties extends Component {

    deleteProperty = async propertyID => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }
        await fetch(`http://localhost:8080/property/${propertyID}`, options)
            .then(res => res.json())
            .then(res => this.props.updateProperties())
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div>
                <h2 className={styles.headline}>Properties</h2>
                <Link className={styles.createButton} to="/create-property">Create property</Link>
                <div className={styles.propertiesContainer}>
                    {this.props.properties && this.props.properties.map((property, index) => (
                        <div key={index}>
                            <PropertyCard data={
                                property
                            } />
                            <Link to={`/update-property?id=${property.nPropertyID}`} className={styles.updateButton}>Update property</Link>
                            <button className={styles.deleteButton} onClick={() => this.deleteProperty(property.nPropertyID)}>Delete property</button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}