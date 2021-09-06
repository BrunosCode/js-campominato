// Il computer deve generare 16 numeri casuali tra 1 e 100 (bombe).
// I numeri non possono essere duplicati.
// In seguito il giocatore clicca sulle celle numerate (non può cliccare più volte sulla stessa cella)
// La partita termina quando il giocatore clicca su un numero “vietato” o clicca su tutte le celle che non sono delle bombe.
// Al termine della partita il software deve comunicare il punteggio.
// BONUS: (da fare solo se funziona tutto il resto)
// all’inizio il software richiede anche una difficoltà all’utente che cambia il range di numeri casuali:
// con difficoltà 0 => tra 1 e 100
// con difficoltà 1 => tra 1 e 80
// con difficoltà 2 => tra 1 e 50


// # MINED FIELD

// ## SHORTCUT VARIABLES
const field = document.getElementById("field");
const startBtn = document.getElementById("startBtn");
const score = document.getElementById("score");
const userRows = document.getElementById("rows");
const userMines = document.getElementById("mines");

// ## FUNCTIONS
// 1. Ask the number of cells to the user
const userChoosenNumber = (input, max) => {
    let userNumber = parseInt(input);
    if ( !isNaN(userNumber) && userNumber > 0 && userNumber <= max ) {
        return userNumber;
    } else {
        return false;
    }
}

// 2. Generate mines index
// input: max, number of mines
const generateMines = (max, minesNumber) => {
    let mines = [];
    // to avoid mines index repetition
    // 2a. create an array containing each cell's index
    let minesStock = [];
    for (let i = 0; i < max; i++) {
        minesStock.push(i);
    }
    // 2b. pick a random number from minesStock, remove it and add it to the mines array
    for (let i = 0; i < minesNumber; i++) {
        let randomNumber = Math.floor(Math.random() * minesStock.length);
        mines.push(minesStock[randomNumber]);
        minesStock.splice(randomNumber, 1);
    }

    return mines;
}

// 3. Create list to update data-proximity of the non mined cells based on their proximity with the mined ones
const genarateProximityData = (rows, cols, mines) => {
    // 3a. diclare the proximity object
    let proximityData = {};

    // 3b. for each mine generate a proximityList
    for(let i = 0; i < mines.length; i++){
        // boolean variable based on the conditions to verify mine position
        let inFirstRow = mines[i] / cols < 1;
        let inLastRow = mines[i] / cols >= rows - 1;
        let inFirstCol = (mines[i] + 1) % cols == 1;
        let inLastCol = (mines[i] + 1) % cols == 0;
        
        // index of the index of adjacent cells
        let cellLeft = mines[i] - 1; 
        let cellRight = mines[i] + 1; 
        let cellTopLeft = mines[i] - cols - 1; 
        let cellTop = mines[i] - cols; 
        let cellTopRight = mines[i] - cols + 1; 
        let cellBottomLeft = mines[i] + cols - 1; 
        let cellBottom = mines[i] + cols; 
        let cellBottomRight = mines[i] + cols + 1;

        // list of cells near the mine
        let proximityList = [];

        // give back the proximityList based on mine position
        // if the mine in first cell
        if ( inFirstRow && inFirstCol ) {
            proximityList = [ cellRight, cellBottom, cellBottomRight ];

        // if the mine in the last cell of the first row
        } else if ( inFirstRow && inLastCol ) {
            proximityList = [ cellLeft, cellBottomLeft, cellBottom ];

        // if the mine in the first cell of the last row   
        } else if ( inLastRow && inFirstCol ) {
            proximityList = [ cellRight, cellTop, cellTopRight ];

        // if the mine in the last cell
        } else if ( inLastRow && inLastCol ) {
            proximityList = [ cellLeft, cellTopLeft, cellTop ];

        // if the mine in the first row
        } else if ( inFirstRow ) {
            proximityList = [ cellLeft, cellRight, cellBottomLeft, cellBottom, cellBottomRight ];

        // if the mine in the last row
        } else if ( inLastRow ) {
            proximityList = [ cellLeft, cellRight, cellTopLeft, cellTop, cellTopRight ];

        // if the mine in the first col   
        } else if ( inFirstCol ) {
            proximityList = [ cellRight, cellTop, cellTopRight, cellBottom, cellBottomRight ];

        // if the mine in the last col   
        } else if ( inLastCol ) {
            proximityList = [ cellLeft, cellTop, cellTopLeft, cellBottom, cellBottomLeft ];

        } else {
            proximityList = [ cellLeft, cellRight, cellTopLeft, cellTop, cellTopRight, cellBottomLeft, cellBottom, cellBottomRight ];
        }
        
        // for each mine, used as key, store the list of nearbyCells
        proximityData[mines[i]] = proximityList;
    }
    // proximityData = {mine index : list of nearby cells indexs}
    return proximityData;
}

// ## MAIN SCRIPT
let points, maximumScore;

// ### START GAME
// 4. Start the script and create field
startBtn.addEventListener("click", () => {
    // 4a. get field dimension from the user
    let rows = userChoosenNumber((userRows.value), 10);
    if (rows == false) {
        score.innerHTML = "Invalid Input";
    }
    let cols = rows;

    // 4b. generate Mines Index s
    let minesMultiplier = 16 / 3;
    let minesNumber = parseInt(userChoosenNumber(userMines.value, 3) * minesMultiplier);
    let mines = generateMines(rows * cols, minesNumber);

    // 4c. reset the field
    field.innerHTML = "";
    field.dataset.rows = rows;

    // 4d. nject mined and not mined cells
    let cells = rows * cols;
    for (let i = 0; i < cells; i++) {
        if (mines.includes(i)) {
            field.innerHTML += `<div class="cell mined">${i}</div>`;
        } else {
            field.innerHTML += `<div data-proximity="0" class="cell">${i}</div>`;
        }
    }

    // 4e. update data proximity of the cells in the proximityList
    // proximityData = {mine index : list of nearby cells indexs}
    let proximityData = genarateProximityData(rows, cols, mines);
    for ( let mine in proximityData) {
        for (let nearbyCell = 0; nearbyCell < proximityData[mine].length; nearbyCell++) {
            field.childNodes[proximityData[mine][nearbyCell]].dataset.proximity = parseInt(field.childNodes[proximityData[mine][nearbyCell]].dataset.proximity) + 1;
        }
    }

    // 4f. reset the score
    points = 0;
    maximumScore = (rows * cols) - minesNumber; 

});

// ### PLAY 
// 5. Add event listener to the field and activete script for each cells clicked
field.addEventListener("click", (event) => {
    let diggedCell = event.target;
    let endGame = "";

    // 5a. if you clicked a mine => endgame
    if (diggedCell.classList.contains("mined")) {
        alert("BOOOOOOOOOM!!!");
        endGame = "lose";

    // 5b. if you click a point update the score
    } else if (!diggedCell.classList.contains("digged")) {
        points += 1;
        score.innerHTML = points;
    }

    // 5c. add class digged to reveal cell content
    diggedCell.classList.add("digged");

    // 5d. if user get the maximum score end the game
    if ( points == maximumScore ) {
        endGame = "won";
    }


// ### END GAME
    // 6. if endGame is not a empty string end the game
    if ( endGame ) {
        field.dataset.rows = 0;
        if ( endGame === "won" ) {
            field.innerHTML = `<div class="flex-center"><div class="banner"><h1 id="results">YOU WON</h1></div></div>`;
        }
        if ( endGame === "lose" ) {
            field.innerHTML = `<div class="flex-center"><div class="banner"><h1 id="results">YOU LOST</h1></div></div>`;
        }
        endGame = "";
    }
});

