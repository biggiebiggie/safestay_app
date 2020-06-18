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

client.connect();

//##    GET     ##

// Show single property
router.get('/property', async (req, res) => {
    const { id } = req.query;

    query = `
        SELECT *
        FROM tProperty
        JOIN tFacility
        ON tProperty."nPropertyID" = tFacility."nPropertyID"
        JOIN tPropertyImage
        ON tProperty."nPropertyID" = tPropertyImage."nPropertyID"
        JOIN tPropertyType
        ON tProperty."nTypeID" = tPropertyType."nTypeID"
        WHERE tProperty."nPropertyID" = '${id}'
    `
    await client.query(query, (err, dbRes) => {
        if (err) return res.status(500).send({ status: 0, message: 'Server error' })

        return res.status(200).send({ status: 1, message: 'Property found', results: dbRes.rows[0] })
    })
})

// Rent property
router.post('/property/rent', (req, res) => {
    if (!req.session.userID) return res.status(404).send({ status: 0, message: 'Not logged in' })

    const {
        propertyID,
        startDate,
        endDate,
        userType
    } = req.body

    if (
        !propertyID
        || !startDate
        || !endDate
        || !userType
    ) return res.status(404).send({ status: 0, message: 'Insuffient parameters provided' })

    if (userType !== 'user') return res.status(404).send({ status: 0, message: 'Insuffient parameters provided' })

    const queryFindPrice = `
        SELECT tProperty."nPrice" FROM tProperty
        WHERE tProperty."nPropertyID" = '${propertyID}'
    `

    client.query(queryFindPrice, (err, dbRes) => {
        console.log(err)
        if (err) return res.status(500).send({ status: 0, message: 'Server error' })

        const rentCost = dbRes.rows[0].nPrice

        const queryProcedure = `
        CALL procedurecreaterentdeal(
            '${req.session.userID}', 
            '${propertyID}', 
            '${startDate}', 
            '${endDate}', 
            '${rentCost}'
            )
        `

        client.query(queryProcedure, (err, dbRes) => {
            console.log(err)
            if (err) return res.status(500).send({ status: 0, message: 'Server error' })

            console.log(dbRes)
            return res.status(200).send({ status: 0, message: 'Property rented successfully' })
        })
    })
})


//##    POST    ##
// Create property
router.post('/properties/create', (req, res) => {
    if (!req.session.userID) return res.status(404).send({ status: 0, message: 'Not logged in' })

    const {
        title,
        description,
        propertyType,
        zipCode,
        cityName,
        familyFriendly = false,
        address,
        size,
        price,
        image,
        ethernet = false,
        animals = false
    } = req.body

    const houseSize = 9;

    if (
        !propertyType
        || !zipCode
        || !cityName
        || !address
        || !size
        || !price
        || !image
        || ethernet === undefined
        || animals === undefined
        || familyFriendly === undefined
    ) return res.status(404).send({ status: 0, message: 'Insufficient parameters provided' })

    const query = `CALL procedurecreateproperty(
        '${req.session.userID}',
        '${title}',
        '${description}',
        '${propertyType}',
        '${zipCode}',
        '${cityName}',
        '${address}',
        '${size}',
        '${houseSize}',
        '${price}',
        '${ethernet}',
        '${animals}',
        '${familyFriendly}',
        '${image}'
    );`

    client.query(query, (err, dbRes) => {
        if (err) return res.status(500).send({ status: 0, message: 'Error' })

        return res.status(200).send({ status: 1, message: 'Property created' })
    })
})

// Search properties
router.get('/properties', async (req, res) => {
    const {
        startDate,
        endDate,
        city
    } = req.query
    if (!startDate || !endDate || !city) return res.status(404).send({ status: 0, message: 'Insufficient parameters provided' })

    query = `
        SELECT tProperty."nPrice", tProperty."nPropertyID", tCity."cCityName", tPropertyImage."byteaImage"
        FROM tRented
        RIGHT JOIN tProperty    
        ON tRented."nPropertyID" = tProperty."nPropertyID"
        RIGHT JOIN tPropertyImage
        ON tProperty."nPropertyID" = tPropertyImage."nPropertyID"
        RIGHT JOIN tCity
        ON tCity."nCityID" = tProperty."nCityID"
        WHERE tCity."cCityName" = '${city}'
        AND (('${endDate}' < tRented."dStart" OR '${startDate}' > tRented."dEnd") OR ( tRented."dStart" IS NULL OR tRented."dEnd" IS NULL))
        
        ORDER BY tProperty."nPropertyID" DESC
    `

    client.query(query, (err, dbRes) => {
        if (err) return res.status(500).send({ status: 0, message: 'Server error' })

        return res.status(200).send({ status: 1, message: 'Properties found', results: dbRes.rows })
    })
})

// Get property

//##    PATCH   ##
// Update property
router.patch('/property', (req, res) => {
    if (!req.session.userID) return res.status(404).send({ status: 0, message: 'Not logged in' })

    const {
        propertyID,
        title,
        description,
        price,
        familyFriendly,
        wifi,
        animals
    } = req.body

    if (
        !propertyID
        || !title
        || !description
        || price === undefined
        || familyFriendly === undefined
        || wifi === undefined
        || animals === undefined
    ) return res.status(404).send({ status: 0, message: 'Insufficient parameters provided' })

    const updateProperty = `
        UPDATE tProperty
        SET "nPrice" = '${price}', "cTitle" = '${title}', "cDescription" = '${description}'
        WHERE "nPropertyID" = '${propertyID}';
    `

    const updateFacilities = `
        UPDATE tFacility
        SET "bEthernet" = '${wifi}', "bAnimals" = '${animals}', "bFamilyFriendly" = '${familyFriendly}'
        WHERE "nPropertyID" = '${propertyID}';
    `

    client.query(updateProperty, (err, dbRes) => {
        if (err) return res.status(500).send({ status: 0, message: 'Server error' })

        client.query(updateFacilities, (err, dbRes) => {
            if (err) return res.status(500).send({ status: 0, message: 'Server error' })
            return res.status(200).send({ status: 1, message: 'Success' })
        })
    })
})

//##    DELETE  ##
// Delete property
router.delete('/property/:id', (req, res) => {
    if (!req.session.userID) return res.status(404).send({ status: 0, message: 'Not logged in' })

    const propertyID = req.params.id;

    if (!propertyID) return res.status(404).send({ status: 0, message: 'No property ID given' })

    const deleteFacilities = `DELETE FROM tFacility WHERE "nPropertyID" = '${propertyID}';`
    const deleteImages = `DELETE FROM tPropertyImage WHERE "nPropertyID" = '${propertyID}';`
    const deleteProperty = `DELETE FROM tProperty WHERE "nPropertyID" = '${propertyID}';`

    client.query(deleteImages, (err, dbRes) => {
        if (err) return res.status(500).send({ status: 0, message: 'Server error' })

        client.query(deleteFacilities, (err, dbRes) => {
            if (err) return res.status(500).send({ status: 0, message: 'Server error' })

            client.query(deleteProperty, (err, dbRes) => {
                if (err) return res.status(500).send({ status: 0, message: 'Server error' })

                res.status(200).send({ status: 1, message: 'Property deleted' })
            })
        })
    })
})

module.exports = router
