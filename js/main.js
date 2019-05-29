let counter = 0;
let tour = false;
let ball = document.getElementById('ball');
//! przeżucić counter
var Player = function(name,color,id) {
    this.name = name;
    this.color = color;
    this.id = id;
}

//! this.player == TRUE => Tura player2
//! this.player == FALSE => Tura player1 //BOT TO DOMYŚLNIE PLAYER2

var players = [];

function Game() {

    //? this.playerTurn = true;
    //! this.enemyGatePoint;
    //? this.bestGhost;
    //? this.bestPlayer;
    //? this.startDrawGhost;
    //? this.counter = 0;
    //? this.winFlag = false;

    //! let gatewayArray = create2dArray(1, 2);
    //? this.allowPoints = create2dArray(2, 2);

    //? this.gameOn = false;

    this.boardWidth = 600;
    this.boardHeight = 400;
    this.canvasWidth = 1800;
    this.canvasHeight = 1210;
    this.columnsNumber = 12;
    this.rowsNumber = 8;

    //* Metody przygotowania gry
    this.createBoard = function (rows, columns) {
        this.rows = rows;
        this.columns = columns;

        this.boardContener = document.getElementById("board");
        this.canvas = document.createElement("canvas");
        this.boardContener.style.width = this.boardWidth;
        this.boardContener.style.height = this.boardHeight;
        this.canvas.width = 1800;
        this.canvas.height = 1210;
        this.boardContener.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
    }

    this.applyPoints = function () {
        this.pointsArray = create2dArray(this.rowsNumber,this.columnsNumber);
        for (let x = 0; x <= this.rows; x++) {
            for (let y = 0; y <= this.columns; y++) {
                if (y >= 1 && y <= this.columns - 1)
                    this.pointsArray[x][y] = new Point(x, y);
                else if (x >= this.rows / 2 - 1 && x <= this.rows / 2 + 1)
                    this.pointsArray[x][y] = new Point(x, y);
                if ((x == 0 || x == this.rows) && (y != 0 && y != this.columns)) {
                    this.pointsArray[x][y].wall = true;
                    if (x == 0)
                        this.pointsArray[x][y].moveTable = [[2, 2, 2], [1, 2, 1], [0, 0, 0]];
                    if (x == this.rows)
                        this.pointsArray[x][y].moveTable = [[0, 0, 0], [1, 2, 1], [2, 2, 2]];
                }
                else if ((y == 1 || y == this.columns - 1) && !(x == this.rows / 2)) {
                    this.pointsArray[x][y].wall = true;
                    if (y == 1)
                        this.pointsArray[x][y].moveTable = [[2, 1, 0], [2, 2, 0], [2, 1, 0]];
                    if (y == this.columns - 1)
                        this.pointsArray[x][y].moveTable = [[0, 1, 2], [0, 2, 2], [0, 1, 2]];
                }
                else if ((y == 0 || y == this.columns) && (x >= this.rows / 2 - 1 && x <= this.rows / 2 + 1)) {
                    this.pointsArray[x][y].wall = true;
                }
            }
        }

        this.pointsArray[0][1].moveTable = [[2, 2, 2], [2, 2, 1], [2, 1, 0]];
        this.pointsArray[0][this.columns - 1].moveTable = [[2, 2, 2], [1, 2, 2], [0, 1, 2]];
        this.pointsArray[this.rows / 2 - 1][1].moveTable = [[2, 1, 0], [1, 2, 0], [0, 0, 0]];
        this.pointsArray[this.rows / 2 - 1][this.columns - 1].moveTable = [[0, 1, 2], [0, 2, 1], [0, 0, 0]];
        this.pointsArray[this.rows / 2 + 1][1].moveTable = [[0, 0, 0], [1, 2, 0], [2, 1, 0]];
        this.pointsArray[this.rows / 2 + 1][this.columns - 1].moveTable = [[0, 0, 0], [0, 2, 1], [0, 1, 2]];
        this.pointsArray[this.rows][1].moveTable = [[2, 1, 0], [2, 2, 1], [2, 2, 2]];
        this.pointsArray[this.rows][this.columns - 1].moveTable = [[0, 1, 2], [1, 2, 2], [2, 2, 2]];

        this.pointsArray[this.rows / 2 - 1][0].moveTable = [[2, 2, 1], [2, 2, 1], [2, 1, 0]];
        this.pointsArray[this.rows / 2 + 1][0].moveTable = [[2, 1, 0], [2, 2, 1], [2, 2, 1]];
        this.pointsArray[this.rows / 2 - 1][this.columns].moveTable = [[1, 2, 2], [1, 2, 2], [0, 1, 2]];
        this.pointsArray[this.rows / 2 + 1][this.columns].moveTable = [[0, 1, 2], [1, 2, 2], [1, 2, 2]];
    }

    this.createField = function () {

        this.halfRows = this.rows / 2;
        this.halfColumns = this.columns / 2;

        this.marginXY = 15;
        this.wallLineWidth = 20;
        this.noLineWidth = 5;

        this.scale = 147;
        this.color = 'blue';

        this.ctx.fillStyle = "#84b369";
        this.fillWidth = this.canvasWidth/this.columnsNumber+this.marginXY;
        this.ctx.fillRect(this.fillWidth, this.marginXY,this.canvasWidth-2*this.fillWidth,this.canvasHeight-this.marginXY*2);
        this.ctx.fillRect(this.marginXY,3*(this.canvasHeight/this.rowsNumber),this.fillWidth,2*(this.canvasHeight/this.rowsNumber)-this.marginXY);
        this.ctx.fillRect(this.canvasWidth-2*this.fillWidth,3*(this.canvasHeight/this.rowsNumber),this.fillWidth*2-this.marginXY,2*(this.canvasHeight/this.rowsNumber)-this.marginXY);

        this.curPoint = this.pointsArray[this.halfRows][this.halfColumns];
        // this.posX = this.curPoint.x * this.scale + this.scale + this.wallLineWidth / 2 + this.marginXY / 3;
        // this.posY = this.curPoint.y * this.scale + this.wallLineWidth / 2 + this.marginXY / 3;

        for (let x = 0; x <= this.rows; x++) {
            for (let y = 0; y <= this.columns; y++) {
                if (y != 0 && y != this.columns) {
                    if (x < this.rows) {
                        if (this.pointsArray[x][y].moveTable[2][1] == 0) {
                            this.ctx.lineWidth = this.noLineWidth;
                            this.drawLine(this.pointsArray[x][y].x, this.pointsArray[x][y].y, this.pointsArray[x + 1][y].x, this.pointsArray[x + 1][y].y);
                        }
                        if (this.pointsArray[x][y].moveTable[2][1] == 1) {
                            this.ctx.lineWidth = this.wallLineWidth;
                            this.drawLine(this.pointsArray[x][y].x, this.pointsArray[x][y].y, this.pointsArray[x + 1][y].x, this.pointsArray[x + 1][y].y);
                        }
                    }
                    if (this.pointsArray[x][y].moveTable[1][2] == 0) {
                        this.ctx.lineWidth = this.noLineWidth;
                        this.drawLine(this.pointsArray[x][y].x, this.pointsArray[x][y].y, this.pointsArray[x][y + 1].x, this.pointsArray[x][y + 1].y);
                    }
                    if (this.pointsArray[x][y].moveTable[1][2] == 1) {
                        this.ctx.lineWidth = this.wallLineWidth;
                        this.drawLine(this.pointsArray[x][y].x, this.pointsArray[x][y].y, this.pointsArray[x][y + 1].x, this.pointsArray[x][y + 1].y);
                    }
                }
                else if (x >= this.rows / 2 - 1 && x <= this.rows / 2) {
                    if (y == 0 || y == this.columns) {
                        this.ctx.lineWidth = this.wallLineWidth;
                        this.drawLine(this.pointsArray[x][y].x, this.pointsArray[x][y].y, this.pointsArray[x + 1][y].x, this.pointsArray[x + 1][y].y);
                    }
                    if (y == 1 || y == this.columns - 1) {
                        this.ctx.lineWidth = this.noLineWidth;
                        this.drawLine(this.pointsArray[x][y].x, this.pointsArray[x][y].y, this.pointsArray[x + 1][y].x, this.pointsArray[x + 1][y].y);
                    }
                    if (y == 0 && x != this.rows / 2) {
                        this.ctx.lineWidth = this.wallLineWidth;
                        this.drawLine(this.pointsArray[x][y].x, this.pointsArray[x][y].y, this.pointsArray[x][y + 1].x, this.pointsArray[x][y + 1].y);
                        this.drawLine(this.pointsArray[x + 2][y].x, this.pointsArray[x + 2][y].y, this.pointsArray[x + 2][y + 1].x, this.pointsArray[x + 2][y + 1].y);
                    }
                    if (y == 0 && x == this.rows / 2) {
                        this.ctx.lineWidth = this.noLineWidth;
                        this.drawLine(this.pointsArray[x][y].x, this.pointsArray[x][y].y, this.pointsArray[x][y + 1].x, this.pointsArray[x][y + 1].y);
                    }
                }
            }
        }

        this.myImgData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawPoint(this.pointsArray[this.halfRows][this.halfColumns].x, this.pointsArray[this.halfRows][this.halfColumns].y);
        this.canvas.addEventListener('mousemove', this.mouseMoveEvent);
        this.canvas.addEventListener('click', this.clickEvent);
        this.gameOn = false;
    }

    this.saveBoardState = function (i, j) {
        this.myImgData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.curPoint.moveTable[i - this.curPoint.x + 1][j - this.curPoint.y + 1] = 1;
        this.pointsArray[i][j].moveTable[2 - (i - this.curPoint.x + 1)][2 - (j - this.curPoint.y + 1)] = 1;
        this.curPoint = this.pointsArray[i][j];
    }

    this.loadBoardState = function () {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.putImageData(this.myImgData, 0, 0);
        this.ctx.fillStyle = "black";
        this.drawPoint(this.curPoint.x, this.curPoint.y);
    }

    //* Metody gry
    this.gamePrepare = function () {
        this.createBoard(8, 12);
        this.applyPoints();
        this.createField();
    }

    this.gameStart = function () {
        this.botGame = false;
        if(this.botGame) {
            players[1] = new Player("Andrzej","red");
        }
        this.bestGhost = new ghostMoves();
        this.bestPlayer = new ghostMoves();
        this.gameOn = true;
        this.suicideGate = 0;
        this.suicideWall = 0;

        players[0] = new Player("Kudłaty","pink");
        players[1] = new Player("Shrek","orange");
        $('.name[data-id="0"]').html(players[0].name);
        $('.name[data-id="1"]').html(players[1].name);

        this.player = false;
        this.curPoint.wall = true;
    }

    this.gameEnd = function (bool) {
        this.gameOn = false;
        if (this.player == true && bool)
            console.log("Wygrywa gracz czerwony");
        else if (bool)
            console.log("Wygrywa gracz niebieski");
    }

    //* Metody do eventów
    this.mouseMoveEvent = e => {
        if (!this.gameOn){
            return;
        };

        this.color = players[+this.player].color;

        // if (this.player) {
        //     this.color = player[0].color;
        // }
        // else {
        //     this.color = "red";
        // }

        let mousePos = getMousePos(this.canvas, event);
        let przelicznik_na_x = this.canvasWidth / this.boardWidth;
        let przelicznik_na_y = this.canvasHeight / this.boardHeight;
        let cord_X = mousePos.x * przelicznik_na_x;
        let cord_Y = mousePos.y * przelicznik_na_y;

        ///PUNKTY MAPY///
        for (let i = 0; i < this.pointsArray.length; i++)
            for (let j = 0; j < this.pointsArray[i].length; j++) {

                if (this.pointsArray[i][j] != undefined) {
                    if ((this.pointsArray[i][j].y * this.scale + this.wallLineWidth / 2 <= cord_X + this.scale / 2 && this.pointsArray[i][j].x * this.scale + this.wallLineWidth / 2 <= cord_Y + this.scale / 2)
                        && (this.pointsArray[i][j].y * this.scale + this.wallLineWidth / 2 >= cord_X - this.scale / 2 && this.pointsArray[i][j].x * this.scale + this.wallLineWidth / 2 >= cord_Y - this.scale / 2))
                        if ((i >= this.curPoint.x - 1 && i <= this.curPoint.x + 1) && (j >= this.curPoint.y - 1 && j <= this.curPoint.y + 1))
                            if (this.curPoint.moveTable[i - this.curPoint.x + 1][j - this.curPoint.y + 1] == 0) {
                                this.loadBoardState();
                                this.ctx.fillStyle = this.color;
                                this.drawPoint(this.pointsArray[i][j].x, this.pointsArray[i][j].y);
                            }
                }
            }
    }

    this.clickEvent = e => {
        if (!this.gameOn) return;

        let mousePos = getMousePos(this.canvas, event);
        let cord_X = mousePos.y * this.canvasWidth / this.boardWidth; //*Tak ma być
        let cord_Y = mousePos.x * this.canvasHeight / this.boardHeight; //*Tak ma być
        let wallHit = false;

        for (let i = 0; i < this.pointsArray.length; i++) {
            for (let j = 0; j < this.pointsArray[i].length; j++) {
                if (this.pointsArray[i][j] != undefined) {
                    if ((this.pointsArray[i][j].x * this.scale + this.wallLineWidth / 2 <= cord_X + this.scale / 2 && this.pointsArray[i][j].y * this.scale + this.wallLineWidth / 2 <= cord_Y + this.scale / 2)
                        && (this.pointsArray[i][j].x * this.scale + this.wallLineWidth / 2 >= cord_X - this.scale / 2 && this.pointsArray[i][j].y * this.scale + this.wallLineWidth / 2 >= cord_Y - this.scale / 2)) {
                        if ((i >= this.curPoint.x - 1 && i <= this.curPoint.x + 1) && (j >= this.curPoint.y - 1 && j <= this.curPoint.y + 1)) {
                            if (this.curPoint.moveTable[i - this.curPoint.x + 1][j - this.curPoint.y + 1] == 0) {
                                this.ctx.fillStyle = "blue";
                                this.drawPoint(this.pointsArray[i][j].x, this.pointsArray[i][j].y)
                                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                                this.ctx.putImageData(this.myImgData, 0, 0);
                                this.ctx.strokeStyle = this.color;
                                this.drawLine(this.curPoint.x, this.curPoint.y, this.pointsArray[i][j].x, this.pointsArray[i][j].y)
                                this.saveBoardState(i, j);
                                this.loadBoardState();

                                if (this.pointsArray[i][j].wall)
                                    wallHit = true;
                                this.pointsArray[i][j].wall = true;

                                if ((this.curPoint.x >= this.halfRows - 1 && this.curPoint.x <= this.halfRows + 1) && this.curPoint.y == this.columns) {
                                    console.log("Wygrywa gracz niebieski");
                                    this.gameEnd(false);
                                    return;
                                }

                                if ((this.curPoint.x >= this.halfRows - 1 && this.curPoint.x <= this.halfRows + 1) && this.curPoint.y == 0) {
                                    console.log("Wygrywa gracz czerwony");
                                    this.gameEnd(false);
                                    return;
                                }
                                if (!wallHit){
                                    this.player = changeRound(this.player);
                                }

                                for (let k = 0; k < this.curPoint.moveTable.length; k++) {
                                    for (let l = 0; l < this.curPoint.moveTable.length; l++) {
                                        if (this.curPoint.moveTable[k][l] != 0) continue;
                                        else {
                                            if (this.botGame == true && !wallHit) {
                                                this.canvas.removeEventListener('mousemove', this.mouseMoveEvent);
                                                this.canvas.removeEventListener('click', this.clickEvent);
                                                let newGhost = new ghostMoves();
                                                this.checkBotMoves(newGhost, this.curPoint);
                                                if (this.bestGhost.pointsTab.length == 0) {
                                                    if (this.suicideWall != 0) {
                                                        this.bestGhost = this.suicideWall;
                                                        this.suicideWall = 1;
                                                    }

                                                    if (this.suicideGate != 0) {
                                                        this.bestGhost = this.suicideGate;
                                                    }
                                                }
                                                let startDrawGhost = setInterval(() => { this.botDraw(startDrawGhost); }, 400);
                                                this.bestGhost.enemyGateX = 100;
                                                this.bestGhost.enemyGateY = 100;
                                                this.bestGhost.awayGateX = 100;
                                                this.canvas.addEventListener('mousemove', this.mouseMoveEvent);
                                                this.canvas.addEventListener('click', this.clickEvent);
                                                this.player = changeRound(this.player);
                                            }
                                            return;
                                        }
                                    }
                                }
                                this.gameEnd(true);
                            }
                        }
                    }
                }
            }
        }
    }

    //* Metody pomocnicze
    this.drawPoint = function (x, y) {
        this.ctx.beginPath();
        this.ctx.drawImage(ball,y * this.scale + this.wallLineWidth / 2 - 25, x * this.scale + this.wallLineWidth / 2 - 25);
        //this.ctx.arc(y * this.scale + this.wallLineWidth / 2 + this.marginXY / 3, x * this.scale + this.wallLineWidth / 2 + this.marginXY / 3, 15, 0, Math.PI * 2, false);
        //this.ctx.fill();
        this.ctx.closePath();
    }

    this.drawLine = function (x1, y1, x2, y2) {
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(y1 * this.scale + this.marginXY, (x1) * this.scale + this.marginXY);
        this.ctx.lineTo(y2 * this.scale + this.marginXY, (x2) * this.scale + this.marginXY);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    this.drawGameLine = function (x1, y1, x2, y2) {
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(y1 * this.scale + this.marginXY, x1 * this.scale + this.marginXY);
        this.ctx.lineTo(x2 * this.scale + this.scale + this.wallLineWidth / 2 + this.marginXY / 3, y2 * this.scale + this.wallWidth / 2 + this.marginXY / 3)
        this.ctx.stroke();
        this.ctx.closePath();
    }

    //*Metody bota
    this.botDraw = function (startDrawGhost) {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.putImageData(this.myImgData, 0, 0);
        this.ctx.strokeStyle = "black";
        this.drawLine(this.curPoint.x, this.curPoint.y, this.bestGhost.pointsTab[counter].x, this.bestGhost.pointsTab[counter].y)


        this.saveBoardState(this.bestGhost.pointsTab[counter].x, this.bestGhost.pointsTab[counter].y);
        this.loadBoardState();
        this.pointsArray[this.bestGhost.pointsTab[counter].x][this.bestGhost.pointsTab[counter].y].wall = true;
        // this.pointsArray[this.bestGhost.pointsTab[counter].y][this.bestGhost.pointsTab[counter].x].ghostWall = true;
        counter++;
        if (counter == this.bestGhost.pointsTab.length) {
            counter = 0;
            if ((this.curPoint.x >= this.halfRows - 1 && this.curPoint.x <= this.halfRows + 1) && this.curPoint.y == this.columns) {
                console.log("Wygrywa gracz niebieski");
                this.gameEnd(false);
            }

            if ((this.curPoint.x >= this.halfRows - 1 && this.curPoint.x <= this.halfRows + 1) && this.curPoint.y == 0) {
                console.log("Wygrywa gracz czerwony");
                this.gameEnd(false);
            }

            if (this.suicideWall == 1) {
                this.gameEnd(true);
            }
            this.bestGhost.pointsTab = [];

            clearInterval(startDrawGhost);
        }

    }

    this.checkPlayerMoves = function (nowGhost, tmpPoint) {
        let enemyGatePoint = 0;
        let ownGatePoint = 0;
        this.bestPlayer.enemyGateX = 0;
        if (this.player == false) {
            enemyGatePoint = this.columns;
        }
        else {
            ownGatePoint = 10;
        }

        for (let i = tmpPoint.x - 1; i <= tmpPoint.x + 1; i++)
            for (let j = tmpPoint.y - 1; j <= tmpPoint.y + 1; j++)
                if (this.pointsArray[i] != undefined && this.pointsArray[i][j] != undefined) {
                    if (tmpPoint.moveTable[i - tmpPoint.x + 1][j - tmpPoint.y + 1] == 0) {
                        if (j == enemyGatePoint) {
                            nowGhost.enemyGateX = this.pointsArray[i].length;
                            this.bestPlayer = Object.assign({}, nowGhost);
                            return true;
                        }
                        nowGhost.enemyGateX = Math.abs(ownGatePoint - this.pointsArray[i][j].y);
                        nowGhost.enemyGateY = Math.abs(this.rows / 2 - this.pointsArray[i][j].x);
                        this.pointsArray[tmpPoint.x][tmpPoint.y].moveTable[i - tmpPoint.x + 1][j - tmpPoint.y + 1] = 1;
                        this.pointsArray[i][j].moveTable[2 - (i - tmpPoint.x + 1)][2 - (j - tmpPoint.y + 1)] = 1;

                        if (this.pointsArray[i][j].wall) {// && !(i == tmpPoint.y && j == tmpPoint.x + 1)) {
                            let newGhost = Object.assign({}, nowGhost);

                            if (this.checkPlayerMoves(newGhost, this.pointsArray[i][j]) == true) {
                                this.pointsArray[tmpPoint.x][tmpPoint.y].moveTable[i - tmpPoint.x + 1][j - tmpPoint.y + 1] = 0;
                                this.pointsArray[i][j].moveTable[2 - (i - tmpPoint.x + 1)][2 - (j - tmpPoint.y + 1)] = 0;
                                return true;
                            }
                        }
                        else
                            if (nowGhost.enemyGateX > this.bestPlayer.enemyGateX) {
                                this.bestPlayer = Object.assign({}, nowGhost);
                            }
                            else {
                                if (nowGhost.enemyGateX == this.bestPlayer.enemyGateX)
                                    if (nowGhost.enemyGateY < this.bestPlayer.enemyGateY)
                                        this.bestPlayer = Object.assign({}, nowGhost);
                            }
                        this.pointsArray[tmpPoint.x][tmpPoint.y].moveTable[i - tmpPoint.x + 1][j - tmpPoint.y + 1] = 0;
                        this.pointsArray[i][j].moveTable[2 - (i - tmpPoint.x + 1)][2 - (j - tmpPoint.y + 1)] = 0;
                    }
                }
    }

    // this.debug = () => {
    //     this.canvas.removeEventListener('mousemove', this.mouseMoveEvent);
    //     this.canvas.removeEventListener('click', this.clickEvent);
    //     let newGhost = new ghostMoves();
    //     this.checkBotMoves(newGhost, this.curPoint);
    //     if (this.bestGhost.pointsTab.length == 0) {
    //         if (this.suicideWall != 0) {
    //             this.bestGhost = this.suicideWall;
    //             this.suicideWall = 1;
    //         }

    //         if (this.suicideGate != 0) {
    //             this.bestGhost = this.suicideGate;
    //         }
    //     }
    //     let startDrawGhost = setInterval(() => { this.botDraw(startDrawGhost); }, 400);
    //     this.bestGhost.enemyGateX = 100;
    //     this.bestGhost.enemyGateY = 100;
    //     this.bestGhost.awayGateX = 100;
    //     this.canvas.addEventListener('mousemove', this.mouseMoveEvent);
    //     this.canvas.addEventListener('click', this.clickEvent);
    //     // this.player = !this.player;

    // }

    this.checkBotMoves = function (nowGhost, tmpPoint) {
        let enemyGatePoint = 0;
        let ownGatePoint = 0;
        let isMovePossible = 0;
        if (this.player == true) {
            enemyGatePoint = this.columns;
        }
        else {
            ownGatePoint = 10;
        }

        for (let i = tmpPoint.x - 1; i <= tmpPoint.x + 1; i++) {
            for (let j = tmpPoint.y - 1; j <= tmpPoint.y + 1; j++) {
                if (this.pointsArray[i] != undefined && this.pointsArray[i][j] != undefined) {
                    if (tmpPoint.moveTable[i - tmpPoint.x + 1][j - tmpPoint.y + 1] == 0) {
                        isMovePossible = 1;
                        if (j == enemyGatePoint) {
                            nowGhost.pointsTab.push(new Coordinates(this.pointsArray[i][j].x, this.pointsArray[i][j].y))
                            nowGhost.enemyGateX = 0;
                            this.bestGhost = JSON.parse(JSON.stringify(nowGhost));
                            return true;
                        }
                        if (j == ownGatePoint) {
                            nowGhost.pointsTab.push(new Coordinates(this.pointsArray[i][j].x, this.pointsArray[i][j].y))
                            this.suicideGate = JSON.parse(JSON.stringify(nowGhost));
                            nowGhost.pointsTab.pop();
                            continue;
                        }

                        nowGhost.pointsTab.push(new Coordinates(this.pointsArray[i][j].x, this.pointsArray[i][j].y))
                        nowGhost.enemyGateX = Math.abs(enemyGatePoint - this.pointsArray[i][j].y);
                        nowGhost.enemyGateY = Math.abs(this.rows / 2 - this.pointsArray[i][j].x);
                        this.pointsArray[tmpPoint.x][tmpPoint.y].moveTable[i - tmpPoint.x + 1][j - tmpPoint.y + 1] = 1;
                        this.pointsArray[i][j].moveTable[2 - (i - tmpPoint.x + 1)][2 - (j - tmpPoint.y + 1)] = 1;
                        let newGhost = Object.assign({}, nowGhost);
                        if (this.pointsArray[i][j].wall) {
                            if (this.checkBotMoves(newGhost, this.pointsArray[i][j]) == true)
                                return true;
                        }
                        else {
                            this.checkPlayerMoves(newGhost, this.pointsArray[i][j])
                            if (nowGhost.enemyGateX < this.bestGhost.enemyGateX) {
                                if (this.bestPlayer.enemyGateX <= this.bestGhost.awayGateX) {
                                    this.bestGhost = JSON.parse(JSON.stringify(nowGhost));
                                    this.bestGhost.awayGateX = this.bestPlayer.enemyGateX;
                                }
                            }
                            else {
                                if (nowGhost.enemyGateX == this.bestGhost.enemyGateX) {
                                    if (this.bestPlayer.enemyGateX < this.bestGhost.awayGateX) {
                                        this.bestGhost = JSON.parse(JSON.stringify(nowGhost));
                                        this.bestGhost.awayGateX = this.bestPlayer.enemyGateX;
                                    }
                                    else
                                        if (nowGhost.enemyGateY < this.bestGhost.enemyGateY)
                                            this.bestGhost = JSON.parse(JSON.stringify(nowGhost));
                                }

                            }
                            this.bestPlayer.enemyGateX = 0;
                            this.bestPlayer.enemyGateY = 0;
                            this.bestPlayer.awayGateX = 100;

                        }
                        this.pointsArray[tmpPoint.x][tmpPoint.y].moveTable[i - tmpPoint.x + 1][j - tmpPoint.y + 1] = 0;
                        this.pointsArray[i][j].moveTable[2 - (i - tmpPoint.x + 1)][2 - (j - tmpPoint.y + 1)] = 0;
                        nowGhost.pointsTab.pop();

                    }
                }
            }
        }
        if (isMovePossible == 0) {
            this.suicideWall = JSON.parse(JSON.stringify(nowGhost));
        }
    }
}

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.moveTable =
        [
            [0, 0, 0],
            [0, 2, 0],
            [0, 0, 0]
        ];
    this.wall = false;
}

function Coordinates(x, y) {
    this.x = x;
    this.y = y;
}

function ghostMoves() {
    this.pointsTab = [];
    this.enemyGateX = 100;
    this.enemyGateY = 100;
    this.awayGateX = 100;
}

function changeRound(player) {
    $('.name').each(i => {
        $(this).toggleClass('active');
    });

    return !player;
}


let game = new Game();
game.gamePrepare();
game.gameStart();


let btn = document.querySelector(".btn");
// btn.addEventListener("click", game.debug);