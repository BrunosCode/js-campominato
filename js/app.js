// Chiedere all'utente di inserire il numero di celle di cui sarà composto il campo da gioco.
// Tramite una funzione javascript disegnare in pagina la griglia con massimo 10 celle per riga.
// Al click su una cella dovrà essere mostrato con un alert il numero della cella e il suo background diventerà rosso.

// # MINED FIELD

// ## VARIABLES
const field = document.getElementById("field");
const startBtn = document.getElementById("startBtn");
const score = document.getElementById("score");
const userRows = document.getElementById("rows");
const userMines = document.getElementById("mines");
let points = 0;

// ## FUNCTIONS
// 1. Ask the number of cells to the user
// const userChoosenNumber = (max) => {
//     let userNumber = parseInt(prompt(`Choose a number of rows,  ${max} is the maximum`));
//     if ( !isNaN(userNumber) && userNumber >= 0 && userNumber <= max ) {
//         console.log(`userNumber ${userNumber}`);
//         return userNumber;
//     } else {
//         alert("Invalid number");
//         return userChooseANumber(max);
//     }
// }
const userChoosenNumber = (input, max) => {
    let userNumber = parseInt(input);
    if ( !isNaN(userNumber) && userNumber > 0 && userNumber <= max ) {
        return userNumber;
    } else {
        score.innerHTML = "Invalid Input";
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
    console.log(`minesIndex ${mines}`);
    return mines;
}

// 3. Function inject a number of html cells in the document, some of which are mined
// const createField = (rows, columns) => {
//     let cells = rows * columns;
//     for (let i = 0; i < cells; i++) {
//         field.innerHTML += `<div class="cell mined"></div>`
//     }
// }
const createMinedField = (field, rows, cols, mines) => {
    // 3a. reset the field
    field.innerHTML = "";
    field.dataset.rows = rows;

    // 3b. number of cells
    let cells = rows * cols;

    // 3c. generate mined and not mined cells
    for (let i = 0; i < cells; i++) {
        if (mines.includes(i)) {
            field.innerHTML += `<div class="cell mined">${i}</div>`;
        } else {
            field.innerHTML += `<div data-proximity="0" class="cell">${i}</div>`;
        }
    }

    // 3d. update data-proximity of the non mined cells
    // based on their proximity with the mined ones
    let cellsList = field.childNodes;
    console.log(`cellsList ${field.childNodes[1]}`)
    for(let i = 0; i < mines.length; i++){

        console.log(`current mine ${mines[i]}`);

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
            proximityList = [ cellRight, cellTop, cellTopRight, cellBottom, cellBottomRight ];

        } else {
            proximityList = [ cellLeft, cellRight, cellTopLeft, cellTop, cellTopRight, cellBottomLeft, cellBottom, cellBottomRight ];
        }
        
        // update data proximity of the cells in the proximityList
        for (let i = 0; i < proximityList.length; i++) {
            cellsList[proximityList[i]].dataset.proximity = parseInt(cellsList[proximityList[i]].dataset.proximity) + 1;
        }
    }
}

// 4. Reveil if you clicked a bomb or a point
const digCell = (event) => {
    let diggedCell = event.target;

    // 4a. if you clicked a mine => endgame
    if (diggedCell.classList.contains("mined")) {
        alert("BOOOOOOOOOM!!!");
        // reset the grid
        field.dataset.rows = 0;
        // popup the results
        field.innerHTML = field.innerHTML = `<div class="flex-center"><div class="banner"><h1 id="results">YOU LOST</h1></div></div>`;

    // 4b. if you click a point update the score
    } else if (!diggedCell.classList.contains("digged")) {
        points += 1;
        score.innerHTML = points;
    }

    // 4c. add class digged to reveal cell content
    diggedCell.classList.add("digged");
}

// ## EVENT LISTENERS
// 5. Add event listener to the field
field.addEventListener("click", digCell);

// ## MAIN SCRIPT
// 6. Start the script and create field
startBtn.addEventListener("click", () => {

    let rows = parseInt(userChoosenNumber((userRows.value), 10));
    let cols = rows;

    let minesNumber = parseInt(userChoosenNumber(userMines.value, 3) * rows);
    createMinedField(field, rows, cols, generateMines(rows * cols, minesNumber));

    // reset the score
    points = 0;

    if ( points == ((rows * cols) - minesNumber) ) {
        field.dataset.rows = 0;
        field.innerHTML = `<div class="flex-center"><div class="banner"><h1 id="results">YOU WON</h1></div></div>`;
    }
})