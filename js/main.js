           

window.onload = function () {
    paint();
    document.getElementById("start").onclick = function () { start(); };
    document.getElementById("restart").onclick = function () { restart();};
    document.getElementById("move").onclick = function () { var number = document.getElementById("number").value; move(number); };
}

// variables
var text = document.getElementById("text");
var table = document.getElementById("table");
var gameStarted = false;

// objects
var board = {
    positions : [0, 0, 0, 0, 0, 0, 0, 0, 0],
        isEmpty: function (x) {
        if (this.positions[x] == 0) { return true } else { return false }
    },
    isFull: function () {
        var aux = 0;
        for (var i = 0; i < this.positions.length; i++) {
            if (this.isEmpty(i) != true) {aux ++}
        }
        if (aux == this.positions.length) { this.gameFinished = true; return true } else {return false}
    },
    gameFinished: false
    }

var player = {
    name: "Player",
    chip: 1,
    starts: false
}

var IA = {
    name: "PC",
    chip: 2,
    starts: false,
    move: function () {moveIA()}
}

// functions
function start() {
    if (!gameStarted) {
        gameStarted = true;
        movements();

        if (IA.starts) {
            IA.move();
        } else {
            text.innerHTML = "<p>" + player.name + " moves.</p>";
        }

        paint();
    }
    else {
        text.innerHTML = "<p>The game has already started!</p>";
    }
}

// restart game
function restart() {
    gameStarted = false;
    board.gameFinished = false;
    table.innerHTML = "";
    text.innerHTML = "";
    IA.starts = false;
    player.starts = false;
    board.positions = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    start();
}

function movements() {
    var i = Math.floor(Math.random() * 2);

    if (i == 1) {
        player.starts = true;
    } else {
        IA.starts = true;
    }
}

// movements performed by IA
function moveIA() {
    text.innerHTML = "<p>" + IA.name + " moves.</p>";
    var pos = Math.floor(Math.random() * board.positions.length);
    var placed = false;

    while (!placed && !board.isFull()) {
        if (board.isEmpty(pos)) {
            board.positions[pos] = IA.chip;
            placed = true;
        }
        else {
        pos = Math.floor(Math.random() * board.positions.length);
        }
    }
}

/**
* Board positions
* 0, 1, 2
* 3, 4, 5
* 6, 7, 8
* */
function checker() {
    var pos = board.positions;
    //check rows
    if (checkRow(pos[0], pos[1], pos[2])) { return pos[0]; }
    if (checkRow(pos[3], pos[4], pos[5])) { return pos[3]; }
    if (checkRow(pos[6], pos[7], pos[8])) { return pos[6]; }

    // check cols
    if (checkRow(pos[0], pos[3], pos[6])) { return pos[0]; }
    if (checkRow(pos[1], pos[4], pos[7])) { return pos[1]; }
    if (checkRow(pos[2], pos[5], pos[8])) { return pos[2]; }

    //check diagonals 
    if (checkRow(pos[0], pos[4], pos[8])) { return pos[0]; }
    if (checkRow(pos[2], pos[4], pos[6])) { return pos[2]; }
}

function checkRow(pos1, pos2, pos3) {
    if (pos1 != 0 && pos2 != 0 && pos3 != 0) {
        if ((pos1 == pos2) && (pos2 == pos3)) {
            return true;
        } else {
             return false;
        }
    } else {
        return false;
    }
}

// checks for winner
function winnerHandler() {
    if (checker() == 1) {
        text.innerHTML = "<p>" + player.name + " wins!</p>";
        return true;
    } else if (checker() == 2) {
        text.innerHTML = "<p>" + IA.name + " wins!</p>";
        return true;
    } else {
        return false;
    }
}

function move(x) {
    if (x != null) {
        var placed = false;
        var iaMove = false;
        if (!placed && !board.gameFinished) {
            if (board.isEmpty(x)) {
                board.positions[x] = player.chip;
                placed = true;
                iaMove = true;
                paint();
            }
            else { text.innerHTML = "<p>The position is not valid, select another position.</p>";}
        }
        // check for winner
        if (winnerHandler()) {
            board.gameFinished = true;
        }
        if (iaMove && !board.gameFinished) {
            IA.move();
            iaMove = false;
            // check for winner again
            if (winnerHandler()) {
                board.gameFinished = true;
            }
            paint();
        }
    }
    else { text.innerHTML = "<p>Select a number first!</p>"; }
}

// gets player/pc chips
function getChip(x) {
    var positions = board.positions;
    var player = "<span>X</span>";
    var enemy = "<span>O</span>";
    var empty = "<span>--</span>";

    if (positions[x] == 1) {
        return player;
    }
    else if (positions[x] == 2) {
        return enemy;
    }
    else {
        return empty;
    }
}

// draws the board (HTML Table)
function paint() {
                
    table.innerHTML="<table id='board'>" +
                        "<tr>" +
                            "<td>" + getChip(0) + "</td>" + 
                            "<td>" + getChip(1) + "</td>" + 
                            "<td>" + getChip(2) + "</td>" + 
                        "</tr>" +
                        "<tr>" +
                            "<td>" + getChip(3) + "</td>" +
                            "<td>" + getChip(4) + "</td>" +
                            "<td>" + getChip(5) + "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td>" + getChip(6) + "</td>" +
                            "<td>" + getChip(7) + "</td>" +
                            "<td>" + getChip(8) + "</td>" +
                        "</tr>" +
                    "</table > ";

    if (board.gameFinished) {
        text.innerHTML = "<p>Game over.</p>";
    }
}