

/*-------------------------------- Constants --------------------------------*/

const squareEls = document.querySelectorAll('.sqr');
const messageEl = document.getElementById('message');
const restartButton = document.getElementById('restart');

const winningCombinations = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8],
    [3, 4, 5], [1, 4, 7], [2, 4, 6],
    [6, 7, 8], [2, 5, 8]
]

const player1 = "X"
const player2 = "O"

/*---------------------------- Variables (state) ----------------------------*/

let board = [
    '', '', '',
    '', '', '',
    '', '', ''
];

let turn = player1
let winner = false;
let tie = false;
let aiTurn = false;

/*------------------------ Cached Element References ------------------------*/



/*-------------------------------- Functions --------------------------------*/

function render() {
    updateBoard()
    updatedMessage()
}

function updateBoard() {
    board.forEach((square, index) => {
        squareEls[index].textContent = square;
    })
}

function updatedMessage() {
    if (!winner && !tie) {
        messageEl.textContent = `It is ${turn}'s turn`
    }
    if (winner && !tie) {
        messageEl.textContent = `Congratulations ${turn} has won!`
    }
    if (tie) {
        messageEl.textContent = "Tie"
    }
}

function handleClick(index) {
    if(aiTurn) { return }
    if (squareEls[index].textContent !== '') { return }
    if (winner) {
        return;
    }
    if (tie) {
        return;
    }
    placePiece(index)

    // ai stuff
    if (!winner && !tie && turn === player2) {
        aiTurn = true
        setTimeout(makeAIMove, 800);
        setTimeout(() => {
            aiTurn = false
        }, 1000);
    }
}

// ai stuff
function makeAIMove() {
    const aiMove = findBestMove(board); // From opponentAI.js
    if (aiMove !== -1) {
        placePiece(aiMove);
    }
}

function placePiece(index) {
    squareEls[index].textContent = turn;
    board[index] = turn;
    checkForWinner(index);
    checkForTie();
    if (!winner && !tie) {
        if (turn === player1) {
            turn = player2
        } else { turn = player1 }
    }
    updatedMessage()
}

function checkForWinner(index) {
    // first attempt.. needed help
    // winningCombinations.forEach(combo => {
    //     if (index == combo[0] || index == combo[1] || index == combo[2]) {
    //         if (board[combo[0]] === '' || board[combo[1]] === '' || board[combo[2]] === '') {
    //             return;
    //         }
    //         else {
    //             if (board[combo[0]] === player1 && board[combo[1]] === player1 && board[combo[2]] === player1) {
    //                 winner = true;
    //                 return;
    //             }
    //         }
    //     }
    // })

    winner = winningCombinations.some(combo => {
        const [a, b, c] = combo;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
    updatedMessage()
}

function checkForTie() {
    // first attempt.. had to look up why wasnt working and learned includes is better
    // if (winner) { return } 
    // else {
    //     board.find(element => { element == '' ?  tie = false : tie = true })
    // }

    tie = !board.includes('');
    if (winner) { tie = false }
    console.log(tie)
}

/*----------------------------- Event Listeners -----------------------------*/

squareEls.forEach((square) => {
    square.addEventListener('click', () => {
        handleClick(square.id)
    })
})

restartButton.addEventListener('click', () => {
    if (aiTurn) { return }
    turn = player1;
    board = [
        '', '', '',
        '', '', '',
        '', '', ''
    ];
    winner = false;
    tie = false;
    render()
})

render()
