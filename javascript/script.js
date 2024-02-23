// Selecionando o elemento Cavas via querySelector &
//  inserindo o contexto
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const scoreHidden = document.querySelector('.score');
const score = document.querySelector('.score--value');
const finalScore = document.querySelector('.final-score > span');
const menu = document.querySelector('.menu-screen');
const buttonPlay = document.querySelector('.btn-play');

const audio = new Audio('../assets/audio.mp3');

// Definindo o temanho da cobrinha
const size = 30;

// Definindo a posição inicial
const initialPosition = { x: 270, y: 240 };

let snake = [initialPosition];

const incrementScore = () => {
	score.innerText = +score.innerText + 10;
};

// Desenhando a comida em posições aleatórias
const randomNumber = (min, max) => {
	return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
	const number = randomNumber(0, canvas.width - size);
	return Math.round(number / size) * size;
};

// Setando uma cor aleatória para a Food

const randomColorFood = () => {
	const red = randomNumber(0, 255);
	const green = randomNumber(0, 255);
	const blue = randomNumber(0, 255);

	return `rgb(${red}, ${green}, ${blue})`;
};

const food = {
	x: randomPosition(),
	y: randomPosition(),
	color: randomColorFood(),
};

// Setando as características da comida
const drawFood = () => {
	const { x, y, color } = food;

	ctx.shadowColor = color;
	ctx.shadowBlur = 8;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, size, size);
	ctx.shadowBlur = 0;
};

// definindo a direção da cobrinha
let direction, loopId;

// Atribuindo movimento à cobrinha
const moveSnake = () => {
	if (!direction) return;

	const head = snake[snake.length - 1];

	if (direction == 'right') {
		snake.push({ x: head.x + size, y: head.y });
	}

	if (direction == 'left') {
		snake.push({ x: head.x - size, y: head.y });
	}

	if (direction == 'up') {
		snake.push({ x: head.x, y: head.y - size });
	}

	if (direction == 'down') {
		snake.push({ x: head.x, y: head.y + size });
	}

	snake.shift();
};

const drawGrid = () => {
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#191919';

	for (let i = size; i < canvas.width; i += size) {
		ctx.beginPath();
		ctx.lineTo(i, 0);
		ctx.lineTo(i, 600);
		ctx.stroke();

		ctx.beginPath();
		ctx.lineTo(0, i);
		ctx.lineTo(600, i);
		ctx.stroke();
	}
};

// Constante que checka se a cobrianha comeu a comida
const checkEat = () => {
	const head = snake[snake.length - 1];

	if (head.x == food.x && head.y == food.y) {
		incrementScore();
		snake.push(head);
		audio.play();
		let x = randomPosition();
		let y = randomPosition();

		while (snake.find((position) => position.x == x && position.y == y)) {
			x = randomPosition();
			y = randomPosition();
		}

		food.x = x;
		food.y = y;
		food.color = randomColorFood();
	}
};

// lógica que percorre e desenha a cobrinha
const drawSnake = () => {
	ctx.fillStyle = '#ddd';
	snake.forEach((position, index) => {
		if (index == snake.length - 1) {
			ctx.fillStyle = 'white';
		}
		ctx.fillRect(position.x, position.y, size, size);
	});
};

const gameOver = () => {
	direction = undefined;
	scoreHidden.style.display = 'none';
	menu.style.display = 'flex';
	finalScore.innerText = score.innerText;
	canvas.style.filter = 'blur(2px)';
};

// checkando a colisão
const checkCollision = () => {
	const head = snake[snake.length - 1];
	const canvasLimit = canvas.width - size;
	const neckIndex = snake.length - 2;

	const wallCollision =
		head.x < 0 ||
		head.x > canvasLimit ||
		head.y < 0 ||
		head.y > canvasLimit;

	const selfCollision = snake.find((position, index) => {
		return index < neckIndex && position.x == head.x && position.y == head.y;
	});

	if (wallCollision || selfCollision) {
		gameOver();
	}
};

// loop responsavel por desenhar a cobrinha e atualizar a tela,
// limpar o loop para evitar erros.
//limpar o canvas
const gameLoop = () => {
	clearInterval(loopId);
	ctx.clearRect(0, 0, 600, 600);
	drawFood();
	drawGrid();
	drawSnake();
	moveSnake();
	checkEat();
	checkCollision();

	loopId = setTimeout(() => {
		gameLoop();
	}, 300);
};

gameLoop();

// Mapeando a direção usando o teclado
document.addEventListener('keydown', ({ key }) => {
	if (key == 'ArrowRight' && direction != 'left') {
		direction = 'right';
	}

	if (key == 'ArrowLeft' && direction != 'right') {
		direction = 'left';
	}

	if (key == 'ArrowUp' && direction != 'down') {
		direction = 'up';
	}

	if (key == 'ArrowDown' && direction != 'up') {
		direction = 'down';
	}
});

buttonPlay.addEventListener('click', () => {
	score.innerText = '00';
	menu.style.display = 'none';
	canvas.style.filter = 'none';
	scoreHidden.style.display = 'flex';

	snake = [initialPosition];
});
