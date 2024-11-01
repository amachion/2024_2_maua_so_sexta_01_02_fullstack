const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express() //construindo uma aplicação express
app.use(express.json())
app.use(cors())

const Filme = mongoose.model ("Filme", mongoose.Schema({
    titulo: {type: String},
    sinopse: {type: String}
}))

const usuarioSchema = mongoose.Schema( {
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model ("Usuario", usuarioSchema)

async function conectarAoMongo() {
    await mongoose.connect(`mongodb+srv://pro_mac:mongo123@cluster0.skf8n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
}

app.get ('/filmes', async (req, res) => {
    const filmes = await Filme.find()
    res.json(filmes)
})

app.post ('/filmes', async(req, res) => {
    //obter os dados que o cliente enviou
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    //construir um objeto filme de acordo com a classe Filme definida
    const filme = new Filme({titulo: titulo, sinopse: sinopse})
    //salva o filme criado
    await filme.save()
    //busca pela lista de filmes atualizada
    const filmes = await Filme.find()
    res.json(filmes)
})
app.post('/signup', async (req, res) => {
    try {
        const login = req.body.login
        const password = req.body.password
        const password_criptografada = await bcrypt.hash(password, 10)
        const usuario = new Usuario ({login: login, password: password_criptografada})
        const respMongo = await usuario.save()
        console.log(respMongo)
        res.status(201).end()
    }
    catch (e) {
        console.log(e)
        res.status(409).end()
    }
})

app.post ('/login', async (req, res) => {
    const login = req.body.login
    const password = req.body.password

    const usuarioExiste = await Usuario.findOne({login: login})
    if (!usuarioExiste) {
        return res.status(401).json({mensagem: "login inválido"})
    }
    const senhaValida = await bcrypt.compare(password, usuarioExiste.password)

    if (!senhaValida) {
        return res.status(401).json({mensagem: "senha inválida"})
    }
    
    const token = jwt.sign (
        {login: login},
        "id-secreto",
        {expiresIn: "1h"}
    )
    res.status(200).json({token: token})
})


app.listen(3000, () => {
    try {
        conectarAoMongo()
        console.log("server up & running and conexão ok")
    }
    catch (e) {
        console.log('erro de conexão', e)
    }
})