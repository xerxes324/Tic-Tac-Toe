function setupDOM(){
    
    tictac = controller();
    tictac.xoboard.turncheck(tictac.getactiveplayer().playername);
    const domboard = document.querySelector(".board")
    for ( let i = 0 ; i < 3 ; i++ ){
        for ( let j = 0 ; j < 3 ; j++){
            const cellbutton = document.createElement("button");
            cellbutton.classList.add("cell");
            cellbutton.dataset.row = i;
            cellbutton.dataset.col = j;
            cellbutton.innerHTML = "";
            cellbutton.addEventListener("click",(e)=>{
                tictac.playround(tictac.getactiveplayer(),parseInt(cellbutton.dataset.row), parseInt(cellbutton.dataset.col),cellbutton);
                cellbutton.disabled = true;
            })
            domboard.appendChild(cellbutton);

        }
    }

    const reset = document.getElementById("reset");
    reset.dataset.id = "reset-id";
    reset.addEventListener("click",()=>{
        const board = document.querySelector(".board");
        board.innerHTML = ""
        setupDOM();
    })
}
function disablebuttons(){
    const buttons = document.querySelectorAll("button");
    buttons.forEach(e => {
        if ( e.dataset.id !== "reset-id" ){
            e.disabled = true;
        } 
    });
}

function gameboard(){
    
    const rows = 3;
    const cols = 3;
    const board = []

    for ( let i = 0 ; i < rows ; i++){
        board[i] = []
        for ( let j = 0 ; j < cols ; j++ ){
            board[i].push(createCell());
        }
    }
    const getboard = ()=> board;

    const printboard = ()=>{
        
        const console_board = board.map((row) => row.map((cell) => cell.getvalue()));
        return {console_board}
    }

    const droptoken = (activeplayer, rowid, colid, button)=>{
        for ( let i = 0 ; i < 3 ; i++){
            for ( let j = 0 ; j < 3 ; j++){
                if ( i === rowid && j === colid){
                    board[i][j].addtoken(activeplayer,activeplayer.token, button);
                    break;
                }
            }
        }
    }

    const turncheck = (activeplayer)=>{
        const turn = document.getElementById("turn");
        turn.innerHTML = `Current Turn : ${activeplayer}`;
    }
    return {printboard, getboard, droptoken, turncheck};
}


function createCell(){
    let value = "empty";
    //function to change value:
    const addtoken = (player,tokenlabel,button)=> {
        value = tokenlabel
        button.innerHTML = tokenlabel
    };
    //function to retrieve value:
    const getvalue = ()=> value;
    return {addtoken,getvalue} 
}


function controller(player1 = "PlayerOne", player2 = "PlayerTwo"){


    const xoboard = gameboard();
    
    const players = [
        {
            playername : player1,
            token : "X"
        },
        {
            playername : player2,
            token: "O"
        }
    ]

    let activeplayer = players[Math.floor(players.length * Math.random())];

    const switchplayer = ()=>{
        activeplayer = activeplayer === players[0] ? players[1] : players[0]; // ternary to switch between 1 and 0 , ie player1 and player2
    }

    const getactiveplayer = ()=> activeplayer;

    const printround = ()=>{
        const tempboard = xoboard.printboard();
        return {tempboard}
    }

    const playround = (activeplayer, rowid, colid, button)=>{
        console.log(activeplayer);
        console.log("works")
        
        xoboard.droptoken(activeplayer,rowid, colid, button)
        printround(); // prints it in the console. 

        wincheck();
        switchplayer();
        xoboard.turncheck(getactiveplayer().playername);

    }

    const wincheck = ()=>{
        const board = printround().tempboard.console_board; //accesing tempboard from within the modified_board object. can also use bracket notation instead of DOT. 
        console.log(board);
        let flag = 0;
        let winner = document.getElementById("winner");

        if ( board[0][0] === board[1][1] && board[1][1] == board[2][2] && board[0][0] !== "empty" || //main diagonal
             board[0][2] === board[1][1] && board[1][1]=== board[2][0] && board[0][2] !== "empty" || // 2nd diagonal
             board[0][0] === board[0][1] && board[0][1] === board[0][2] && board[0][0] !== "empty" || // top row
             board[1][0] === board[1][1] && board[1][1] === board[1][2] && board[1][0] !== "empty" || // middle row
             board[2][0] === board[2][1] && board[2][1] === board[2][2] && board[2][0] !== "empty" || // bottom row
             board[0][0] === board[1][0] && board[1][0] === board[2][0] && board[0][0] !== "empty" || // first column
             board[0][1] === board[1][1] && board[1][1] === board[2][1] && board[0][1] !== "empty" || // second column
             board[0][2] === board[1][2] && board[1][2] === board[2][2] && board[0][2] !== "empty") // third column
        {
            console.log(activeplayer);
            winner.innerHTML = `Winner is : ${activeplayer.playername}`;
            disablebuttons();

        }
        for ( let i = 0; i < 3; i++ ){
            for ( let j = 0 ; j < 3 ; j++){
                if ( board[i][j] === "empty" ){
                    flag = 1;
                    break;
                }
            }
        }
        if ( flag === 0){
            winner.innerHTML = "The match has ended in a draw."
        }
    }
    return {getactiveplayer,printround,playround,xoboard}; 
}

setupDOM();