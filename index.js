//mongodb+srv://pro_mac:mongo123@cluster0.skf8n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require('express')
const cors = require('cors')

const app = express() //construindo uma aplicação express
app.use(express.json())
app.use(cors())

let filmes = [
    {
        titulo: "Dirty Dancing",
        sinopse: "Na esperança de curtir sua juventude, Frances fica decepcionada ao descobrir que vai passar o verão de 1963 com os pais em um resort na sonolenta região de Catskills. A sua sorte muda quando ela conhece o instrutor de dança do resort, Johnny. Quando ele a coloca como sua nova parceira de dança, os dois acabam se apaixonando."
    },
    {
        titulo: "Star Wars: Episódio III – A Vingança dos Sith",
        sinopse: "As Guerras Clônicas estão em pleno andamento e Anakin Skywalker mantém um elo de lealdade com Palpatine, ao mesmo tempo em que luta para que seu casamento com Padmé Amidala não seja afetado por esta situação. Seduzido por promessas de poder, Anakin se aproxima cada vez mais de Darth Sidious até se tornar o temível Darth Vader. Juntos eles tramam um plano para aniquilar de uma vez por todas com os cavaleiros jedi."
    }
]


//get url: http://localhost:3000/oi
app.get ('/oi', (req, res) => {
    res.send('oi')
})

app.get ('/filmes', (req, res) => {
    res.json(filmes)
})

app.post ('/filmes', (req, res) => {
    //obter os dados que o cliente enviou
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    //montar o json filme
    const filme = {titulo: titulo, sinopse: sinopse}
    //inserir o filme na lista de filmes
    filmes.push(filme)
    res.json(filmes)
})
app.listen(3000, () => console.log("server up & running"))