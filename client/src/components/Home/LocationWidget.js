import React, { Component } from 'react'
import {
    Link
} from 'react-router-dom'

import { FaArrowRight } from 'react-icons/fa'

// Styles
import styles from './LocationWidget.module.css'

export default class LocationWidget extends Component {
    render() {
        return (
            <section className={styles.container}>
                <div className={styles.left}>
                    <p className={styles.label}>Check out available properties in</p>
                    <h2 className={styles.header}>Copenhagen</h2>
                    <button className={styles.button}><FaArrowRight className={styles.arrow} /></button>
                    <Link to="/search" className={styles.link}>Search for other cities…</Link>
                </div>
                <div className={styles.right}>
                    <p className={styles.label}>Temp feels like 32°C</p>
                    <p className={styles.header}>Clear sky</p>
                </div>
                <div className={styles.temperatureContainer}>
                    <div className={styles.temperature}>30°C</div>
                </div>
            </section>
        )
    }
}