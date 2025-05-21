// ====================== ELEMENTOS DO DOM ======================
const gameContainer = document.getElementById('game-container')
const player = document.getElementById('player')
const shock = document.getElementById('shock')
const plosion = document.getElementById('plosion')
const enemy = document.getElementById('enemy')
const enemySvg = document.getElementById('aviao-enemy')
const scoreDisplay = document.getElementById('score')

// ====================== ÁUDIO ======================
const sonic = new Audio('./sons/sonicboom.wav')       // Som do tiro especial
const xplosion = new Audio('./sons/xplosion.mp3')     // Som de explosão
const gemido = new Audio('./sons/gemido.mp3')         // Som de dano
const alarme = new Audio('./sons/alarme.mp3')         // Som de alerta
const shot = new Audio('./sons/queue.mp3')            // Som de tiro normal

// Configurações de áudio
shot.volume = 0.1     // Volume reduzido do tiro normal
shot.loop = true      // Tiro normal em loop
alarme.volume = 0.1   // Volume reduzido do alarme

// ====================== CONSTANTES DO JOGO ======================
const containerWidth = gameContainer.offsetWidth      // Largura da área do jogo
const containerHeight = gameContainer.offsetHeight    // Altura da área do jogo
const bulletSize = 5                                  // Tamanho do projétil normal
const missileSize = 8                                 // Tamanho do míssil
const dickSize = 8                                    // Tamanho do projétil especial
let score = 0                                         // Pontuação inicial
let keysPressed = {}                                  // Rastreamento de teclas pressionadas

// ====================== CONFIGURAÇÕES DO JOGADOR ======================
const playerHeight = player.offsetHeight              // Altura do jogador
const playerWidth = player.offsetWidth                // Largura do jogador
let playerY = containerHeight - playerHeight - 45     // Posição Y inicial (parte inferior)
let playerX = containerWidth / 2 - playerWidth / 2    // Posição X inicial (centralizado)
let playerSpeed = 5                                   // Velocidade de movimento
let playerFiring = false                              // Flag de tiro normal
let playerMissiling = false                           // Flag de míssil
let playerDicking = false                             // Flag de tiro especial

// Projéteis do jogador
let playerBullets = []    // Array de tiros normais
let playerMissiles = []   // Array de mísseis
let playerDicks = []      // Array de tiros especiais

// Posição inicial do jogador
player.style.top = playerY + 'px'
player.style.left = playerX + 'px'

// ====================== CONFIGURAÇÕES DO INIMIGO ======================
const enemyHeight = enemy.offsetHeight                 // Altura do inimigo
const enemyWidth = enemy.offsetWidth                  // Largura do inimigo
let enemyHealth = 50                                  // Vida inicial do inimigo

// Movimento do inimigo
let enemyMoveDirection = 1    // 1 = direita, -1 = esquerda
let enemyMoveSpeed = 6        // Velocidade de movimento
let enemyMoveTimer = 4        // Temporizador para mudança de direção
const enemyMoveInterval = 60  // Intervalo para mudar direção

// Tiros do inimigo
let enemyFiring = false               // Flag de tiro
let enemyBullets = []                 // Array de tiros do inimigo
let enemyFireTimer = 0                // Temporizador de tiro
let enemyFireInterval = 2             // Intervalo entre tiros

// Posição inicial do inimigo
enemy.style.left = containerWidth / 2 - enemyWidth / 2 + 'px'  // Centralizado
enemy.style.top = '20px'                                       // Topo da tela

// Aparência visual do inimigo
// Array de possíveis inimigos (comentado para usar apenas yaboss.svg)
// const enemies = ['react.svg', 'vue.svg', 'angular.svg', 'svelte.svg', 'jquery.svg', 'meteor.svg']
// let enemySrc = enemies[Math.floor(Math.random() * enemies.length)]
// enemySvg.src = `./img/${ enemySrc }`
enemySvg.src = `./img/yaboss.svg`  // Usando inimigo padrão

// Atualização da UI
scoreDisplay.style.width = enemyHealth * 10 + 'px'  // Barra de vida do inimigo

// Event Listeners para controle do jogador
document.addEventListener('keydown', (event) => {
  keysPressed[event.code] = true
  if (event.code === 'Space') {
    playerFiring = true
    // audio.loop = true
    shot.play()
  }
  if (event.code === 'KeyB') {
    playerMissiling = true
  }
  if (event.code === 'KeyD') {
    playerDicking = true
  }
})

document.addEventListener('keyup', (event) => {
  delete keysPressed[event.code]
  if (event.code === 'Space') {
    playerFiring = false
    shot.pause()
    shot.currentTime = 0
  }
  if (event.code === 'KeyB') {
    playerMissiling = false
  }
  if (event.code === 'KeyD') {
    playerDicking = false
  }
})

document.addEventListener('keyup', (event) => {
  delete keysPressed[event.code]
  if (event.code === 'ArrowUp') {
    shock.style.display = 'none'
    playerSpeed = 3
  }
})

// Função para criar tiro do jogador (agora sobe verticalmente)
function createPlayerBullet() {
  const bullet = document.createElement('div')
  bullet.textContent = Math.random() < 0.5 ? 0 : 1
  bullet.classList.add('mybullet')
  // Posição inicial do tiro acima do jogador
  bullet.style.left = player.offsetLeft + playerWidth / 2 - bulletSize / 2 + 'px'
  bullet.style.top = player.offsetTop + bulletSize + 'px'
  gameContainer.appendChild(bullet)
  playerBullets.push(bullet)
}

// Função para criar míssil do jogador (agora sobe verticalmente)
function createPlayerMissile() {
  const missile = document.createElement('div')
  missile.classList.add('missile')
  // Posição inicial do míssil acima do jogador
  missile.style.left = player.offsetLeft + playerWidth / 2 - missileSize / 2 + 'px'
  missile.style.top = player.offsetTop - missileSize + 'px'
  gameContainer.appendChild(missile)
  playerMissiles.push(missile)
}

function createPlayerDick() {
  const dick = document.createElement('div')
  dick.classList.add('dick')
  // Posição inicial do míssil acima do jogador
  dick.style.left = player.offsetLeft + playerWidth / 2 - dickSize * 2.5 + 'px'
  dick.style.top = player.offsetTop - dickSize + 'px'
  gameContainer.appendChild(dick)
  playerDicks.push(dick)
}


let palavra = { p: '', c: '', indice: 0 }
// Função para selecionar uma nova palavra aleatória da lista 
function getWord() {
  const palavras = ["MEETING", 'PROJECT', "DEADLINE", "SPRINT", "TICKET", "REVIEW", "JIRA", "TASK", 'SCRUM', 'AGILE']
  const cores = ['#ce4257', '#20bf55', '#ff006e', '#2ec4b6', '#3b28cc', '#fca311', '#0356fc', '#ef233c', '#f15bb5', '#80b918']
  let index = Math.floor(Math.random() * palavras.length)
  palavra = { p: palavras[index], c: cores[index], indice: 0 }
}

function createEnemyBullet() {

  // Se nenhuma palavra estiver selecionada ou a palavra atual terminou, seleciona uma nova
  if (palavra.p.length <= palavra?.indice) {
    getWord()
  }

  if (!palavra.c) getWord()

  // Pega o caractere atual da palavra selecionada
  const charBullet = palavra.p[palavra.indice]

  // Cria o elemento div para o projétil
  const bullet = document.createElement('div')
  bullet.style.background = palavra.c
  bullet.textContent = charBullet // Define o texto do projétil como o caractere
  bullet.classList.add('enemy-bullet') // Adiciona uma classe para estilização/identificação
  // Adicione aqui outras propriedades ou estilos para o projétil,
  // como posição inicial, etc.

  // console.log("Atirando:", charBullet, "da palavra:", palavra); // Descomente para depuração

  // Avança para o próximo caractere na palavra atual
  palavra.indice++


  bullet.classList.add('bullet')
  // bullet.style.backgroundColor = 'red' // Para diferenciar os tiros inimigos
  // Posição inicial do tiro abaixo do inimigo
  bullet.style.left = enemy.offsetLeft + enemyWidth / 2 - bulletSize / 2 + 'px'
  bullet.style.top = enemy.offsetTop + enemyHeight + 'px'
  gameContainer.appendChild(bullet)
  enemyBullets.push(bullet)
}


// Função para atualizar a posição dos elementos
function update() {
  // Movimento vertical do jogador
  if (keysPressed['ArrowUp']) {
    shock.style.display = 'block'
    // sonic.play()
    playerSpeed = 5
    playerY -= playerSpeed // Move para cima (diminui a distância do topo)
    if (playerY < 0) { // Limite superior
      playerY = 0
    }
  }
  if (keysPressed['ArrowDown']) {
    playerY += playerSpeed // Move para baixo (aumenta a distância do topo)
    if (playerY + playerHeight > containerHeight) { // Limite inferior
      playerY = containerHeight - playerHeight
    }
  }


  // Movimento horizontal do jogador
  if (keysPressed['ArrowLeft']) {
    playerX -= playerSpeed // Move para a esquerda
    if (playerX < 0) { // Limite esquerdo
      playerX = 0
    }
    player.style.transform = 'skewY(7deg)'
  } else if (keysPressed['ArrowRight']) {
    playerX += playerSpeed // Move para a direita
    if (playerX + playerWidth > containerWidth) { // Limite direito
      playerX = containerWidth - playerWidth
    }
    player.style.transform = 'skewY(-7deg)' // Aplica um skew de 10 graus no eixo Y
  } else {
    player.style.transform = 'none' // Reseta a transformação
  }


  player.style.top = playerY + 'px'
  player.style.left = playerX + 'px'

  // Movimento do inimigo (horizontal aleatório)
  enemyMoveTimer++
  if (enemyMoveTimer >= enemyMoveInterval) {
    // Muda a direção aleatoriamente (esquerda/direita)
    enemyMoveDirection = Math.random() < 0.5 ? 1 : -1
    enemyMoveTimer = 0
  }
  // Quebra de asa

  enemy.style.transform = enemyMoveDirection == 1 ? 'skewY(5deg)' : 'skewY(-5deg)'

  let enemyNewLeft = enemy.offsetLeft + enemyMoveDirection * enemyMoveSpeed
  // Limites esquerdo e direito para o inimigo
  if (enemyNewLeft < 0) {
    enemyNewLeft = 0
    enemyMoveDirection = 1 // Muda a direção se atingir a esquerda
  }
  if (enemyNewLeft + enemyWidth > containerWidth) {
    enemyNewLeft = containerWidth - enemyWidth
    enemyMoveDirection = -1 // Muda a direção se atingir a direita
  }
  enemy.style.left = enemyNewLeft + 'px'


  // Atirar do jogador
  if (playerFiring) {
    if (!player.dataset.lastShotTime || (Date.now() - player.dataset.lastShotTime > 80)) {
      createPlayerBullet()
      player.dataset.lastShotTime = Date.now()
    }
  }

  if (playerMissiling) {
    if (!player.dataset.lastShotTime || (Date.now() - player.dataset.lastShotTime > 500)) {
      createPlayerMissile()
      player.dataset.lastShotTime = Date.now()
    }
  }

  if (playerDicking) {
    if (!player.dataset.lastShotTime || (Date.now() - player.dataset.lastShotTime > 500)) {
      createPlayerDick()
      player.dataset.lastShotTime = Date.now()
    }
  }

  // Atirar do inimigo (aleatório)
  enemyFireTimer++
  if (enemyFireTimer >= enemyFireInterval) {
    if (Math.random() < .5) {
      createEnemyBullet()
    }
    enemyFireTimer = 0
    const randomIntervalFactor = Math.random() * 5
    enemyFireInterval = 14 + randomIntervalFactor
  }


  // Mover e verificar tiros do jogador 
  for (let i = 0; i < playerBullets.length; i++) {
    const bullet = playerBullets[i]
    const bulletSpeed = 7
    let bulletTop = bullet.offsetTop - bulletSpeed
    bullet.style.top = bulletTop + 'px'

    // Remover tiro se sair da tela (topo)
    if (bulletTop + bulletSize < 0) {
      bullet.remove()
      playerBullets.splice(i, 1)
      i--
    } else {
      // Verificar colisão com o inimigo
      if (checkCollision(bullet, enemy)) {
        bullet.remove()
        playerBullets.splice(i, 1)
        i--
        enemyHealth -= 0.2
        score++
        // scoreDisplay.textContent = 'Pontos: ' + score;
        scoreDisplay.style.width = enemyHealth * 10 + 'px'

        if (enemyHealth <= 0) {
          enemy.querySelector('#aviao-enemy').style.display = 'none'
          plosion.style.display = 'block'
          xplosion.play()
          setTimeout(() => enemy.remove(), 600)
        }
      }
    }
  }

  // Mover e verificar mísseis do jogador (agora sobem)
  for (let i = 0; i < playerMissiles.length; i++) {
    const missile = playerMissiles[i]
    const missileSpeed = 4
    let missileTop = missile.offsetTop - missileSpeed
    missile.style.top = missileTop + 'px'

    // Remover míssil se sair da tela (topo)
    if (missileTop + missileSize < 0) {
      missile.remove()
      playerMissiles.splice(i, 1)
      i--
    } else {
      // Verificar colisão com o inimigo
      if (checkCollision(missile, enemy)) {
        missile.remove()
        playerMissiles.splice(i, 1)
        i--
        enemyHealth--
        score++
        scoreDisplay.textContent = 'Pontos: ' + score

        if (enemyHealth <= 0) {
          enemy.remove()
          // Lógica de vitória ou novo inimigo
        }
      }
    }
  }

  for (let i = 0; i < playerDicks.length; i++) {
    const dick = playerDicks[i]
    const dickSpeed = 6
    let dickTop = dick.offsetTop - dickSpeed
    dick.style.top = dickTop + 'px'

    // Remover míssil se sair da tela (topo)
    if (dickTop + dickSize < 0) {
      dick.remove()
      playerDicks.splice(i, 1)
      i--
    } else {
      // Verificar colisão com o inimigo
      if (checkCollision(dick, enemy)) {
        dick.remove()
        gemido.play()
        playerDicks.splice(i, 1)
        i--
        enemyHealth = enemyHealth - 3
        score++
        // scoreDisplay.textContent = 'Pontos: ' + score
        scoreDisplay.style.width = enemyHealth * 10 + 'px'

        if (enemyHealth <= 0) {
          enemy.remove()
          // Lógica de vitória ou novo inimigo
        }
      }
    }
  }

  // Mover e verificar tiros do inimigo (agora descem)
  for (let i = 0; i < enemyBullets.length; i++) {
    const bullet = enemyBullets[i]
    const bulletSpeed = 4
    let bulletTop = bullet.offsetTop + bulletSpeed
    bullet.style.top = bulletTop + 'px'

    // Remover tiro se sair da tela (inferior)
    if (bulletTop > containerHeight) {
      bullet.remove()
      enemyBullets.splice(i, 1)
      i--
    } else {
      // Verificar colisão com o jogador
      // Verificar colisão com o jogador
      if (checkCollision(bullet, player)) {
        alarme.play() // Chama a função para tocar o beep (ela já controla a duração e evita acúmulo)

        bullet.remove()
        enemyBullets.splice(i, 1)
        i-- // Ajusta o índice após remover um elemento do array
        console.log("Jogador foi atingido!")
        // TODO: Implementar lógica de vida do jogador ou fim de jogo
      }
    }
  }

  requestAnimationFrame(update)
}

// Função de verificação de colisão (Bounding Box) - Não precisa de alteração
function checkCollision(element1, element2) {
  const rect1 = element1.getBoundingClientRect()
  const rect2 = element2.getBoundingClientRect()

  return !(
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom ||
    rect1.right < rect2.left ||
    rect1.left > rect2.right
  )
}

// Iniciar o jogo
update()
