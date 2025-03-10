// Инициализация игровых переменных
let canvas, ctx;
let velociraptor, obstacles;
let score, time, isJumping, gameLoop;
let lastObstacleTime = 0;

// Загрузка изображений и звуков
const velociraptorImg = new Image();
velociraptorImg.src = 'velociraptor.png';

const obstacleImages = [
    'apple.png',
    'banana.png',
    'orange.png',
    'pear.png'
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

const jumpSound = new Audio('jump.mp3');
const backgroundMusic = new Audio('background.mp3');
backgroundMusic.loop = true;

// Инициализация игры
function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    velociraptor = {
        x: 50,
        y: canvas.height - 100,
        width: 80,
        height: 80,
        jumpHeight: 150,
        jumpSpeed: 8,
        isJumping: false
    };

    obstacles = [];
    score = 0;
    time = 0;

    // Обработчик касания экрана
    canvas.addEventListener('touchstart', jump);

    // Запуск игрового цикла
    gameLoop = setInterval(update, 1000 / 60);
    setInterval(() => time++, 1000);

    backgroundMusic.play();
}

// Функция прыжка
function jump() {
    if (!velociraptor.isJumping) {
        velociraptor.isJumping = true;
        jumpSound.play();
        navigator.vibrate(50); // Вибрация при прыжке
    }
}

// Обновление состояния игры
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка велоцираптора
    ctx.drawImage(velociraptorImg, velociraptor.x, velociraptor.y, velociraptor.width, velociraptor.height);

    // Обработка прыжка
    if (velociraptor.isJumping) {
        velociraptor.y -= velociraptor.jumpSpeed;
        if (velociraptor.y <= canvas.height - 100 - velociraptor.jumpHeight) {
            velociraptor.isJumping = false;
        }
    } else if (velociraptor.y < canvas.height - 100) {
        velociraptor.y += velociraptor.jumpSpeed;
    }

    // Создание новых препятствий
    if (Date.now() - lastObstacleTime > 2000) {
        createObstacle();
        lastObstacleTime = Date.now();
    }

    // Обновление и отрисовка препятствий
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= 5;
        ctx.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Проверка столкновений
        if (checkCollision(velociraptor, obstacle)) {
            gameOver();
        }

        // Удаление препятствий, вышедших за пределы экрана
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
            updateScore();
        }
    });

    // Обновление времени
    updateTime();
}

// Создание нового препятствия
function createObstacle() {
    const randomImg = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
    obstacles.push({
        x: canvas.width,
        y: canvas.height - 70,
        width: 50,
        height: 50,
        img: randomImg
    });
}

// Проверка столкновений
function checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// Обновление счета
function updateScore() {
    document.getElementById('score').textContent = `Очки: ${score}`;
}

// Обновление времени
function updateTime() {
    document.getElementById('time').textContent = `Время: ${time}`;
}

// Завершение игры
function gameOver() {
    clearInterval(gameLoop);
    backgroundMusic.pause();
    alert(`Игра окончена! Ваш счет: ${score}, Время: ${time} сек.`);
    init(); // Перезапуск игры
}

// Запуск игры при загрузке страницы
window.onload = init;
