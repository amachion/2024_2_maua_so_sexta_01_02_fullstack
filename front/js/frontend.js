const protocolo = 'http://'
const baseURL = 'localhost:3000'

function exibirFilmes(filmes) {
    let tabela = document.querySelector('.filmes')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    corpoTabela.innerHTML = ""
    for (let filme of filmes) {
        let linha = corpoTabela.insertRow(0)
        let celulaTitulo = linha.insertCell(0)
        let celulaSinopse = linha.insertCell(1)
        celulaTitulo.innerHTML = filme.titulo
        celulaSinopse.innerHTML = filme.sinopse
    }
}
async function prepararPagina() {
    const filmesEndpoint = '/filmes'
    const URLcompleta = `${protocolo}${baseURL}${filmesEndpoint}`
    const filmes = (await axios.get(URLcompleta)).data
    exibirFilmes(filmes)
    const cadastrarFilmeButton = document.querySelector('#cadastrarFilmeButton')
    const loginLink = document.querySelector('#loginLink')
    const token = localStorage.getItem("token")
    if (token) {
        cadastrarFilmeButton.disabled = false
        loginLink.innerHTML = "Logout"
    }
    else {
        cadastrarFilmeButton.disabled = true
        loginLink.innerHTML = 'Login'
    }
}
async function cadastrarFilme() {
    const filmesEndpoint = '/filmes'
    const URLcompleta = `${protocolo}${baseURL}${filmesEndpoint}`
    let tituloInput = document.querySelector('#tituloInput')
    let sinopseInput = document.querySelector('#sinopseInput')
    let titulo = tituloInput.value
    let sinopse = sinopseInput.value
    tituloInput.value = ""
    sinopseInput.value = ""
    if (titulo && sinopse) {
        const filmes = (await axios.post(URLcompleta, {titulo, sinopse})).data
        exibirFilmes(filmes)
        exibeAlerta('.alert-filme', "Filme cadastrado com sucesso", ['show', 'alert-success'], ['d-none'], 2000)
    }
    else {
        exibeAlerta('.alert-filme', "Preencha todos os campos", ['show', 'alert-danger'], ['d-none'], 2000)
    }
}
async function cadastrarUsuario () {
    let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput')
    let passwordCadastroInput = document.querySelector('#passwordCadastroInput')
    let usuarioCadastro = usuarioCadastroInput.value
    let passwordCadastro = passwordCadastroInput.value
    if (usuarioCadastro && passwordCadastro) {
        try {
            let cadastrarUsuarioEndpoint = '/signup'
            let URLcompleta = `${protocolo}${baseURL}${cadastrarUsuarioEndpoint}`
            await axios.post(URLcompleta, 
                            {login: usuarioCadastro, password: passwordCadastro})
            usuarioCadastroInput.value = ""
            passwordCadastroInput.value = ""   
            exibeAlerta('.alert-modal-cadastro', "Usuário cadastrado com sucesso", ['show', 'alert-success'], ['d-none'],
                2000
            )
            escondeModal('#modalCadastro', 2000)            
        }
        catch (e) {
            usuarioCadastroInput.value = ""
            passwordCadastroInput.value = ""
            exibeAlerta('.alert-modal-cadastro', "Não foi possível cadastrar usuário", ['show', 'alert-danger'], ['d-none'],
                2000
            )
            escondeModal('#modalCadastro', 2000)
        }
    }
    else {
        exibeAlerta('.alert-modal-cadastro', "Digite todos os campos", ['show', 'alert-danger'], ['d-none'],
            2000
        )
    }
}

function exibeAlerta(seletor, innerHTML, classesToAdd, classesToRemove, timeout) {
    let alert = document.querySelector(seletor)
    alert.innerHTML = innerHTML
    alert.classList.add(...classesToAdd)
    alert.classList.remove(...classesToRemove)
    setTimeout(() => {
        alert.classList.remove(...classesToAdd)
        alert.classList.add(...classesToRemove)
    }, timeout)
}
function escondeModal (seletor, timeout) {
    setTimeout (() => {
        let modal = bootstrap.Modal.getInstance(seletor)
        modal.hide()
    }, timeout)
}
const fazerLogin = async () => {
    let usuarioLoginInput = document.querySelector('#usuarioLoginInput')
    let passwordLoginInput = document.querySelector('#passwordLoginInput')
    let usuarioLogin = usuarioLoginInput.value
    let passwordLogin = passwordLoginInput.value
    if (usuarioLogin && passwordLogin) {
        try {
            const loginEndpoint = '/login'
            const URLcompleta = `${protocolo}${baseURL}${loginEndpoint}`
            const response = await axios.post (
                URLcompleta,
                {login: usuarioLogin, password: passwordLogin}
            )
            //console.log (response.data)
            localStorage.setItem("token", response.data)
            usuarioLoginInput.value = ""
            passwordLoginInput.value = ""
            exibeAlerta('.alert-modal-login', "Usuário logado com sucesso!!!", ['show', 'alert-success'],
                        ['d-none'], 2000)
            escondeModal('#modalLogin', 2000)
            const cadastrarFilmeButton = document.querySelector('#cadastrarFilmeButton')
            cadastrarFilmeButton.disabled = false
            const loginLink = document.querySelector('#loginLink')
            loginLink.innerHTML = "Logout"
        }
        catch (e) {
            exibeAlerta('.alert-modal-login', "Falha na autenticação", ['show', 'alert-danger'],
                        ['d-none'], 2000
            )
        }
    }
    else {
        exibeAlerta('.alert-modal-login', 'Preencha todos os campos',['show', 'alert-danger'],
                    ['d-none'], 2000
        )
    }
}