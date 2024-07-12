function novoElemento(tagName, className) {
    const element = document.createElement(tagName)
    // element.addClass(className) As duas formas são válidas
    element.className = className
    return element
}

function creatBarreira(reverse = false){
    this.element = novoElemento('div', 'barreira')
    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.element.appendChild(reverse ? corpo : borda)
    this.element.appendChild(reverse ? borda : corpo)
    this.setHeight = height => corpo.style.height = `${height}px`
}

// const b = new creatBarreira(true)
// b.setHeight(200)
// document.querySelector('[wm-flappy]').appendChild(b.element)

function createParDeBarreiras(height, abertura, x){
    this.element = novoElemento('div', 'par-de-barreiras')
    this.superior = new creatBarreira(true)
    this.inferior = new creatBarreira(false)
    this.element.appendChild(this.superior.element)
    this.element.appendChild(this.inferior.element)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (height - abertura)
        const alturaInferior = height - abertura - alturaSuperior
        this.superior.setHeight(alturaSuperior)
        this.inferior.setHeight(alturaInferior)
    }
    //Pegando a posição do par de barreiras
    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getLargura = () => this.element.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

// const b = new createParDeBarreiras(700, 200, 400)
// document.querySelector('[wm-flappy]').appendChild(b.element)

function creatBarreiras(height, width, abertura, espaco, notificarPonto){
    this.pares = [
        new createParDeBarreiras(height, abertura, width),
        new createParDeBarreiras(height, abertura, width + espaco),
        new createParDeBarreiras(height, abertura, width + espaco * 2),
        new createParDeBarreiras(height, abertura, width + espaco * 3)
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            //Quando o elemento sair da área do jogo
            if(par.getX() < -par.getLargura()){
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = width / 2
            const cruzouMeio = par.getX() + deslocamento >= meio && par.getX() < meio
            if(cruzouMeio) notificarPonto()
        })
    }
}

const barreiras = new creatBarreiras(700, 1200, 200, 400)
const areaDoJogo = document.querySelector('[wm-flappy]')
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.element))
setInterval(() => {
    barreiras.animar()
}, 20)