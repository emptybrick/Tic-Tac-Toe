/*---------------------------------- Audio ----------------------------------*/

const winAudio = new Audio('sounds/win.wav')
const tieAudio = new Audio('sounds/tie.wav')
const loseAudio = new Audio('sounds/lose.wav')
const bowserAudio = new Audio('sounds/thud.wav')
const marioAudio = new Audio('sounds/stomp.wav')
const restartAudio = new Audio('sounds/restart.wav')


/*-------------------------------- Constants --------------------------------*/

const squareEls = document.querySelectorAll('.sqr');
const messageEl = document.getElementById('message');
const restartButton = document.getElementById('restart');

const winningCombinations = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8],
    [3, 4, 5], [1, 4, 7], [2, 4, 6],
    [6, 7, 8], [2, 5, 8]
]

const player1 = { name: "X", character: "Mario", image: 'images/mario.png' }
const player2 = { name: "O", character: "Bowser", image: 'images/bowser.png' }


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

/*-------------------------------- Functions --------------------------------*/

function render() {
    updateBoard()
    updatedMessage()
}

function updateBoard() {
    board.forEach((square, index) => {
        const squareEl = squareEls[index];
        squareEl.textContent = '';
        squareEl.style.backgroundImage = ''; 
        if (square === player1.name) {
            squareEl.style.backgroundImage = `url(${player1.image})`;
           
        } else if (square === player2.name) {
            squareEl.style.backgroundImage = `url(${player2.image})`;

        }
    });
}

function updatedMessage() {
    if (!winner && !tie) {
        messageEl.textContent = `It is ${turn.character}'s turn`
    }
    if (winner && !tie) {
        if (turn === player2) {
            messageEl.textContent = `Uh oh! ${turn.character} has won!`
            loseAudio.volume = 0.1
            loseAudio.play()
        } else {
            messageEl.textContent = `Congratulations ${turn.character} has won!`
            winAudio.volume = 0.1
            winAudio.play()
        }
    }
    if (tie) {
        messageEl.textContent = "Tie"
        tieAudio.volume = 0.1
        tieAudio.play()
    }
}

function handleClick(index) {
    if (aiTurn) { return }
    if (squareEls[index].textContent !== '') { return }
    if (winner) {
        return;
    }
    if (tie) {
        return;
    }
    placePiece(index)
    marioAudio.volume = 0.1
    marioAudio.play()

    // ai stuff
    if (!winner && !tie && turn === player2) {
        aiTurn = true
        setTimeout(() => {
            makeAIMove()
            bowserAudio.volume = 0.1
            bowserAudio.play()
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
    board[index] = turn.name;
    checkForWinner(index);
    checkForTie();
    if (!winner && !tie) {
        if (turn === player1) {
            turn = player2
        } else { turn = player1 }
    }
    updatedMessage()
    updateBoard()
}

function checkForWinner() {
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
}

function checkForTie() {
    // first attempt.. had to look up why wasnt working and learned includes is better
    // if (winner) { return } 
    // else {
    //     board.find(element => { element == '' ?  tie = false : tie = true })
    // }

    tie = !board.includes('');
    if (winner) { tie = false }
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
    restartAudio.volume = 0.05
    restartAudio.play()
})

render()
