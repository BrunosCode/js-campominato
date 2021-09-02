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
        results.innerHTML = "Invalid Input";
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
    console.log(`cells ${cells}`);

    // 3c. generate mined and not mined cells
    for (let i = 0; i < cells; i++) {
        if (mines.includes(i)) {
            field.innerHTML += `<div class="cell mined"></div>`;
        } else {
            field.innerHTML += `<div data-proximity="0" class="cell"></div>`;
        }
    }

    // 3d. update data-number of the non mined cells
    // based on their proximity with the mined ones
    let cellsList = field.childNodes;
    for(let i = 0; i < mines.length; i++){
        console.log(`current mine ${mines[i]}`);
        // ### Conditions based on the mine position
        // if mine in first cell
        if ( mines[i] / cols < 1 && (mines[i] + 1) % cols == 1 ) {
            let proximityList = [ mines[i] + 1, mines[i] + cols, mines[i] + cols + 1];
            console.log(proximityList);

            for (let i = 0; i < proximityList.length; i++) {
                cellsList[proximityList[i]].dataset.proximity = parseInt(cellsList[proximityList[i]].dataset.proximity) + 1;
                console.log(`${proximityList[i]} updated`);
            }
        // if mine in the last cell of the first row
        } else if ( mines[i] / cols < 1 && (mines[i] + 1) % cols == 0 ) {
            let proximityList = [ mines[i] + 1, mines[i] + cols - 1, mines[i] + cols];
            console.log(proximityList);

            for (let i = 0; i < proximityList.length; i++) {
                cellsList[proximityList[i]].dataset.proximity = parseInt(cellsList[proximityList[i]].dataset.proximity) + 1;
                console.log(`${proximityList[i]} updated`);
            }
        // if mine in the first cell of the last row   
        } else if ( mines[i] / cols >= ( rows - 1 ) && (mines[i] + 1) % cols == 1 ) {
            let proximityList = [ mines[i] + 1, mines[i] - cols, mines[i] - cols + 1];
            console.log(proximityList);

            for (let i = 0; i < proximityList.length; i++) {
                cellsList[proximityList[i]].dataset.proximity = parseInt(cellsList[proximityList[i]].dataset.proximity) + 1;
                console.log(`${proximityList[i]} updated`);
            }
        // if mine in the last cell
        } else if ( mines[i] / cols >= ( rows - 1 ) && (mines[i] + 1) % cols == 0 ) {
            let proximityList = [ mines[i] - 1, mines[i] - cols - 1, mines[i] - cols];
            console.log(proximityList);

            for (let i = 0; i < proximityList.length; i++) {
                cellsList[proximityList[i]].dataset.proximity = parseInt(cellsList[proximityList[i]].dataset.proximity) + 1;
                console.log(`${proximityList[i]} updated`);
            }
        // if mine in the first row
        } else if ( mines[i] / cols < 1 ) {
            let proximityList = [ mines[i] - 1, mines[i] + 1, mines[i] + cols - 1, mines[i] + cols + 1];
            console.log(proximityList);

            for (let i = 0; i < proximityList.length; i++) {
                cellsList[proximityList[i]].dataset.proximity = parseInt(cellsList[proximityList[i]].dataset.proximity) + 1;
                console.log(`${proximityList[i]} updated`);
            }
        // if mine in the last row
        } else if ( mines[i] / cols >= ( rows - 1 )) {
            let proximityList = [ mines[i] - 1, mines[i] + 1, mines[i] - cols - 1, mines[i] - cols, mines[i] - cols + 1];
            console.log(proximityList);

            for (let i = 0; i < proximityList.length; i++) {
                cellsList[proximityList[i]].dataset.proximity = parseInt(cellsList[proximityList[i]].dataset.proximity) + 1;
                console.log(`${proximityList[i]} updated`);
            }
        // if mine in the first col   
        } else if ( (mines[i] + 1) % cols == 1 ) {
            let proximityList = [ mines[i] + 1, mines[i] - cols, mines[i] - cols + 1, mines[i] + cols, mines[i] + cols + 1 ];
            console.log(proximityList);

            for (let i = 0; i < proximityList.length; i++) {
                cellsList[proximityList[i]].dataset.proximity = parseInt(cellsList[proximityList[i]].dataset.proximity) + 1;
                console.log(`${proximityList[i]} updated`);
            }
        // if mine in the last col   
        } else if ( (mines[i] + 1) % cols == 0 ) {
            let proximityList = [ mines[i] - 1, mines[i] - cols, mines[i] - cols - 1, mines[i] + cols, mines[i] + cols - 1 ];
            console.log(proximityList);

            for (let i = 0; i < proximityList.length; i++) {
                cellsList[proximityList[i]].dataset.proximity = parseInt(cellsList[proximityList[i]].dataset.proximity) + 1;
                console.log(`${proximityList[i]} updated`);
            }
        } else {
            let proximityList = [ 
                mines[i] - 1, 
                mines[i] + 1, 
                mines[i] - cols - 1, 
                mines[i] - cols, 
                mines[i] - cols + 1, 
                mines[i] + cols - 1, 
                mines[i] + cols, 
                mines[i] + cols + 1];
            console.log(proximityList);

            for (let i = 0; i < proximityList.length; i++) {
                cellsList[proximityList[i]].dataset.proximity = parseInt(cellsList[proximityList[i]].dataset.proximity) + 1;
                console.log(`${proximityList[i]} updated`);
            }
        }
    }
}

// 4. Color of red the clicked cell
const digCell = (event) => {
    let diggedCell = event.target;
    console.log(diggedCell);
    if (diggedCell.classList.contains("mined")) {
        alert("BOOOOOOOOOM!!!");
        field.dataset.rows = 0;
        field.innerHTML = field.innerHTML = `<div class="container"><div class="banner"><h1 id="results">YOU LOST</h1></div></div>`;
    } else if (!diggedCell.classList.contains("digged")) {
        points += 1;
        score.innerHTML = points;
    }
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
    points = 0;
    createMinedField(field, rows, cols, generateMines(rows * cols, minesNumber));
    if ( points == ((rows * cols) - minesNumber) ) {
        field.dataset.rows = 0;
        field.innerHTML = `<div class="container"><div class="banner"><h1 id="results">YOU WON</h1></div></div>`;
    }
})