const swaggerUI = require('swagger-ui-express')
const swaggerDoc = require('./swagger')

const express = require('express')

const bodyParser = require('body-parser')
const _ = require('lodash')

const appIns = require('applicationinsights')

appIns.setup()
.setSendLiveMetrics(true)
.start()

const app = express()
app.use(bodyParser.json())

app.get('/event', function (req, res) {
    const telemetry = appIns.defaultClient
    telemetry.trackEvent({
        name: 'Some Event',
        properties: {
            orders: 100,
            signedUsers: 'All'
        }
    })
    res.sendStatus(200)
})

app.get('/metric', function (req, res) {

    const telemetry = appIns.defaultClient
    telemetry.trackMetric({
        name: 'Count',
        value: 100
    })
    res.sendStatus(200)
})

app.get('/fail', function (req, res) {

    const telemetry = appIns.defaultClient
    telemetry.trackException({
        exception: new Error('Bir hata oluştu!')
    })
    res.sendStatus(404)
})

app.get('/users', function (req, res) {

    const users = [{
        firstName: "Kazım",
        lastName: "Etiksan",
        age: 39
    },{
        firstName: "Leyla",
        lastName: "Demir",
        age: 32
    },{
        firstName: "Kaan",
        lastName: "Ertekin",
        age: 42
    }]
    res.send(users)
})

app.get('/contact', function (req, res) {
    const contact = {
        phone: "05324871200",
        address: "İstanbul",
        name: req.query.city
    }
    res.send(contact)
})

app.get('/api-def', function (req, res) {

    res.send(swaggerDoc)
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

app.listen(8080, () => {
    console.log('app server is running')
})