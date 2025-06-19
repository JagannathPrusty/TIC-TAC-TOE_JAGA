const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const winLine = document.getElementById('win-line');

let currentPlayer = 'X';
let gameActive = true;

const WINNING_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function handleClick(e) {
  const cell = e.target;
  if (!gameActive || cell.textContent !== '') return;

  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);

  if (checkWin(currentPlayer)) {
    statusText.textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;
  } else if (isDraw()) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWin(player) {
  return WINNING_COMBINATIONS.some(combination => {
    const hasWon = combination.every(index => {
      return cells[index].classList.contains(player);
    });
    if (hasWon) {
      showWinningLine(combination);
      return true;
    }
    return false;
  });
}

function isDraw() {
  return [...cells].every(cell => cell.textContent === 'X' || cell.textContent === 'O');
}

function restartGame() {
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X', 'O');
  });
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  winLine.style.width = '0';
  winLine.style.transform = 'none';
}

function showWinningLine(combo) {
  const firstCell = cells[combo[0]].getBoundingClientRect();
  const lastCell = cells[combo[2]].getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  const x1 = firstCell.left + firstCell.width / 2 - boardRect.left;
  const y1 = firstCell.top + firstCell.height / 2 - boardRect.top;
  const x2 = lastCell.left + lastCell.width / 2 - boardRect.left;
  const y2 = lastCell.top + lastCell.height / 2 - boardRect.top;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  winLine.style.top = `${y1}px`;
  winLine.style.left = `${x1}px`;
  winLine.style.width = `${length}px`;
  winLine.style.transform = `rotate(${angle}deg)`;
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
