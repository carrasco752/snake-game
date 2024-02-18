// Selecionando o elemento Cavas via querySelector &
//  inserindo o contexto
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Definindo o temanho da cobrinha
const size = 30;

// Definindo a lógica que dita o tamanho e o movimento da cobrinha

const snake = [
	{ x: 200, y: 200 },
	{ x: 230, y: 200 },
];

// definindo a direção da cobrinha
let direction, loopId;

// Atribuindo movimento à ela
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

// loop responsavel por desenhar a cobrinha e atualizar a tela,
// limpar o loop para evitar erros.
//limpar o canvas
const gameLoop = () => {
	clearInterval(loopId);
	ctx.clearRect(0, 0, 600, 600);

	moveSnake();
	drawSnake();

	loopId = setTimeout(() => {
		gameLoop();
	}, 300);
};

gameLoop();

// Mapeano a direção usando o teclado
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
