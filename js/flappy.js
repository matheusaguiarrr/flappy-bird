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
    //Pode ser passado como parâmetro, deixando a velocidade dinâmica
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

function Passaro(alturaJogo){
    let voando = false
    this.element = novoElemento('img', 'passaro')
    this.element.src = 'imgs/passaro.png'
    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`
    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false
    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.element.clientHeight
        if(novoY <= 0){
            this.setY(0)
        }else if(novoY >= alturaMaxima){
            this.setY(alturaMaxima)
        }else{
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo / 2)
}

function Progresso(){
    this.element = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.element.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

function FlappyBird(){
    let pontos = 0
    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth
    const progresso = new Progresso()
    const barreiras = new creatBarreiras(altura, largura, 200, 400,() => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(altura)
    areaDoJogo.appendChild(progresso.element)
    areaDoJogo.appendChild(passaro.element)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.element))
    this.start = () => {
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()
        }, 20)
    }
}

new FlappyBird().start()

// const barreiras = new creatBarreiras(700, 1200, 200, 400)
// const passaro = new Passaro(700)
// const areaDoJogo = document.querySelector('[wm-flappy]')
// areaDoJogo.appendChild(passaro.element)
// areaDoJogo.appendChild(new Progresso().element)
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.element))
// setInterval(() => {
//     barreiras.animar()
//     passaro.animar()
// }, 20)