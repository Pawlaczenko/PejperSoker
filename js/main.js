let squaresX = 10;
let squaresY = 8;
let pointsArray = create2dArray(8, 10);
let gatewayArray = create2dArray(1, 2);
let canvas = document.createElement("canvas");
let divBoard = document.getElementById("board");;
let boardWidth = divBoard.offsetWidth;
let boardHeight = divBoard.offsetHeight;
let ctx = canvas.getContext('2d');
let scale = 147;
let canvasWidthResolution = 1800;
let canvasHeightResolution = 1200;
let wallWidth = 20;
let fieldWidth = 5;
let middleWidth = Math.ceil(squaresX / 2);
let middleHeight = Math.ceil(squaresY / 2);

function Board(div_id) {


    this.squaresX = squaresX;
    this.squaresY = squaresY;

    this.draw = function () {
        divBoard.appendChild(canvas);
        canvas.width = canvasWidthResolution;
        canvas.height = canvasHeightResolution;
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
}

function drawLine(x1, y1, x2, y2) {
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo((x1 + 1) * scale + 10, y1 * scale + 10);// to plus 10 to ustawnia marginsow
    ctx.lineTo((x2 + 1) * scale + 10, y2 * scale + 10);
    ctx.stroke();
    ctx.closePath();
}

function drawGate(x1, y1, x2, y2) {
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo((x1) * scale + 10, y1 * scale + 10);// to plus 10 to ustawnia marginsow
    ctx.lineTo((x2) * scale + 10, y2 * scale + 10);
    ctx.stroke();
    ctx.closePath();
}

function drawField() {
    for (let i = 0; i <= squaresY; i++) {
        for (let j = 0; j <= squaresX; j++) {
            if (pointsArray[i][j].moveTable[2][1] == 0) {
                ctx.lineWidth = fieldWidth;
                drawLine(pointsArray[i][j].x, pointsArray[i][j].y, pointsArray[i + 1][j].x, pointsArray[i + 1][j].y);
            }
            if (pointsArray[i][j].moveTable[2][1] == 1) {
                ctx.lineWidth = wallWidth;
                drawLine(pointsArray[i][j].x, pointsArray[i][j].y, pointsArray[i + 1][j].x, pointsArray[i + 1][j].y);
            }
            if (j != squaresX) {
                if (pointsArray[i][j].moveTable[1][2] == 0) {
                    ctx.lineWidth = fieldWidth;
                    drawLine(pointsArray[i][j].x, pointsArray[i][j].y, pointsArray[i][j + 1].x, pointsArray[i][j + 1].y);
                }
                if (pointsArray[i][j].moveTable[1][2] == 1) {
                    ctx.lineWidth = wallWidth;
                    drawLine(pointsArray[i][j].x, pointsArray[i][j].y, pointsArray[i][j + 1].x, pointsArray[i][j + 1].y);
                }
            }
        }
    }
}

function drawGateway() {
    for (let i = 0; i <= 1; i++) {
        for (let j = 0; j <= 2; j++) {
            ctx.lineWidth = wallWidth;
            if (j < 2)
                drawGate(gatewayArray[i][j].x, gatewayArray[i][j].y, gatewayArray[i][j + 1].x, gatewayArray[i][j + 1].y);
            if (j == 0 || j == 2) {
                if (i == 1)
                    drawGate(gatewayArray[i][j].x, gatewayArray[i][j].y, gatewayArray[i][j].x - 1, gatewayArray[i][j].y);
                else
                    drawGate(gatewayArray[i][j].x, gatewayArray[i][j].y, gatewayArray[i][j].x + 1, gatewayArray[i][j].y);
            }
            else {
                ctx.lineWidth = fieldWidth;
                if (i == 1)
                    drawGate(gatewayArray[i][j].x, gatewayArray[i][j].y, gatewayArray[i][j].x - 1, gatewayArray[i][j].y);
                else
                    drawGate(gatewayArray[i][j].x, gatewayArray[i][j].y, gatewayArray[i][j].x + 1, gatewayArray[i][j].y);
            }
        }
    }
}

function pointsApply() {
    // WYPELNIANIE TABLICY SPECJALNYMI PKT
    for (let i = 0; i <= squaresY; i++) {
        for (let j = 0; j <= squaresX; j++) {
            pointsArray[i][j] = new Point(j, i);
            if (i == 0) pointsArray[i][j].moveTable = [[2, 2, 2], [1, 2, 1], [0, 0, 0]];
            if (j == 0) pointsArray[i][j].moveTable = [[2, 1, 0], [2, 2, 0], [2, 1, 0]];
            if (i == squaresY) pointsArray[i][j].moveTable = [[0, 0, 0], [1, 2, 1], [2, 2, 2]];
            if (j == squaresX) pointsArray[i][j].moveTable = [[0, 1, 2], [0, 2, 2], [0, 1, 2]];
        }
    }

    ///ROGI///
    pointsArray[0][0].moveTable = [[2, 2, 2], [2, 2, 1], [2, 1, 0]];
    pointsArray[0][squaresX].moveTable = [[2, 2, 2], [1, 2, 2], [0, 1, 2]];
    pointsArray[squaresY][squaresX].moveTable = [[0, 1, 2], [1, 2, 2], [2, 2, 2]];
    pointsArray[squaresY][0].moveTable = [[2, 1, 0], [2, 2, 1], [2, 2, 2]];

    ///BRAMKI///
    var side = ((squaresY - 2) / 2); //odleglosc_rogu_planszy_do_bramki
    pointsArray[side][0].moveTable = [[2, 1, 0], [1, 2, 0], [0, 0, 0]];
    pointsArray[side + 1][0].moveTable = [[0, 0, 0], [0, 2, 0], [0, 0, 0]];
    pointsArray[side + 2][0].moveTable = [[0, 0, 0], [1, 2, 0], [2, 1, 0]];
    pointsArray[side][squaresX].moveTable = [[0, 1, 2], [0, 2, 1], [0, 0, 0]];
    pointsArray[side + 1][squaresX].moveTable = [[0, 0, 0], [0, 2, 0], [0, 0, 0]];
    pointsArray[side + 2][squaresX].moveTable = [[0, 0, 0], [0, 2, 1], [0, 1, 2]];

    ///PUNKTY BRAMEK///
    gatewayArray[0][0] = new Point(0, side);
    gatewayArray[0][1] = new Point(0, (side) + 1);
    gatewayArray[0][2] = new Point(0, (side) + 2);
    gatewayArray[1][0] = new Point(squaresX + 2, side);
    gatewayArray[1][1] = new Point(squaresX + 2, (side) + 1);
    gatewayArray[1][2] = new Point(squaresX + 2, (side) + 2);
}

function drawFieldState()
{
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(pointsArray[middleHeight][middleWidth].x * scale + scale + wallWidth / 2, pointsArray[middleHeight][middleWidth].y * scale + wallWidth / 2, 15, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}

function setup() {
    var myboard = new Board("board");
    myboard.draw();

    ///NAKŁADANIE PUNKTÓW///
    pointsApply();
    ///RYSOWANIE PLANSZY///
    drawField();
    ///RYSOWANIE BRAMEK///
    drawGateway();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(pointsArray[middleHeight][middleWidth].x * scale + scale + wallWidth / 2, pointsArray[middleHeight][middleWidth].y * scale + wallWidth / 2, 15, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}
setup();

//-------------------------------------------------------------
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


console.log(pointsArray);

canvas.addEventListener('mousemove', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    //var message = 'Mouse position: ' + mousePos.x*przelicznik_do_pobiernia_myszki_x + ',' + mousePos.y*przelicznik_do_pobiernia_myszki_y;
    var przelicznik_na_x = canvasWidthResolution / boardWidth;
    var przelicznik_na_y = canvasHeightResolution / boardHeight;
    var cord_X = mousePos.x * przelicznik_na_x;
    var cord_Y = mousePos.y * przelicznik_na_y;

    ///PUNKTY MAPY///
    for (let i = 0; i < pointsArray.length; i++)
        for (let j = 0; j < pointsArray[i].length; j++)
            if ((pointsArray[i][j].x * scale + scale + wallWidth / 2 <= cord_X + 15 && pointsArray[i][j].y * scale + wallWidth / 2 <= cord_Y + 15)
                && (pointsArray[i][j].x * scale + scale + wallWidth / 2 >= cord_X - 15 && pointsArray[i][j].y * scale + wallWidth / 2 >= cord_Y - 15)) {
                ctx.clearRect(0, 0, canvasWidthResolution, canvasHeightResolution);
                drawField();
                drawGateway();
                drawFieldState()
                ctx.beginPath();
                ctx.fillStyle = "blue";
                //ctx.fillRect(pointsArray[1][j].x * scale + scale - 15, pointsArray[1][j].y * scale - 15, 30, 30);
                ctx.arc(pointsArray[i][j].x * scale + scale + wallWidth / 2, pointsArray[i][j].y * scale + wallWidth / 2, 15, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();
                log("!!!!");
            }

    ///PUNKTY BRAMEK///
    for (let i = 0; i < gatewayArray.length; i++)
        for (let j = 0; j < gatewayArray[i].length; j++)
            if ((gatewayArray[i][j].x * scale + wallWidth / 2 <= cord_X + 15 && gatewayArray[i][j].y * scale + wallWidth / 2 <= cord_Y + 15)
                && (gatewayArray[i][j].x * scale + wallWidth / 2 >= cord_X - 15 && gatewayArray[i][j].y * scale + wallWidth / 2 >= cord_Y - 15)) {
                ctx.clearRect(0, 0, canvasWidthResolution, canvasHeightResolution);
                drawField();
                drawGateway();
                drawFieldState()
                ctx.beginPath();
                ctx.fillStyle = "blue";
                //ctx.fillRect(gatewayArray[1][j].x * scale + scale - 15, gatewayArray[1][j].y * scale - 15, 30, 30);
                ctx.arc(gatewayArray[i][j].x * scale + wallWidth / 2, gatewayArray[i][j].y * scale + wallWidth / 2, 15, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();
                log("!!!!");
            }
}, false);
