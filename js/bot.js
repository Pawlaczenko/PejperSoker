var currPlayer = false;
var players = [];
const graph = createGraph(8, 12);

var Player = function (name, color, role) {
    this.name = name;
    this.color = color;
    this.role = role;
}

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

        for (let x = 0; x <= this.rows; x++) {
            for (let y = 0; y <= this.columns; y++) {
                if (graph.has(`${x}_${y}`)) {
                    for (const next of graph.get(`${x}_${y}`).out) {
                        if (next == `${x + 1}_${y}` || next == `${x}_${y + 1}`) {
                            this.ctx.lineWidth = this.noLineWidth;
                            this.drawLine(x, y, Number(next.substring(0, 1)), Number(next.substring(2, next.length)));
                        }
                    }
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

        this.curPoint = new Point(this.rows / 2, this.columns / 2)
        graph.get(`${this.curPoint.x}_${this.curPoint.y}`).wallValue = 0;
        this.myImgData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.curPoint = new Point(this.rows / 2, this.columns / 2)
        this.drawPoint(this.curPoint.x, this.curPoint.y);
        this.gameOn = false;

    }

    this.saveBoardState = function (x, y) {
        this.myImgData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        graph.get(`${this.curPoint.x}_${this.curPoint.y}`).out.delete(`${x}_${y}`);
        graph.get(`${this.curPoint.x}_${this.curPoint.y}`).wallValue = 0;
        graph.get(`${x}_${y}`).wallValue = 0;
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

        $('.name[data-id="0"]').html(`${players[0].name}`).css("background-color", `${players[0].color}`);
        $('.name[data-id="1"]').html(`${players[1].name}`).css("background-color", `${players[1].color}`);

        this.botGame = false;
        this.gameOn = true;
        this.player = false;
        currPlayer = false;
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

        this.color = players[+currPlayer].color;

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
                                if (graph.get(`${x}_${y}`).wallValue == 0)
                                    wallHit = true;
                                this.ctx.fillStyle = "blue";
                                this.drawPoint(x, y)
                                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                                this.ctx.putImageData(this.myImgData, 0, 0);
                                this.ctx.strokeStyle = this.color;
                                this.drawLine(this.curPoint.x, this.curPoint.y, x, y)
                                this.saveBoardState(x, y);
                                this.loadBoardState();

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
                                    if (!wallHit) {
                                        this.player = changeRound();
                                        this.con = 0;
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

                                        let selectedPoint = checkAllPaths(`${this.curPoint.x}_${this.curPoint.y}`, `4_${enemyGatePoint}`, `4_${ownGatePoint}`, graph);

                                        if (selectedPoint != false) {
                                            let pathToDraw = findSinglePath(selectedPoint.point, `${this.curPoint.x}_${this.curPoint.y}`, graph);

                                            let stopper = setInterval(() => { this.draw(stopper, pathToDraw.path) }, 500)
                                        }
                                        else {
                                            let selectedPoint = findBlockPoint(`${this.curPoint.x}_${this.curPoint.y}`, `4_${ownGatePoint}`, graph);

                                            if (selectedPoint != false) {
                                                let pathToDraw = findSinglePath(selectedPoint.point, `${this.curPoint.x}_${this.curPoint.y}`, graph);

                                                let stopper = setInterval(() => { this.draw(stopper, pathToDraw.path) }, 500)
                                            }
                                            else {
                                                let selectedPoint = findAnyPoint(`${this.curPoint.x}_${this.curPoint.y}`, graph);
                                                let pathToDraw = findSinglePath(selectedPoint.point, `${this.curPoint.x}_${this.curPoint.y}`, graph);

                                                let stopper = setInterval(() => { this.draw(stopper, pathToDraw.path) }, 500)
                                            }
                                        }
                                        this.player = changeRound();
                                    }
                                    return;
                                }
                                else {
                                    this.gameEnd(true);
                                }
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

    this.draw = function (stopper, path) {
        this.loadBoardState();
        const element = path[this.con];

        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.putImageData(this.myImgData, 0, 0);

        this.color = players[+(!currPlayer)].color;
        this.ctx.strokeStyle = this.color;
        this.drawLine(this.curPoint.x, this.curPoint.y, Number(element.substring(0, 1)), Number(element.substring(2, element.length)))
        this.saveBoardState(Number(element.substring(0, 1)), Number(element.substring(2, element.length)));
        this.loadBoardState();
        this.con++;
        

        if (this.con == (path.length)) {
            clearInterval(stopper);
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
            this.canvas.addEventListener('mousemove', this.mouseMoveEvent);
            this.canvas.addEventListener('click', this.clickEvent);
            return;
        }
    }
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

$("#creator").submit(function(e){
    e.preventDefault();
    $(".creator--box").css("display","none");
    let color = $(".colorInput[name=color]:checked").val();
    let name = $("#name").val();
    players[0]=new Player(name,colors[color]);
    players[1]=new Player("Shrek",'green');

    let game = new Game();
    game.gamePrepare();
    game.gameStart();
});

function changeRound() {
    $('.name').each(function (i) {
        $(this).toggleClass('active');
    });
    currPlayer = !currPlayer;
    return !this.player;
}