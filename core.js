const PLAYER_CHIP = `<button class="player"></button>`;
const COMPUTER_CHIP = `<button class="computer"></button>`;

const getDomNodeString = function(id){
    const node = document.querySelector(id);
    return node.innerHTML;
}

const InitialState = {
    gameGrid: getDomNodeString("#game-grid"),
    gameStarted: false,
    gameFinished: false,
};

const BoardController = {

    player: 1,
    computer: 2,
    empty: 0,
    positions: [
        0,0,0,
        0,0,0,
        0,0,0,
    ],

    IsEmpty: function(e) {
        return this.positions[e] === 0 ? true : false;
    },

    IsFull: function(){
        const { positions } = this;
        let aux = 0;
        for(let i = 0; i < positions.length; i++){
            if(!this.IsEmpty(i)) aux++;
        } return aux === positions.length ? true : false;
    },

    HandleWinner: function(){
        const result = this.Checker();

        switch(result){
            case 1:
                GameController.gameFinished = true; MessageController.SetMessage("Player wins.");
                break;
            case 2:
                GameController.gameFinished = true; MessageController.SetMessage("Computer wins.");
                break;
            default:
                this.IsDraw();
                break;
        }
    },

    IsDraw: function(){
        if(this.IsFull()){
            MessageController.SetMessage("Game was a draw");
        }
    },

    Checker: function(){
        const pos = this.positions;
        //check rows
        if (this.CheckRow(pos[0], pos[1], pos[2])) { return pos[0]; }
        if (this.CheckRow(pos[3], pos[4], pos[5])) { return pos[3]; }
        if (this.CheckRow(pos[6], pos[7], pos[8])) { return pos[6]; }
        // check cols
        if (this.CheckRow(pos[0], pos[3], pos[6])) { return pos[0]; }
        if (this.CheckRow(pos[1], pos[4], pos[7])) { return pos[1]; }
        if (this.CheckRow(pos[2], pos[5], pos[8])) { return pos[2]; }
        //check diagonals 
        if (this.CheckRow(pos[0], pos[4], pos[8])) { return pos[0]; }
        if (this.CheckRow(pos[2], pos[4], pos[6])) { return pos[2]; }
    },

    CheckRow: function(p1, p2, p3){
        if (p1 !== 0 && p2 !== 0 && p3 !== 0) {
            return (p1 === p2 && p2 === p3) ? true : false;
        } else {
            return false;
        }
    }
};

const GameController = {

    gameStarted: false,
    gameFinished: false,

    EnableAction: function(){
        for(let i = 0; i < 9; i++){
            let action = document.querySelector(`#b${i}`);
            action.addEventListener('click', function(){
                if(!GameController.gameFinished){
                    console.log(`Player moves. Cell: ${i}`);
                    action.parentElement.innerHTML = PLAYER_CHIP;
                    BoardController.positions[i] = BoardController.player;
                    BoardController.HandleWinner();
                }
            });
        }
    },

    Init: function(){
        console.log("Game initialized");
        this.gameStarted = true;
        // enable player actions
        this.EnableAction();
        // get 1st turn
        const turn = this.ResolveFirstTurn();
        // IA gets first turn
        if(turn === 2) IAController.Move();
        IAController.Init();
    },

    ResolveFirstTurn: function(){
        const { player, computer } = BoardController;
        const rdm = Math.floor(Math.random() * 2) + 1;
        switch(rdm){
            case 1:
                return player;
            case 2:
                return computer;
        }
    },
};


const IAController = {

    canMove: false,

    Init: function(){
        const boardCells = document.querySelectorAll("#game-grid th");
        boardCells.forEach(e => e.addEventListener("click", function(){
            IAController.Move();
        }));
    },

    Move: function(){
        const { positions, computer, empty } = BoardController;
        let rdm = Math.floor(Math.random() * positions.length - 1) + 1;
        if(!BoardController.IsFull() && !GameController.gameFinished){
            while(true){
                if(positions[rdm] == empty){
                    positions[rdm] = computer;
                    this.PerformPlacement(rdm);
                    break;
                } else {
                    rdm = Math.floor(Math.random() * positions.length - 1) + 1;
                }
            }
        }

        BoardController.HandleWinner();
    },

    PerformPlacement: function(e){
        MessageController.SetMessage(`Computer moves. Cell: ${e + 1}`);
        const position = document.querySelector(`#b${e}`);
        position.parentElement.innerHTML = COMPUTER_CHIP;
        BoardController.positions[e] = BoardController.computer;
    }

};


const MessageController = {

    field: document.querySelector("#message"),

    SetMessage: function(e){
        this.field.innerHTML = e;
    },

    Clear: function(){
        this.field.innerHTML = "";
    }
};

window.onload = function(){
    
    document.querySelector("#start").onclick = function(){ 
        const { gameStarted } = GameController;
        if(!gameStarted){
            GameController.Init();
        }else{
            console.log("Game is running");
        }
    };

    document.querySelector("#restart").onclick = function(){

        const { gameGrid, gameStarted, gameFinished, positions } = InitialState;
        const gamegrid = document.querySelector("#game-grid");

        // recover the initial state of the game
        gamegrid.innerHTML = gameGrid;
        GameController.gameStarted = gameStarted;
        GameController.gameFinished = gameFinished;
        BoardController.positions = [0,0,0,0,0,0,0,0,0];

        // clear console messages
        MessageController.Clear();
        console.clear();

        // starts the game again
        GameController.Init();
    }
};
