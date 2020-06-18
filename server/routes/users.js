const router = require("express").Router()

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

//##    GET     ##

// Log out
router.post('/users/logout', (req, res) => {
    req.session.destroy();

    return res.status(200).send({ status: 1, message: 'Logged out' })
})

//##    POST    ##
// User session
router.post('/users/session', (req, res) => {
    if (!req.session.userID) return res.status(200).send({ status: 0, message: 'Not logged in' })

    return res.status(200).send(
        {
            status: 1,
            message: 'Logged in',
            user: {
                userID: req.session.userID,
                username: req.session.username,
                email: req.session.email,
                userType: req.session.userType
            }
        }
    )
})

router.delete('/users', async (req, res) => {
    const { id, userType } = req.body;

    if (userType === "user") {
        const findCreditcardID = `
        SELECT "nCreditcardID"
        FROM tCreditcard
        WHERE "nUserID" = '${id}'
    `
        try {

            const creditcardResult = await client.query(findCreditcardID)
            console.log(creditcardResult)
            if(creditcardResult.rowCount !== 0) {
                const creditcardID = creditcardResult.rows[0].nCreditcardID

                const queryDeletePayments = `DELETE FROM tPayment WHERE "nCreditcardID" = '${creditcardID}';`
                const queryDeleteCreditcard = `DELETE FROM tCreditcard WHERE "nUserID" = '${id}';`
                
                const deletePayments = await client.query(queryDeletePayments)
                const deleteCreditcard = await client.query(queryDeleteCreditcard)
            }
            const queryDeleteRents = `DELETE FROM tRented WHERE "nUserID" = '${id}';`
            const deleteRents = await client.query(queryDeleteRents)

            const queryDeleteUser = `DELETE FROM tUser WHERE "nUserID" = '${id}';`
            const deleteUser = await client.query(queryDeleteUser)
            console.log("success")

            return res.status(200).send({ status: 1, message: id + ' successfully deleted' })
        } catch (err) {
            console.log(err)

        }

    } else {
        console.log("property owner")
        console.log(id, userType)
        const findProperties = `
        SELECT * from tProperty WHERE "nPropertyOwnerID" = '${id}'
        `
        client.query(findProperties, (err, dbRes) => {
            if (err) return res.status(500).send({ status: 0, message: 'Server error' })
            console.log(dbRes.rows)

            const propertyIDs = dbRes.rows
            if (!propertyIDs[0]) {
                const queryDeletePropertyOwner = `DELETE FROM tPropertyOwner WHERE "nPropertyOwnerID" = '${id}'`
                client.query(queryDeletePropertyOwner, (err, dbRes) => {
                    console.log(err)

                    if (err) return res.status(500).send({ status: 0, message: 'Server error' })
                    console.log("ALL GONE")

                    return res.status(200).send({ status: 1, message: id + ' successfully deleted' })
                })
            }

            propertyIDs.map((ID) => {
                const propertyID = ID.nPropertyID
                console.log(propertyID)
                const queryDeleteFacilities = `DELETE FROM tFacility WHERE "nPropertyID" = '${propertyID}';`
                const queryDeleteImages = `DELETE FROM tPropertyImage WHERE "nPropertyID" = '${propertyID}';`
                const queryDeleteProperty = `DELETE FROM tProperty WHERE "nPropertyID" = '${propertyID}';`

                client.query(queryDeleteFacilities, (err, dbRes) => {
                    console.log(err)
                    if (err) return res.status(500).send({ status: 0, message: 'Server error' })
                    console.log("FACILITES GONE")

                    client.query(queryDeleteImages, (err, dbRes) => {
                        console.log(err)
                        if (err) return res.status(500).send({ status: 0, message: 'Server error' })
                        if (!dbRes) {
                            console.log('No pics')
                        }

                        client.query(queryDeleteProperty, (err, dbRes) => {
                            console.log(err)

                            if (err) return res.status(500).send({ status: 0, message: 'Server error' })
                            console.log("PROPERTIES GONE")

                            const queryDeletePropertyOwner = `DELETE FROM tPropertyOwner WHERE "nPropertyOwnerID" = '${propertyID}'`
                            client.query(queryDeletePropertyOwner, (err, dbRes) => {
                                console.log(err)

                                if (err) return res.status(500).send({ status: 0, message: 'Server error' })
                                console.log("ALL GONE")

                                return res.status(200).send({ status: 1, message: id + ' successfully deleted' })
                            })
                        })
                    })
                })
            })
        })
    }
})

// User information
router.post('/users/information', (req, res) => {
    if (!req.session.userID) return res.status(404).send({ status: 0, message: 'Not logged in' })

    const query = `
        SELECT * 
        FROM tUser 
        JOIN tcreditcard ON tUser."nUserID" = tCreditcard."nUserID"
        JOIN tPhoneCode ON tUser."nPhoneCodeID" = tPhonecode."nPhoneCodeID" 
        JOIN tCountryCode ON tUser."nCountryCodeID" = tCountryCode."nCountryCodeID" 
        WHERE tUser."cEmail" = '${req.session.email}'
    `

    client.query(query, (err, dbRes) => {

        if (err) return res.status(500).send({ status: 0, message: 'Server error' })
        if (!dbRes.rows[0]) return res.status(404).send({ status: 0, message: 'User not found' })

        const result = dbRes.rows[0]

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
                expDate: result.cExpirationDate
            }
        })
    })
})

// Create user
router.post('/users/create', (req, res) => {
    if (!req.query) return res.status(404).send({ status: 0, message: 'No parameters provided' })

    const {
        username,
        password,
        email,
        phoneNumber,
        phoneCode,
        countryCode,
        IBAN,
        CVV,
        expirationDate
    } = req.body

    if (
        !username
        || !password
        || !email
        || !phoneNumber
        || !phoneCode
        || !countryCode
        || !IBAN
        || !CVV
        || !expirationDate
    ) return res.status(404).send({ status: 0, message: 'Insufficient parameters provided' })

    if (CVV.length !== 3) return res.status(404).send({ status: 0, message: 'CVV must be exactly 3 characters' })
    if (expirationDate.length !== 4) return res.status(404).send({ status: 0, message: 'Exp date must be exactly 4 characters' })

    const query = `CALL procedurecreateuser(
        '${username}',
        '${password}',
        '${email}',
        '${phoneNumber}',
        '${phoneCode}',
        '${countryCode}',
        '${IBAN}',
        '${CVV}',
        '${expirationDate}'
    );`

    client.query(query, (err, dbRes) => {
        if (err) return res.status(500).send({ status: 0, message: 'Server error' })

        return res.status(200).send({ status: 1, message: 'User created' })
    })
})

// Login
router.post('/users/login', (req, res) => {
    if (req.session.userID) return res.status(404).send({ status: 0, message: 'Already logged in' })

    const {
        email,
        password
    } = req.body

    if (!email || !password) return res.status(404).send({ status: 0, message: 'Insufficient parameters provided' })

    const query = `
        SELECT tUser."nUserID", tUser."cUsername", tUser."cPassword", tUser."cEmail"
        FROM tUser
        WHERE tUser."cEmail" = '${email}';
    `

    client.query(query, (err, dbRes) => {
        if (err) return res.status(500).send({ status: 0, message: 'Server error' })

        if (!dbRes.rows[0]) return res.status(404).send({ status: 0, message: 'Incorrect email or password' })
        if (dbRes.rows[0].cPassword !== password) return res.status(404).send({ status: 0, message: 'Incorrect email or password' })

        const hour = 1000 * 60 * 60;
        req.session.username = dbRes.rows[0].cUsername;
        req.session.userID = dbRes.rows[0].nUserID;
        req.session.email = dbRes.rows[0].cEmail;
        req.session.userType = 'user';
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

//##    PATCH   ##
// Update credit card
router.patch('/users/credit-card', (req,res) => {
    if (!req.session.userID) return res.status(404).send({ status: 0, message: 'Already logged in' })

    const {
        CVV,
        IBAN,
        expDate
    } = req.body

    const updateUserAndCreditcard = `
        UPDATE tCreditcard 
        SET 
        "cCVV" = '${CVV}', 
        "cIBANcode" = '${IBAN}' , 
        "cExpirationDate" = '${expDate}'
        WHERE "nUserID" = '${req.session.userID}'
    `

    client.query(updateUserAndCreditcard, (err, dbRes) => {
        if (err) return res.status(500).send({ status: 0, message: 'Server error' })

        return res.status(200).send({status: 1, message: 'Successful update'})
    })
})


// Update user
router.patch('/users', (req, res) => {
    if(!req.session.userID) return res.status(404).send({ status: 0, message: 'Already logged in' })

    const {
        username,
        email,
        password
    } = req.body

    if(
        !username
        || !email
    ) return res.status(404).send({ status: 0, message: 'Insufficient parameters provided' })

    const query =`
        UPDATE tUser 
        SET "cUsername" = '${username}', "cEmail" = '${email}'
        WHERE "nUserID" = '${req.session.userID}'
    `
    const queryWithPassword =`
        UPDATE tUser 
        SET "cUsername" = '${username}', "cEmail" = '${email}', "cPassword" = '${password}'
        WHERE "nUserID" = '${req.session.userID}'
    `

    client.query(password ? queryWithPassword : query, (err, dbRes) => {
        if (err) return res.status(500).send({ status: 0, message: 'Server error' })

        req.session.email = email
        req.session.username = username

        return res.status(200).send({status: 1, message: 'User updated'})
    })
})

module.exports = router
