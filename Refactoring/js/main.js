let counter = 0;
//! przeżucić counter
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
        this.pointsArray = create2dArray(8, 10);
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
        this.createBoard(8, 10);
        this.applyPoints();
        this.createField();
    }

    this.gameStart = function () {
        this.botGame = true;
        this.bestGhost = new ghostMoves();
        this.bestPlayer = new ghostMoves();
        this.gameOn = true;
        this.suicideBotGate = 0;
        this.suicideBotWall = 0;
        this.player = Boolean(Math.floor(Math.random() * 2));
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
        if (!this.gameOn) return;

        if (this.player == true) {
            this.color = "blue";
        }
        else {
            this.color = "red";
        }

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
                                if (!wallHit)
                                    this.player = !this.player;

                                for (let k = 0; k < this.curPoint.moveTable.length; k++) {
                                    for (let l = 0; l < this.curPoint.moveTable.length; l++) {
                                        if (this.curPoint.moveTable[k][l] != 0) continue;
                                        else {
                                            if (this.botGame == true && !wallHit) {
                                                // this.canvas.removeEventListener('mousemove', this.mouseMoveEvent);
                                                // this.canvas.removeEventListener('click', this.clickEvent);
                                                // let newGhost = new ghostMoves();
                                                // // let tmpPoint = copyObj(curPoint);
                                                // this.checkBotMoves(newGhost, this.curPoint);
                                                // let startDrawGhost = setInterval(() => { this.botDraw(startDrawGhost); }, 400);
                                                // this.canvas.addEventListener('mousemove', this.mouseMoveEvent);
                                                // this.canvas.addEventListener('click', this.clickEvent);
                                                // this.player = !this.player;
                                                // this.bestGhost.enemyGateX = 100;
                                                // this.bestGhost.enemyGateY = 100;
                                                // this.bestGhost.awayGateX = 100;

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
        this.ctx.arc(y * this.scale + this.wallLineWidth / 2 + this.marginXY / 3, x * this.scale + this.wallLineWidth / 2 + this.marginXY / 3, 15, 0, Math.PI * 2, false);
        this.ctx.fill();
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
            if (this.suicideWall == 1) this.gameEnd(true);
            clearInterval(startDrawGhost);
        }

    }

    this.checkPlayerMoves = function (nowGhost, tmpPoint) {
        let enemyGatePoint = 0;
        let ownGatePoint = 0;
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
                        if (j == ownGatePoint) {
                            nowGhost.enemyGateX = this.pointsArray[i].length;
                            bestPlayer = Object.assign({}, nowGhost);
                            return true;
                        }
                        // if (j == this.pointsArray[i].length)
                        //     break;
                        nowGhost.enemyGateX = (enemyGatePoint - this.pointsArray[i][j].y);
                        // nowGhost.enemyGateY = Math.abs(enemyGatePoint.y - this.pointsArray[i][j].y);
                        // this.pointsArray[i][j].ghostWall = true;
                        this.pointsArray[tmpPoint.x][tmpPoint.y].moveTable[i - tmpPoint.x + 1][j - tmpPoint.y + 1] = 1;
                        this.pointsArray[i][j].moveTable[2 - (i - tmpPoint.x + 1)][2 - (j - tmpPoint.y + 1)] = 1;

                        if (this.pointsArray[i][j].wall && !(i == tmpPoint.y && j == tmpPoint.x + 1)) {
                            // let newPoint = copyObj(this.pointsArray[i][j]);
                            let newGhost = Object.assign({}, nowGhost);

                            if (this.checkPlayerMoves(newGhost, this.pointsArray[i][j]) == true) {
                                // this.pointsArray[i][j].ghostWall = this.pointsArray[i][j].wall;
                                this.pointsArray[tmpPoint.x][tmpPoint.y].moveTable[i - tmpPoint.x + 1][j - tmpPoint.y + 1] = 0;
                                this.pointsArray[i][j].moveTable[2 - (i - tmpPoint.x + 1)][2 - (j - tmpPoint.y + 1)] = 0;
                                return true;
                            }
                        }
                        else
                            if (nowGhost.enemyGateX > this.bestPlayer.enemyGateX) {
                                this.bestPlayer = Object.assign({}, nowGhost);
                            }
                        // else {
                        //     if (nowGhost.enemyGateX == bestPlayer.enemyGateX)
                        //         if (nowGhost.enemyGateY < bestPlayer.enemyGateY)
                        //             bestPlayer = Object.assign({}, nowGhost);
                        // }
                        // this.pointsArray[i][j].ghostWall = this.pointsArray[i][j].wall;
                        this.pointsArray[tmpPoint.x][tmpPoint.y].moveTable[i - tmpPoint.x + 1][j - tmpPoint.y + 1] = 0;
                        this.pointsArray[i][j].moveTable[2 - (i - tmpPoint.x + 1)][2 - (j - tmpPoint.y + 1)] = 0;
                    }
                }
    }

    this.debug = () => {
        console.log("a");
        // this.canvas.removeEventListener('mousemove', this.mouseMoveEvent);
        // this.canvas.removeEventListener('click', this.clickEvent);
        let newGhost = new ghostMoves();
        // let tmpPoint = copyObj(curPoint);
        this.checkBotMoves(newGhost, this.curPoint);
        let startDrawGhost = setInterval(() => { this.botDraw(startDrawGhost); }, 400);
        // this.canvas.addEventListener('mousemove', this.mouseMoveEvent);
        // this.canvas.addEventListener('click', this.clickEvent);
        // this.player = !this.player;
        this.bestGhost.enemyGateX = 100;
        this.bestGhost.enemyGateY = 100;
        this.bestGhost.awayGateX = 100;
    }

    this.checkBotMoves = function (nowGhost, tmpPoint) {
        let enemyGatePoint = 0;
        let ownGatePoint = 0;
        let winOrLose = 0;
        if (this.player == true) {
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
                            nowGhost.pointsTab.push(new Coordinates(this.pointsArray[i][j].x, this.pointsArray[i][j].y))
                            nowGhost.enemyGateX = 0;
                            this.bestGhost = JSON.parse(JSON.stringify(nowGhost));
                            return true;
                        }
                        if (j == ownGatePoint) {
                            nowGhost.pointsTab.pop();
                            this.suicideGate = new Coordinates(this.pointsArray[i][j].x, this.pointsArray[i][j].y);
                            nowGhost.pointsTab.push(this.suicideGate);
                            break;
                        }
                        nowGhost.pointsTab.push(new Coordinates(this.pointsArray[i][j].x, this.pointsArray[i][j].y))
                        nowGhost.enemyGateX = Math.abs(enemyGatePoint - this.pointsArray[i][j].y);
                        // nowGhost.enemyGateY = Math.abs(enemyGatePoint.y - this.pointsArray[i][j].y);
                        // this.pointsArray[i][j].ghostWall = true;
                        this.pointsArray[tmpPoint.x][tmpPoint.y].moveTable[i - tmpPoint.x + 1][j - tmpPoint.y + 1] = 1;
                        this.pointsArray[i][j].moveTable[2 - (i - tmpPoint.x + 1)][2 - (j - tmpPoint.y + 1)] = 1;
                        // let newPoint = copyObj(this.pointsArray[i][j]);
                        let newGhost = Object.assign({}, nowGhost);
                        // let suicideWall = 0;
                        if (this.pointsArray[i][j].wall) {
                            // loop1:
                            // for (let k = 0; k < 3; k++) {
                            //     for (let l = 0; l < 3; l++) {
                            //         if (tmpPoint.moveTable[k][l] == 0) {
                            //             // suicideWall = 1;
                            //             break loop1;
                            //         }
                            //     }
                            // }
                            let winOrLose = this.checkBotMoves(newGhost, this.pointsArray[i][j])
                            if (winOrLose == true)
                                return true;
                        }
                        else {
                            this.checkPlayerMoves(newGhost, this.pointsArray[i][j])
                            // winFlag = false;
                            // loadBoardState();
                            if (nowGhost.enemyGateX < this.bestGhost.enemyGateX) {
                                this.bestGhost = JSON.parse(JSON.stringify(nowGhost));
                                // this.bestGhost.awayGateX = this.bestPlayer.enemyGateX;
                            }
                            // else {
                            //     if (nowGhost.enemyGateX == this.bestGhost.enemyGateX) {
                            //             this.bestGhost = JSON.parse(JSON.stringify(nowGhost));
                            //             this.bestGhost.awayGateX = bestPlayer.enemyGateX;
                            // else
                            //     if (nowGhost.enemyGateY < bestGhost.enemyGateY)
                            //         bestGhost = JSON.parse(JSON.stringify(nowGhost));
                            // }

                            // }
                            // if (nowGhost.enemyGateX < this.bestGhost.enemyGateX) {
                            //     if (bestPlayer.enemyGateX <= this.bestGhost.awayGateX) {
                            //         this.bestGhost = JSON.parse(JSON.stringify(nowGhost));
                            //         this.bestGhost.awayGateX = bestPlayer.enemyGateX;
                            //     }
                            // }
                            // else {
                            //     if (nowGhost.enemyGateX == this.bestGhost.enemyGateX) {
                            //         if (bestPlayer.enemyGateX < this.bestGhost.awayGateX) {
                            //             this.bestGhost = JSON.parse(JSON.stringify(nowGhost));
                            //             this.bestGhost.awayGateX = bestPlayer.enemyGateX;
                            //         }
                            //         // else
                            //         //     if (nowGhost.enemyGateY < bestGhost.enemyGateY)
                            //         //         bestGhost = JSON.parse(JSON.stringify(nowGhost));
                            //     }

                            // }
                            // bestPlayer.enemyGateX = 0;
                            // bestPlayer.enemyGateY = 0;
                            // bestPlayer.awayGateX = 100;
                        }
                        if (winOrLose != false) {
                            this.pointsArray[i][j].ghostWall = false;
                            this.pointsArray[tmpPoint.x][tmpPoint.y].moveTable[i - tmpPoint.x + 1][j - tmpPoint.y + 1] = 0;
                            this.pointsArray[i][j].moveTable[2 - (i - tmpPoint.x + 1)][2 - (j - tmpPoint.y + 1)] = 0;
                            nowGhost.pointsTab.pop();
                            return;
                        }

                    }
                }
        if (this.suicideGate != 0) {

            this.bestGhost = JSON.parse(JSON.stringify(nowGhost));
        }
        else {
            this.suicideWall = 1;
            this.bestGhost = JSON.parse(JSON.stringify(nowGhost));
        }

        return false;

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


let game = new Game();
game.gamePrepare();
game.gameStart();


let btn = document.querySelector(".btn");
btn.addEventListener("click", game.debug);