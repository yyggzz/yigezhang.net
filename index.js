console.log(gsap)
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight
const scoreEl = document.querySelector('#scoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const modalEl = document.querySelector('#modalEl')
const bigScoreEl = document.querySelector('#bigScoreEl')

// Create Player
class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true)
        c.fillStyle = this.color
        c.fill()
    }
}

// Create Projectile
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
        
    }
}

// Create Enemy
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x -= this.velocity.x
        this.y -= this.velocity.y
        
    }
}

// Create Particle
const friction = 0.98
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x -= this.velocity.x
        this.y -= this.velocity.y
        this.alpha -= 0.01
        
    }
}

const centerX = canvas.width / 2
const centerY = canvas.height / 2
const velocity = 5

let player = new Player(centerX, centerY, 10, 'white')
let projectiles = []
let enemies = []
let particles = []
let score = 0

function init(){
    player = new Player(centerX, centerY, 10, 'white')
    projectiles = []
    enemies = []
    particles = [] 
    score = 0
    scoreEl.innerHTML = score
    bigScoreEl.inn = score
}

function spawnEnemies() {
    setInterval( () => {
        const radius = Math.random() * 20 + 10 // range 10~30
        let x 
        let y
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? - radius: canvas.width + radius
            y = Math.random()  * canvas.height
        }
        else {
            x = Math.random()  * canvas.width
            y = Math.random() < 0.5 ? - radius: canvas.height + radius 
        }     
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`
        const velocity = 1
        const angle = Math.atan2(x - centerX, y - centerY) // in radian
        const velx = velocity * Math.sin(angle) 
        const vely = velocity * Math.cos(angle)
        enemies.push(new Enemy(x, y, radius, color, {x: velx, y:vely}))
    }, 1000)
}

window.addEventListener('click', (event)=> {
    const angle = Math.atan2(event.x - centerX, event.y - centerY) // in radian
    const velx = velocity * Math.sin(angle) 
    const vely = velocity * Math.cos(angle)
    const projectile = new Projectile(centerX, centerY, 5, 'white', {x: velx, y: vely})
    projectiles.push(projectile)
})

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.draw()

    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1)
        }
        particle.update()
    })

    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update()
        // remove off-screen projectiles
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width
            || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(projectileIndex, 1)
            }, 0)          
        }
    })
    
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update()

        // enemy hits player, end the game
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (dist <= enemy.radius + player.radius) {
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            bigScoreEl.innerHTML = score
        }

        // projectile hits enemy
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if (dist <= projectile.radius + enemy.radius) {
                
                // explode particles
                for (let i = 0; i < enemy.radius * 2; i++) {
                    velx = (Math.random() - 0.5) * (Math.random() * 6)
                    vely = (Math.random() - 0.5) * (Math.random() * 6)
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x: velx, y: vely}))
                }
                // shrink large enemy
                if (enemy.radius - 10 > 10) {
                    // increase score
                    score += 50
                    scoreEl.innerHTML = score
                    // shrinkage radius using gsap
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }
                else {// remove enemy
                    // increase score
                    score += 100
                    scoreEl.innerHTML = score
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                        enemies.splice(enemyIndex, 1)
                    }, 0)
                }
                               
            }
        })
    })

}

startGameBtn.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    modalEl.style.display = 'none'
    
})
