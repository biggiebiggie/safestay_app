const router = require("express").Router();
const dbCredentials = require('./../config/dbcredentials')

const { Client } = require('pg')
const client = new Client({
    user: dbCredentials.user,
    host: dbCredentials.host,
    database: dbCredentials.database,
    password: dbCredentials.password,
    port: dbCredentials.port,
})
client.connect()

//##    POST    ##
// Create property owner
router.post('/property-owners/create', (req, res) => {
    const {
        username,
        password,
        email,
        phoneNumber,
        phoneCode,
        countryCode
    } = req.body

    if (
        !username
        || !password
        || !email
        || !phoneNumber
        || !phoneCode
        || !countryCode
    ) return res.status(404).send({ status: 0, message: 'Insufficient parameters provided' })

    const query = `CALL procedureInsertPropertyOwner(
        '${username}', 
        '${password}', 
        '${email}', 
        '${phoneNumber}', 
        '${phoneCode}', 
        '${countryCode}'
    )`

    client.query(query, (err, dbRes) => {
        if (err) return res.status(500).send({ status: 0, message: 'Error' })

        return res.status(200).send({ status: 1, message: 'User created' })
    })
})

// Property owner information
router.post('/property-owners/information', (req, res) => {
    if (!req.session.userID) return res.status(404).send({ status: 0, message: 'Not logged in' })

    const query = `
        SELECT * 
        FROM tPropertyOwner 
        JOIN tPhoneCode ON tPropertyOwner."nPhoneCodeID" = tPhonecode."nPhoneCodeID" 
        JOIN tCountryCode ON tPropertyOwner."nCountryCodeID" = tCountryCode."nCountryCodeID"
        WHERE tPropertyOwner."cEmail" = '${req.session.email}'
    `

    client.query(query, (err, dbRes) => {
        if (err) {
            console.log(err)
            return res.status(500).send({ status: 0, message: 'Server error' })
        }
        if (!dbRes.rows[0]) return res.status(404).send({ status: 0, message: 'User not found' })

        const propertyQuery = `
            SELECT *
            FROM tPropertyOwner
            JOIN tProperty ON tPropertyOwner."nPropertyOwnerID" = tProperty."nPropertyOwnerID"
            JOIN tPropertyImage ON tProperty."nPropertyID" = tPropertyImage."nPropertyID"
            WHERE tPropertyOwner."nPropertyOwnerID" = '${req.session.userID}'
        `
        const result = dbRes.rows[0]

        client.query(propertyQuery, (err, dbRes) => {
            if (err) {
                console.log(err)
                return res.status(500).send({ status: 0, message: 'Server error' })
            }

            if (!dbRes.rows[0]) return res.status(200).send({
                status: 1, message: 'User found', user: {
                    username: result.cUsername,
                    email: result.cEmail,
                    phoneCode: result.cPhoneCode,
                    phoneNumber: result.cPhoneNumber,
                    countryCode: result.cCountryCode,
                    phoneNumber: result.cPhoneNumber,
                    IBAN: result.cIBANcode,
                    CVV: result.cCVV,
                    expDate: result.cExpirationDate,
                    image: result.byteaImage
                }
            })

            return res.status(200).send({
                status: 1, message: 'User found', user: {
                    username: result.cUsername,
                    email: result.cEmail,
                    phoneCode: result.cPhoneCode,
                    phoneNumber: result.cPhoneNumber,
                    countryCode: result.cCountryCode,
                    phoneNumber: result.cPhoneNumber,
                    IBAN: result.cIBANcode,
                    CVV: result.cCVV,
                    expDate: result.cExpirationDate,
                    image: result.byteaImage,
                    properties: dbRes.rows
                }
            })
        })
    })
})

//##    PATCH    ##
// Update user
router.patch('/property-owners', (req, res) => {
    if (!req.session.userID) return res.status(404).send({ status: 0, message: 'Already logged in' })

    const {
        username,
        email,
        password
    } = req.body

    if (
        !username
        || !email
    ) return res.status(404).send({ status: 0, message: 'Insufficient parameters provided' })


    const query = `
        UPDATE tPropertyOwner 
        SET "cUsername" = '${username}', "cEmail" = '${email}'
        WHERE "nPropertyOwnerID" = '${req.session.userID}'
    `
    const queryWithPassword = `
        UPDATE tPropertyOwner 
        SET "cUsername" = '${username}', "cEmail" = '${email}', "cPassword" = '${password}'
        WHERE "nPropertyOwnerID" = '${req.session.userID}'
    `

    client.query(password ? queryWithPassword : query, (err, dbRes) => {
        if (err) return res.status(500).send({ status: 0, message: 'Server error' })

        req.session.email = email
        req.session.username = username

        return res.status(200).send({ status: 1, message: 'User updated' })
    })
})

//##    DELETE  ##
router.delete('/property-owner/:id', (req, res) => {
    const propertyOwnerID = req.params

    const findProperties = `
        SELECT "nPropertyID" from tProperty WHERE "nPropertyOwnerID" = '${propertyOwnerID}'
    `

    client.query(findProperties, (err, dbRes) => {
        if (err) return res.status(500).send({ status: 0, message: 'Server error' })

        const propertyIDs = properties.rows

        if (!propertyID)

            propertyIDs.map((ID) => {
                const propertyID = ID.nPropertyID
                const queryDeleteFacilities = `DELETE FROM tFacility WHERE "nPropertyID" = '${propertyID}';`
                // DELETE IMAGES
                const queryDeleteProperty = `DELETE FROM tProperty WHERE "nPropertyID" = '${propertyID}';`

                client.query(queryDeleteFacilities, (err, dbRes) => {
                    if (err) return res.status(500).send({ status: 0, message: 'Server error' })

                    client.query(queryDeleteProperty, (err, dbRes) => {
                        if (err) return res.status(500).send({ status: 0, message: 'Server error' })

                        const queryDeletePropertyOwner = `DELETE FROM tPropertyOwner WHERE "nPropertyOwnerID" = '${propertyOwnerID}'`
                        client.query(queryDeletePropertyOwner, (err, dbRes) => {
                            if (err) return res.status(500).send({ status: 0, message: 'Server error' })

                            return res.status(200).send({ status: 1, message: propertyID + ' successfully deleted' })
                        })
                    })
                })
            })
    })
})

// Login
router.post('/property-owners/login', (req, res) => {
    if (req.session.userID) return res.status(404).send({ status: 0, message: 'Already logged in' })
    const {
        email,
        password
    } = req.body

    if (!email || !password) return res.status(404).send({ status: 0, message: 'Insufficient parameters provided' })

    const query = `
        SELECT tPropertyOwner."nPropertyOwnerID", tPropertyOwner."cUsername", tPropertyOwner."cPassword", tPropertyOwner."cEmail"
        FROM tPropertyOwner
        WHERE tPropertyOwner."cEmail" = '${email}';
    `
    client.query(query, (err, dbRes) => {
        if (err) return res.status(500).send({ status: 0, message: 'Server error' })

        if (!dbRes.rows[0]) return res.status(404).send({ status: 0, message: 'Incorrect email or password' })
        if (dbRes.rows[0].cPassword !== password) return res.status(404).send({ status: 0, message: 'Incorrect email or password' })

        const hour = 1000 * 60 * 60;
        req.session.username = dbRes.rows[0].cUsername;
        req.session.userID = dbRes.rows[0].nPropertyOwnerID;
        req.session.email = dbRes.rows[0].cEmail;
        req.session.userType = 'propertyOwner';
        req.session.cookie.maxAge = hour;

        return res.status(200).send({
            status: 1,
            message: 'Authentication successful',
            user: {
                userID: req.session.userID,
                username: req.session.username
            }
        }
        )
    })
})

module.exports = router
