const express = require('express')
const path = require('path')

const app = express()

const port = process.env.PORT || 6060

const publicDirectory = path.join(__dirname, '../public')

app.use(express.static(publicDirectory))

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})

