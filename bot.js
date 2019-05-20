const addNode = (graph, node) => {
    graph.set(node, { in: new Set(), out: new Set() });
};

const connectNodes = (graph, source, target) => {
    graph.get(source).out.add(target);
    graph.get(target).in.add(source);
    graph.get(source).in.add(target);
    graph.get(target).out.add(source);
};

const buildGraphFromEdges = (edges) => edges.reduce(
    (graph, { source, target }) => {
        if (!graph.has(source)) {
            addNode(graph, source);
        }

        if (!graph.has(target)) {
            addNode(graph, target);
        }

        connectNodes(graph, source, target);

        return graph;
    },
    new Map()
);

const buildPath = (target, path) => {
    const result = [];

    while (path.has(target)) {
        const source = path.get(target);
        result.push({ source, target });
        target = source;
    }

    return result.reverse();
};

const findPath = (source, target, graph) => {
    if (!graph.has(source)) {
        throw new Error('Unknown source.');
    }

    if (!graph.has(target)) {
        throw new Error('Unknown target.');
    }

    const queue = [source];
    const visited = new Set();
    const path = new Map();

    while (queue.length > 0) {
        const start = queue.shift();

        if (start === target) {
            return buildPath(start, path);
        }

        for (const next of graph.get(start).out) {
            if (visited.has(next)) {
                continue;
            }

            if (!queue.includes(next)) {
                path.set(next, start);
                queue.push(next);
            }
        }

        visited.add(start);
    }

    return null;
};

let rows = 8;
let columns = 10;

let tab = new Array(rows + 1);
for (let i = 0; i < tab.length; i++) {
    tab[i] = new Array(columns + 1);
}
let licznik = 0;

for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= columns; j++) {
        if (j >= 1 && j < columns) {
            tab[i][j] = licznik;
            licznik++;
            continue;
        }
        else if (i >= rows / 2 - 1 && i <= rows / 2 + 1) {
            tab[i][j] = licznik;
            licznik++;
            continue;
        }
        else {
            tab[i][j] = -1;
        }
    }
}

let tabEdges = new Array();
let horizontalBlock = false;
let verticalBlock = false;
let blockLeftGate = false;
let blockRightGate = false;
let blockTopGate = false;
let blockBottomGate = false;

for (let i = 0; i < tab.length; i++) {
    for (let j = 0; j < tab[i].length; j++) {
        if (tab[i] != -1 && tab[i][j] != -1) {
            if (i == rows / 2 - 1 && j == 1) {
                blockLeftGate = true;
                blockTopGate = true;
            }

            if (i == rows / 2 + 1 && j == 1) {
                blockLeftGate = true;
                blockBottomGate = true;
            }

            if (i == rows / 2 - 1 && j == columns - 1) {
                blockRightGate = true;
                blockTopGate = true;
            }

            if (i == rows / 2 + 1 && j == columns - 1) {
                blockRightGate = true;
                blockBottomGate = true;
            }

            if ((i == rows / 2 - 1 || i == rows / 2 + 1) && j == 0) {
                continue;
            }

            if ((i == rows / 2 - 1 || i == rows / 2 + 1) && j == columns) {
                continue;
            }

            if (i == 0 || i == rows) horizontalBlock = true;

            if ((i >= rows / 2 - 1 && i <= rows / 2 + 1) && (j == 0 || j == columns)) {
                verticalBlock = true;
                horizontalBlock = true;
            }

            if (!(i >= rows / 2 - 1 && i <= rows / 2 + 1) && (j == 1 || j == columns - 1)) verticalBlock = true;

            if (tab[i - 1] != undefined && tab[i - 1][j - 1] > -1 && verticalBlock == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i - 1}_${j - 1}` })
            }
            if (tab[i - 1] != undefined && tab[i - 1][j] > -1 && verticalBlock == false && blockTopGate == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i - 1}_${j}` })
            }
            if (tab[i - 1] != undefined && tab[i - 1][j + 1] > -1 && verticalBlock == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i - 1}_${j + 1}` })
            }
            if (tab[i][j - 1] > -1 && horizontalBlock == false && blockLeftGate == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i}_${j - 1}` })
            }
            if (tab[i][j + 1] > -1 && horizontalBlock == false && blockRightGate == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i}_${j + 1}` })
            }
            if (tab[i + 1] != undefined && tab[i + 1][j - 1] > -1 && verticalBlock == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i + 1}_${j - 1}` })
            }
            if (tab[i + 1] != undefined && tab[i + 1][j] > -1 && verticalBlock == false && blockBottomGate == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i + 1}_${j}` })
            }
            if (tab[i + 1] != undefined && tab[i + 1][j + 1] > -1 && verticalBlock == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i + 1}_${j + 1}` })
            }
            horizontalBlock = false;
            verticalBlock = false;
            blockLeftGate = false;
            blockRightGate = false;
            blockTopGate = false;
            blockBottomGate = false;
        }
    }
}

const graph = buildGraphFromEdges(tabEdges);
console.log(`"${rows / 2}_${columns / 2}"`);
console.log(graph.get(`${rows / 2}_${columns / 2}`).out);
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
                        console.log(next);
                        if (next == `${x + 1}_${y}` || next == `${x}_${y + 1}`) {
                            this.ctx.lineWidth = this.noLineWidth;
                            this.drawLine(x, y, Number(next.substring(0, 1)), Number(next.substring(2, next.length)));
                        }
                    }//graph.get(`${x}_${y}`).out.has(`${x}_${y + 1}`)
                    if (!(graph.get(`${x}_${y}`).out.has(`${x + 1}_${y}`)) && graph.has(`${x + 1}_${y}`)) {
                        this.ctx.lineWidth = this.wallLineWidth;
                        this.drawLine(x, y, Number(`${x + 1}_${y}`.substring(0, 1)), Number(`${x + 1}_${y}`.substring(2, `${x + 1}_${y}`.length)));
                    }
                    if (!(graph.get(`${x}_${y}`).out.has(`${x}_${y + 1}`)) && graph.has(`${x}_${y + 1}`)) {
                        this.ctx.lineWidth = this.wallLineWidth;
                        this.drawLine(x, y, Number(`${x}_${y + 1}`.substring(0, 1)), Number(`${x}_${y + 1}`.substring(2, `${x}_${y + 1}`.length)));
                    }
                }

            }

        }

        this.myImgData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawPoint(this.pointsArray[this.halfRows][this.halfColumns].x, this.pointsArray[this.halfRows][this.halfColumns].y);
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
        this.createField();
    }

    this.gameStart = function () {
        this.canvas.addEventListener('mousemove', this.mouseMoveEvent);
        this.canvas.addEventListener('click', this.clickEvent);

        this.botGame = true;
        this.bestGhost = new ghostMoves();
        this.bestPlayer = new ghostMoves();
        this.gameOn = true;
        this.suicideGate = 0;
        this.suicideWall = 0;
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
                                                this.player = !this.player;
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


let game = new Game();
game.gamePrepare();
game.gameStart();


let btn = document.querySelector(".btn");
// btn.addEventListener("click", game.debug);