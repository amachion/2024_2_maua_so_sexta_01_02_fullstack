const express = require('express')
const app = express() //construindo uma aplicação express
app.use(express.json())

//get url: http://localhost:3000/oi
app.get ('/oi', (req, res) => {
    res.send('oi')
})

app.listen(3000, () => console.log("server up & running"))