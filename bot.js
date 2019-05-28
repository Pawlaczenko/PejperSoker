
const graph = createGraph(8, 12);


let counter = 0;
//! przeżucić counter
function Game() {
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

    this.createField = function () {

        this.halfRows = this.rows / 2;
        this.halfColumns = this.columns / 2;

        this.marginXY = 15;
        this.wallLineWidth = 20;
        this.noLineWidth = 5;

        this.scale = 147;
        this.color = 'blue';

        //? this.curPoint = this.pointsArray[this.halfRows][this.halfColumns];
        for (let x = 0; x <= this.rows; x++) {
            for (let y = 0; y <= this.columns; y++) {
                if (graph.has(`${x}_${y}`)) {
                    for (const next of graph.get(`${x}_${y}`).out) {
                        if (next == `${x + 1}_${y}` || next == `${x}_${y + 1}`) {
                            this.ctx.lineWidth = this.noLineWidth;
                            this.drawLine(x, y, Number(next.substring(0, 1)), Number(next.substring(2, next.length)));
                        }
                    }//graph.get(`${x}_${y}`).out.has(`${x}_${y + 1}`)
                    if (!(graph.get(`${x}_${y}`).out.has(`${x + 1}_${y}`)) && graph.has(`${x + 1}_${y}`)) {
                        this.ctx.lineWidth = this.wallLineWidth;
                        this.drawLine(x, y, x + 1, y);
                    }
                    if (!(graph.get(`${x}_${y}`).out.has(`${x}_${y + 1}`)) && graph.has(`${x}_${y + 1}`)) {
                        this.ctx.lineWidth = this.wallLineWidth;
                        this.drawLine(x, y, x, y + 1);
                    }
                    if (graph.get(`${x}_${y}`).out.size < 8) {
                        graph.get(`${x}_${y}`).wallValue = 0;
                    }
                    else {
                        graph.get(`${x}_${y}`).wallValue = 1;
                    }
                }

            }

        }

        this.curPoint = new Coordinates(this.rows / 2, this.columns / 2)
        this.myImgData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.curPoint = new Coordinates(this.rows / 2, this.columns / 2)
        this.drawPoint(this.curPoint.x, this.curPoint.y);
        this.gameOn = false;
    }

    this.saveBoardState = function (x, y) {
        this.myImgData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        graph.get(`${this.curPoint.x}_${this.curPoint.y}`).out.delete(`${x}_${y}`);
        graph.get(`${this.curPoint.x}_${this.curPoint.y}`).wallValue = 0;
        graph.get(`${x}_${y}`).out.delete(`${this.curPoint.x}_${this.curPoint.y}`);
        this.curPoint.x = x;
        this.curPoint.y = y;
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
        this.createField();
    }

    this.gameStart = function () {
        this.canvas.addEventListener('mousemove', this.mouseMoveEvent);
        this.canvas.addEventListener('click', this.clickEvent);

        this.botGame = true;
        // this.bestGhost = new ghostMoves();
        // this.bestPlayer = new ghostMoves();
        this.gameOn = true;
        // this.suicideGate = 0;
        // this.suicideWall = 0;
        this.player = Boolean(Math.floor(Math.random() * 2));
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
        for (let x = 0; x <= this.rows; x++)
            for (let y = 0; y <= this.columns; y++) {
                if (graph.has(`${x}_${y}`)) {
                    if ((y * this.scale + this.wallLineWidth / 2 <= cord_X + this.scale / 2 && x * this.scale + this.wallLineWidth / 2 <= cord_Y + this.scale / 2)
                        && (y * this.scale + this.wallLineWidth / 2 >= cord_X - this.scale / 2 && x * this.scale + this.wallLineWidth / 2 >= cord_Y - this.scale / 2))
                        if ((x >= this.curPoint.x - 1 && x <= this.curPoint.x + 1) && (y >= this.curPoint.y - 1 && y <= this.curPoint.y + 1))
                            if (graph.get(`${this.curPoint.x}_${this.curPoint.y}`).out.has(`${x}_${y}`)) {
                                this.loadBoardState();
                                this.ctx.fillStyle = this.color;
                                this.drawPoint(x, y);
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

        for (let x = 0; x <= this.rows; x++) {
            for (let y = 0; y <= this.columns; y++) {
                if (graph.has(`${x}_${y}`)) {
                    if ((x * this.scale + this.wallLineWidth / 2 <= cord_X + this.scale / 2 && y * this.scale + this.wallLineWidth / 2 <= cord_Y + this.scale / 2)
                        && (x * this.scale + this.wallLineWidth / 2 >= cord_X - this.scale / 2 && y * this.scale + this.wallLineWidth / 2 >= cord_Y - this.scale / 2)) {
                        if ((x >= this.curPoint.x - 1 && x <= this.curPoint.x + 1) && (y >= this.curPoint.y - 1 && y <= this.curPoint.y + 1)) {
                            if (graph.get(`${this.curPoint.x}_${this.curPoint.y}`).out.has(`${x}_${y}`)) {
                                this.ctx.fillStyle = "blue";
                                this.drawPoint(x, y)
                                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                                this.ctx.putImageData(this.myImgData, 0, 0);
                                this.ctx.strokeStyle = this.color;
                                this.drawLine(this.curPoint.x, this.curPoint.y, x, y)
                                this.saveBoardState(x, y);
                                this.loadBoardState();

                                if (graph.get(`${x}_${y}`).wallValue == 0)
                                    wallHit = true;
                                graph.get(`${x}_${y}`).wallValue = 0;

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

                                if (graph.get(`${x}_${y}`).out.size > 0) {
                                    if (this.botGame == true && !wallHit) {
                                        // this.canvas.removeEventListener('mousemove', this.mouseMoveEvent);
                                        // this.canvas.removeEventListener('click', this.clickEvent);
                                        // const path = dijkstra(`${this.curPoint.x}_${this.curPoint.y}`, "4_12", graph);
                                        // for (const element of path.path) {
                                        //     this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                                        //     this.ctx.putImageData(this.myImgData, 0, 0);
                                        //     this.ctx.strokeStyle = "black";
                                        //     this.drawLine(this.curPoint.x, this.curPoint.y, Number(element.substring(0, 1)), Number(element.substring(2, element.length)))


                                        //     this.saveBoardState(Number(element.substring(0, 1)), Number(element.substring(2, element.length)));
                                        //     this.loadBoardState();
                                        //     this.curPoint.x = Number(element.substring(0, 1));
                                        //     this.curPoint.y = Number(element.substring(2, element.length))
                                        // };
                                        // let newGhost = new ghostMoves();
                                        // this.checkBotMoves(newGhost, this.curPoint);
                                        // if (this.bestGhost.pointsTab.length == 0) {
                                        //     if (this.suicideWall != 0) {
                                        //         this.bestGhost = this.suicideWall;
                                        //         this.suicideWall = 1;
                                        //     }

                                        //     if (this.suicideGate != 0) {
                                        //         this.bestGhost = this.suicideGate;
                                        //     }
                                        // }
                                        // let startDrawGhost = setInterval(() => { this.botDraw(startDrawGhost); }, 400);
                                        // this.bestGhost.enemyGateX = 100;
                                        // this.bestGhost.enemyGateY = 100;
                                        // this.bestGhost.awayGateX = 100;
                                        this.canvas.addEventListener('mousemove', this.mouseMoveEvent);
                                        this.canvas.addEventListener('click', this.clickEvent);
                                        this.player = !this.player;
                                    }
                                    return;
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

    this.rysuj = function (i, stopper, path, x, y) {
        this.loadBoardState();
        for (const element of path.path[i]) {
            // this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            // this.ctx.putImageData(this.myImgData, 0, 0);
            this.ctx.strokeStyle = "black";
            this.drawLine(this.curPoint.x, this.curPoint.y, Number(element.substring(0, 1)), Number(element.substring(2, element.length)))
            this.curPoint.x = Number(element.substring(0, 1));
            this.curPoint.y = Number(element.substring(2, element.length));

            // this.saveBoardState(Number(element.substring(0, 1)), Number(element.substring(2, element.length)));
            // this.loadBoardState();
            graph.get(element).wallValue = 0;

        }

        this.curPoint.x = x;
        this.curPoint.y = y;

        if (this.con == 4) {
            clearInterval(stopper)
        }

        this.con++;
    }

    this.con = 0;

    this.debug = () => {
        let enemyGatePoint = 0;
        let ownGatePoint = 0;
        if (this.player == true) {
            enemyGatePoint = this.columns;
        }
        else {
            ownGatePoint = this.columns;
        }
        this.canvas.removeEventListener('mousemove', this.mouseMoveEvent);
        this.canvas.removeEventListener('click', this.clickEvent);
        const path = dijkstra(`4_${enemyGatePoint}`, `${this.curPoint.x}_${this.curPoint.y}`, graph, ownGatePoint);
        if (path == false) {
            console.log("Nie znaleziono drogi");
            return;
        }
        let stopper = setInterval(() => { this.rysuj(this.con, stopper, path, this.curPoint.x, this.curPoint.y) }, 3000)


        // for (let i = 0; i < 4; i++) {
        //     for (const element of path.path[i]) {
        //         // this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        //         // this.ctx.putImageData(this.myImgData, 0, 0);
        //         this.ctx.strokeStyle = "black";
        //         this.drawLine(this.curPoint.x, this.curPoint.y, Number(element.substring(0, 1)), Number(element.substring(2, element.length)))
        //         this.curPoint.x = Number(element.substring(0, 1));
        //         this.curPoint.y = Number(element.substring(2, element.length));

        //         // this.saveBoardState(Number(element.substring(0, 1)), Number(element.substring(2, element.length)));
        //         // this.loadBoardState();
        //         graph.get(element).wallValue = 0;

        //     }
        //     this.loadBoardState();
        //     this.curPoint.x = 4;
        //     this.curPoint.y = 6;

        // }

        this.canvas.addEventListener('mousemove', this.mouseMoveEvent);
        this.canvas.addEventListener('click', this.clickEvent);
        this.player = !this.player;

    }

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


let game = new Game();
game.gamePrepare();
game.gameStart();


let btn = document.querySelector(".btn");
btn.addEventListener("click", game.debug);