const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const sectionReiniciar = document.getElementById('reiniciar')
const botonMascotaJugador = document.getElementById('boton-mascota')
const botonReiniciar = document.getElementById('boton-reiniciar')
sectionReiniciar.style.display = 'none'

const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')
const spanMascotaJugador = document.getElementById('mascota-jugador')
const spanMascotaEnemigo = document.getElementById('mascota-enemigo')
const spanVidasJugador = document.getElementById('vidas-jugador')
const spanVidasEnemigo = document.getElementById('vidas-enemigo')
const sectionMensajes = document.getElementById('resultado')
const ataquesDelJugador = document.getElementById('ataques-del-jugador')
const ataquesDelEnemigo = document.getElementById('ataques-del-enemigo')
const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById('contenedorAtaques')
const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')

let jugadorId = null
let enemigoId = null
let mokepones = []
let mokeponesEnemigos = []
let ataqueJugador =[]
let ataqueEnemigo = []
let opcionDeMokepones
let inputOtto
let inputBruno
let inputRochita
let mascotaJugador
let mascotaJugadorObjeto
let ataquesMokepon
let ataquesMokeponEnemigo
let botonFuego
let botonAgua
let botonPlanta
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0 
let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
let pintarMokepon
mapaBackground.src = './img/mapamokepon.png'
let alturaQuebuscamos
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa=350

if(anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQuebuscamos = anchoDelMapa * 600 / 800
mapa.width = anchoDelMapa
mapa.height = alturaQuebuscamos

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, id = null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 60
        this.alto = 60
        this.x = aleatorio(0, mapa.width - this.ancho)  // Usa la función aleatorio aquí
        this.y = aleatorio(0, mapa.height - this.alto)  // Usa la función aleatorio aquí
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    }

    pintarMokepon() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto  
        )
    }
}

let Otto = new Mokepon('Otto', './img/Otto.png', 5, './img/Otto.png')
let Bruno = new Mokepon('Bruno', './img/Bruno.png', 5, './img/Bruno.png')
let Rochita = new Mokepon('Rochita', './img/Rocha.png', 5, './img/Rocha.png')

const Otto_ATAQUES = [
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '🔥', id: 'boton-fuego' },
    { nombre: '🌱', id: 'boton-tierra' },
]

Otto.ataques.push(...Otto_ATAQUES)

const Bruno_ATAQUES = [
    { nombre: '🌱', id: 'boton-tierra' },
    { nombre: '🌱', id: 'boton-tierra' },
    { nombre: '🌱', id: 'boton-tierra' },
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '🔥', id: 'boton-fuego' },
]

Bruno.ataques.push(...Bruno_ATAQUES)

const Rochita_ATAQUES = [
    { nombre: '🔥', id: 'boton-fuego' },
    { nombre: '🔥', id: 'boton-fuego' },
    { nombre: '🔥', id: 'boton-fuego' }, 
    { nombre: '💧', id: 'boton-agua' },
    { nombre: '🌱', id: 'boton-tierra' },
]

Rochita.ataques.push(...Rochita_ATAQUES)

mokepones.push(Otto, Bruno, Rochita)

function iniciarJuego() {
    sectionSeleccionarAtaque.style.display = 'none'
    sectionVerMapa.style.display = 'none'

    mokepones.forEach((mokepon) => {
        opcionDeMokepones = `
        <input type="radio" name="mascota" id=${mokepon.nombre} />
        <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>
            <p>${mokepon.nombre}</p>
            <img src=${mokepon.foto} alt=${mokepon.nombre}>
        </label>
        `
        contenedorTarjetas.innerHTML += opcionDeMokepones

        inputOtto = document.getElementById('Otto')
        inputBruno = document.getElementById('Bruno')
        inputRochita = document.getElementById('Rochita')
    })

    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
    botonReiniciar.addEventListener('click', reiniciarJuego)
    unirseAlJuego()
}
function unirseAlJuego() {
    fetch("http://127.0.0.1:5500/unirse")
    .then(function (res) {
        if (res.ok) {
            res.text()
            .then(function (respuesta) {
                console.log(respuesta)
                jugadorId = respuesta
            })
        }
    })
}
function seleccionarMascotaJugador() {
    if (inputOtto.checked) {
        spanMascotaJugador.innerHTML = inputOtto.id
        mascotaJugador = inputOtto.id
    } else if (inputBruno.checked) {
        spanMascotaJugador.innerHTML = inputBruno.id
        mascotaJugador = inputBruno.id
    } else if (inputRochita.checked) {
        spanMascotaJugador.innerHTML = inputRochita.id
        mascotaJugador = inputRochita.id
    } else {
        alert('Selecciona una mascota')
        return
    }

    sectionSeleccionarMascota.style.display = 'none'
    seleccionarMokepon(mascotaJugador)
    extraerAtaques(mascotaJugador)
    sectionVerMapa.style.display = 'flex'
    iniciarMapa()
}

fetch(`http://127.0.0.1:5500/public/mokepon/${jugadorId}/ataques`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ ataques: ataqueJugador })
})

function reiniciarJuego() {
    location.reload()
}

function iniciarMapa() {
    pintarMokepon = setInterval(pintarCanvas, 50)
    window.addEventListener('keydown', moverMokepon)
    window.addEventListener('keyup', detenerMovimiento)
}

function pintarCanvas() {
    mascotaJugadorObjeto.x += mascotaJugadorObjeto.velocidadX
    mascotaJugadorObjeto.y += mascotaJugadorObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(mapaBackground, 0, 0, mapa.width, mapa.height)
    mascotaJugadorObjeto.pintarMokepon()
    mokeponesEnemigos.forEach((mokepon) => {
        mokepon.pintarMokepon()
        revisarColision(mokepon)
    })
}

function moverMokepon(event) {
    switch (event.key) {
        case 'ArrowUp':
            mascotaJugadorObjeto.velocidadY = -5
            break
        case 'ArrowDown':
            mascotaJugadorObjeto.velocidadY = 5
            break
        case 'ArrowLeft':
            mascotaJugadorObjeto.velocidadX = -5
            break
        case 'ArrowRight':
            mascotaJugadorObjeto.velocidadX = 5
            break
    }
}

function detenerMovimiento(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            mascotaJugadorObjeto.velocidadY = 0
            break
        case 'ArrowLeft':
        case 'ArrowRight':
            mascotaJugadorObjeto.velocidadX = 0
            break
    }
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaJugador = mascotaJugadorObjeto.y
    const abajoJugador = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const derechaJugador = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaJugador = mascotaJugadorObjeto.x

    if (abajoJugador < arribaEnemigo || arribaJugador > abajoEnemigo || derechaJugador < izquierdaEnemigo || izquierdaJugador > derechaEnemigo) {
        return
    }
    detenerMovimiento()
    clearInterval(pintarMokepon)
    alert('Has chocado con un enemigo')

    enemigoId = enemigo.id
    sectionSeleccionarAtaque.style.display = 'flex'
    sectionVerMapa.style.display = 'none'
    seleccionarMascotaEnemigo(enemigo)
   
}

window.addEventListener('load', iniciarJuego)

