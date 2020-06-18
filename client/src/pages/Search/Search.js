import React, { Component } from 'react'

// Components
import PropertyCard from './../../components/Property/PropertyCard'

// Styles
import styles from './Search.module.css'

export default class Search extends Component {
    state = {
        isLoading: true,
        data: ""
    }

    async componentDidMount() {
        const { checkIn, checkOut, destination } = this.props.searchQueries;
        if (!checkIn || !checkOut || !destination) return
        await fetch(`http://localhost:8080/properties?startDate=${checkIn}&endDate=${checkOut}&city=${destination}`)
            .then(res => res.json())
            .then(res => {console.log(res);this.setState({ data: res, isLoading: false })})
            .catch(error => console.log(error))
    }


    render() {
        const { isLoading, data } = this.state;

        return (
            <main className={styles.searchContainer}>
                <h1 className={styles.headline}>Our available properties in Copenhagen:</h1>
                <section className={styles.propertiesContainer}>
                    {isLoading
                        ? <div>Loading</div>
                        : data.results.map((property, key) => {
                            return (
                                <PropertyCard key={key} data={property} searchQueries={this.props.searchQueries} />
                            )
                        })
                    }
                </section>
                <button className={styles.loadMoreButton}>Load more...</button>
            </main>
        )
    }
}