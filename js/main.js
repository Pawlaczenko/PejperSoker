let squaresX = 10;
let squaresY = 8;
let pointsArray = create2dArray(8, 10);
let gatewayArray = create2dArray(1, 2);
let allowPoints = create2dArray(2, 2);
let canvas = document.createElement("canvas");
let divBoard = document.getElementById("board");;
let boardWidth = divBoard.offsetWidth;
let boardHeight = divBoard.offsetHeight;
let ctx = canvas.getContext('2d');
let scale = 147;
let canvasWidthResolution = 1800;
let canvasHeightResolution = 1210;
let wallWidth = 20;
let fieldWidth = 5;
let middleWidth = Math.ceil(squaresX / 2);
let middleHeight = Math.ceil(squaresY / 2);
let marginXY = 15;
let curPoint;
let myImgData;
let posX;
let posY;
let color = 'blue';
let playerTurn = true;
let gatePoint;
let bestGhost;
let startDrawGhost;
let counter = 0;

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
    this.ghostTable =
        [
            [0, 0, 0],
            [0, 2, 0],
            [0, 0, 0]
        ];
    this.wall = false;
    this.ghostWall = false;
}

function ghostMoves() {
    this.pointsTab = [];
    this.gateDistance = 100;
}

function drawLine(x1, y1, x2, y2) {
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo((x1 + 1) * scale + marginXY, y1 * scale + marginXY);// to plus marginXY to ustawnia marginsow
    ctx.lineTo((x2 + 1) * scale + marginXY, y2 * scale + marginXY);
    ctx.stroke();
    ctx.closePath();
}

function drawGate(x1, y1, x2, y2) {
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo((x1) * scale + marginXY, y1 * scale + marginXY);// to plus marginXY to ustawnia marginsow
    ctx.lineTo((x2) * scale + marginXY, y2 * scale + marginXY);
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
            if (i == 0) {
                pointsArray[i][j].moveTable = [[2, 2, 2], [1, 2, 1], [0, 0, 0]];
                pointsArray[i][j].ghostTable = [[2, 2, 2], [1, 2, 1], [0, 0, 0]];
                pointsArray[i][j].wall = true;
            }
            if (j == 0) {
                pointsArray[i][j].moveTable = [[2, 1, 0], [2, 2, 0], [2, 1, 0]];
                pointsArray[i][j].ghostTable = [[2, 1, 0], [2, 2, 0], [2, 1, 0]];
                pointsArray[i][j].wall = true;
            }
            if (i == squaresY) {
                pointsArray[i][j].moveTable = [[0, 0, 0], [1, 2, 1], [2, 2, 2]];
                pointsArray[i][j].ghostTable = [[0, 0, 0], [1, 2, 1], [2, 2, 2]];
                pointsArray[i][j].wall = true;
            }
            if (j == squaresX) {
                pointsArray[i][j].moveTable = [[0, 1, 2], [0, 2, 2], [0, 1, 2]];
                pointsArray[i][j].ghostTable = [[0, 1, 2], [0, 2, 2], [0, 1, 2]];
                pointsArray[i][j].wall = true;
            }
        }
    }

    ///ROGI///
    pointsArray[0][0].moveTable = [[2, 2, 2], [2, 2, 1], [2, 1, 0]];
    pointsArray[0][0].ghostTable = [[2, 2, 2], [2, 2, 1], [2, 1, 0]];
    pointsArray[0][0].wall = true;
    pointsArray[0][squaresX].moveTable = [[2, 2, 2], [1, 2, 2], [0, 1, 2]];
    pointsArray[0][squaresX].ghostTable = [[2, 2, 2], [1, 2, 2], [0, 1, 2]];
    pointsArray[0][squaresX].wall = true;
    pointsArray[squaresY][squaresX].moveTable = [[0, 1, 2], [1, 2, 2], [2, 2, 2]];
    pointsArray[squaresY][squaresX].ghostTable = [[0, 1, 2], [1, 2, 2], [2, 2, 2]];
    pointsArray[squaresY][squaresX].wall = true;
    pointsArray[squaresY][0].moveTable = [[2, 1, 0], [2, 2, 1], [2, 2, 2]];
    pointsArray[squaresY][0].ghostTable = [[2, 1, 0], [2, 2, 1], [2, 2, 2]];
    pointsArray[squaresY][0].wall = true;

    ///BRAMKI///
    var side = ((squaresY - 2) / 2); //odleglosc_rogu_planszy_do_bramki
    pointsArray[side][0].moveTable = [[2, 1, 0], [1, 2, 0], [0, 0, 0]];
    pointsArray[side][0].ghostTable = [[2, 1, 0], [1, 2, 0], [0, 0, 0]];
    pointsArray[side][0].wall = true;
    pointsArray[side + 1][0].moveTable = [[0, 0, 0], [0, 2, 0], [0, 0, 0]];
    pointsArray[side + 1][0].ghostTable = [[0, 0, 0], [0, 2, 0], [0, 0, 0]];
    pointsArray[side + 1][0].wall = false;
    pointsArray[side + 2][0].moveTable = [[0, 0, 0], [1, 2, 0], [2, 1, 0]];
    pointsArray[side + 2][0].ghostTable = [[0, 0, 0], [1, 2, 0], [2, 1, 0]];
    pointsArray[side + 2][0].wall = true;
    pointsArray[side][squaresX].moveTable = [[0, 1, 2], [0, 2, 1], [0, 0, 0]];
    pointsArray[side][squaresX].ghostTable = [[0, 1, 2], [0, 2, 1], [0, 0, 0]];
    pointsArray[side][squaresX].wall = true;
    pointsArray[side + 1][squaresX].moveTable = [[0, 0, 0], [0, 2, 0], [0, 0, 0]];
    pointsArray[side + 1][squaresX].ghostTable = [[0, 0, 0], [0, 2, 0], [0, 0, 0]];
    pointsArray[side + 1][squaresX].wall = false;
    pointsArray[side + 2][squaresX].moveTable = [[0, 0, 0], [0, 2, 1], [0, 1, 2]];
    pointsArray[side + 2][squaresX].ghostTable = [[0, 0, 0], [0, 2, 1], [0, 1, 2]];
    pointsArray[side + 2][squaresX].wall = true;

    for (let i = 0; i <= squaresY; i++) {
        for (let j = 0; j <= squaresX; j++) {
            pointsArray[i][j].ghostWall = pointsArray[i][j].wall;
        }
    }

    ///PUNKTY BRAMEK///
    gatewayArray[0][0] = new Point(0, side);
    gatewayArray[0][1] = new Point(0, (side) + 1);
    gatewayArray[0][2] = new Point(0, (side) + 2);
    gatewayArray[1][0] = new Point(squaresX + 2, side);
    gatewayArray[1][1] = new Point(squaresX + 2, (side) + 1);
    gatewayArray[1][2] = new Point(squaresX + 2, (side) + 2);
}

function setup() {
    var myboard = new Board("board");
    myboard.draw();

    bestGhost = new ghostMoves();
    gatePoint = new Point(squaresX + 1, squaresY / 2);

    ///NAKŁADANIE PUNKTÓW///
    pointsApply();
    ///RYSOWANIE PLANSZY///
    drawField();
    ///RYSOWANIE BRAMEK///
    drawGateway();

    myImgData = ctx.getImageData(0, 0, canvasWidthResolution, canvasHeightResolution);

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(pointsArray[middleHeight][middleWidth].x * scale + scale + wallWidth / 2 + marginXY / 3, pointsArray[middleHeight][middleWidth].y * scale + wallWidth / 2 + marginXY / 3, 15, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    pointsArray[middleHeight][middleWidth].wall = true;
    pointsArray[middleHeight][middleWidth].ghostWall = true;
    curPoint = pointsArray[middleHeight][middleWidth];
    posX = curPoint.x * scale + scale + wallWidth / 2 + marginXY / 3;
    posY = curPoint.y * scale + wallWidth / 2 + marginXY / 3;
    bestGhost = new ghostMoves();
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

function loadBoardState() {
    ctx.clearRect(0, 0, canvasWidthResolution, canvasHeightResolution);
    ctx.putImageData(myImgData, 0, 0);
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(posX, posY, 15, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}

function saveBoardState(i, j, bol) {
    if (bol) {
        myImgData = ctx.getImageData(0, 0, canvasWidthResolution, canvasHeightResolution);
        curPoint.moveTable[i - middleHeight + 1][j - middleWidth + 1] = 1;
        curPoint.ghostTable[i - middleHeight + 1][j - middleWidth + 1] = 1;
        pointsArray[i][j].moveTable[2 - (i - middleHeight + 1)][2 - (j - middleWidth + 1)] = 1;
        pointsArray[i][j].ghostTable[2 - (i - middleHeight + 1)][2 - (j - middleWidth + 1)] = 1;
        curPoint = pointsArray[i][j];
        posX = curPoint.x * scale + scale + wallWidth / 2 + marginXY / 3;
        posY = curPoint.y * scale + wallWidth / 2 + marginXY / 3;
        middleHeight = i;
        middleWidth = j;
    }
    else {
        myImgData = ctx.getImageData(0, 0, canvasWidthResolution, canvasHeightResolution);
        curPoint = gatewayArray[i][j];
        posX = (curPoint.x - 1) * scale + scale + wallWidth / 2 + marginXY / 3;
        posY = curPoint.y * scale + wallWidth / 2 + marginXY / 3;
    }
}

function changePlayer() {
    if (color == 'blue') {
        color = 'red';
        playerTurn = false;
    }
    else {
        color = 'blue';
        playerTurn = true;
    }
}

function endGame(i) {
    log("Player " + i + " WIN");
    canvas.removeEventListener('mousemove', mouseMoveEvent);
    canvas.removeEventListener('click', clickEvent);
}

function ghostDraw(i) {
    ctx.clearRect(0, 0, canvasWidthResolution, canvasHeightResolution);
    ctx.putImageData(myImgData, 0, 0);
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(posX, posY);
    ctx.lineTo(bestGhost.pointsTab[counter].x * scale + scale + wallWidth / 2 + marginXY / 3, bestGhost.pointsTab[counter].y * scale + wallWidth / 2 + marginXY / 3)
    ctx.stroke();
    ctx.closePath();
    saveBoardState(bestGhost.pointsTab[counter].y, bestGhost.pointsTab[counter].x, true);
    loadBoardState();
    pointsArray[bestGhost.pointsTab[counter].y][bestGhost.pointsTab[counter].x].wall = true;
    pointsArray[bestGhost.pointsTab[counter].y][bestGhost.pointsTab[counter].x].ghostWall = true;
    counter++;
    if (counter == bestGhost.pointsTab.length) {
        counter = 0;
        clearInterval(startDrawGhost);
    }

}

function botTry(nowGhost, tmpPoint) {
    for (let i = tmpPoint.y - 1; i <= tmpPoint.y + 1; i++)
        for (let j = tmpPoint.x - 1; j <= tmpPoint.x + 1; j++)
            if (tmpPoint.ghostTable[i - tmpPoint.y + 1][j - tmpPoint.x + 1] == 0) {
                if (j == - 1)
                    break;
                if (j == pointsArray[i].length) {
                    nowGhost.pointsTab.push(new Point(gatewayArray[1][1].x - 1, gatewayArray[1][1].y))
                    nowGhost.gateDistance = 0;
                    bestGhost = JSON.parse(JSON.stringify(nowGhost));
                    return;
                }
                nowGhost.pointsTab.push(new Point(pointsArray[i][j].x, pointsArray[i][j].y))
                nowGhost.gateDistance = Math.abs(gatePoint.y - pointsArray[i][j].y-1) + (gatePoint.x - pointsArray[i][j].x);
                pointsArray[i][j].ghostWall = true;
                pointsArray[tmpPoint.y][tmpPoint.x].ghostTable[i - tmpPoint.y + 1][j - tmpPoint.x + 1] = 1;
                pointsArray[i][j].ghostTable[2 - (i - tmpPoint.y + 1)][2 - (j - tmpPoint.x + 1)] = 1;
                if (pointsArray[i][j].wall) {
                    let newPoint = JSON.parse(JSON.stringify(pointsArray[i][j]));
                    let newGhost = JSON.parse(JSON.stringify(nowGhost));
                    botTry(newGhost, newPoint)
                }
                else
                    if (nowGhost.gateDistance < bestGhost.gateDistance)
                        bestGhost = JSON.parse(JSON.stringify(nowGhost));
                pointsArray[i][j].ghostWall = false;
                pointsArray[tmpPoint.y][tmpPoint.x].ghostTable[i - tmpPoint.y + 1][j - tmpPoint.x + 1] = 0;
                pointsArray[i][j].ghostTable[2 - (i - tmpPoint.y + 1)][2 - (j - tmpPoint.x + 1)] = 0;
                nowGhost.pointsTab.pop();

            }


    // for (let i = tmpPoint.y - 1; i <= tmpPoint.y + 1; i++)
    // for (let j = tmpPoint.x - 1; j <= tmpPoint.x + 1; j++)
    //     if (tmpPoint.ghostTable[i - tmpPoint.y + 1][j - tmpPoint.x + 1] == 0) {
    //         if (j == - 1)
    //             break;
    //         if (j == pointsArray[i].length) {
    //             log("Bramka");
    //             break;
    //         }
    //         nowGhost.pointsTab.push(new Point(pointsArray[i][j].x, pointsArray[i][j].y))
    //         nowGhost.gateDistance = Math.abs(gatePoint.y - pointsArray[i][j].y) + (gatePoint.x - pointsArray[i][j].x);
    //         pointsArray[i][j].ghostWall = true;
    //         pointsArray[tmpPoint.y][tmpPoint.x].ghostTable[i - tmpPoint.y + 1][j - tmpPoint.x + 1] = 1;
    //         pointsArray[i][j].ghostTable[2 - (i - tmpPoint.y + 1)][2 - (j - tmpPoint.x + 1)] = 1;
    //         if (pointsArray[i][j].wall) {
    //             let newPoint = JSON.parse(JSON.stringify(pointsArray[i][j]));
    //             let newGhost = JSON.parse(JSON.stringify(nowGhost));
    //             botTry(newGhost, newPoint)
    //         }
    //         else
    //             if (nowGhost.gateDistance < bestGhost.gateDistance)
    //                 bestGhost = JSON.parse(JSON.stringify(nowGhost));
    //         pointsArray[i][j].ghostWall = false;
    //         pointsArray[tmpPoint.y][tmpPoint.x].ghostTable[i - tmpPoint.y + 1][j - tmpPoint.x + 1] = 0;
    //         pointsArray[i][j].ghostTable[2 - (i - tmpPoint.y + 1)][2 - (j - tmpPoint.x + 1)] = 0;
    //     }

    // ctx.beginPath();
    // ctx.moveTo(posX, posY);
    // ctx.lineTo(pointsArray[i][j].x * scale + scale + wallWidth / 2 + marginXY / 3, pointsArray[i][j].y * scale + wallWidth / 2 + marginXY / 3)
    // ctx.stroke();
    // ctx.closePath();

}

function mouseMoveEvent(evt) {
    var mousePos = getMousePos(canvas, evt);
    var przelicznik_na_x = canvasWidthResolution / boardWidth;
    var przelicznik_na_y = canvasHeightResolution / boardHeight;
    var cord_X = mousePos.x * przelicznik_na_x;
    var cord_Y = mousePos.y * przelicznik_na_y;

    ///PUNKTY MAPY///
    for (let i = 0; i < pointsArray.length; i++)
        for (let j = 0; j < pointsArray[i].length; j++)
            if ((pointsArray[i][j].x * scale + scale + wallWidth / 2 <= cord_X + scale / 2 && pointsArray[i][j].y * scale + wallWidth / 2 <= cord_Y + scale / 2)
                && (pointsArray[i][j].x * scale + scale + wallWidth / 2 >= cord_X - scale / 2 && pointsArray[i][j].y * scale + wallWidth / 2 >= cord_Y - scale / 2))
                if ((i >= middleHeight - 1 && i <= middleHeight + 1) && (j >= middleWidth - 1 && j <= middleWidth + 1))
                    if (curPoint.moveTable[i - middleHeight + 1][j - middleWidth + 1] == 0) {
                        loadBoardState();
                        ctx.beginPath();
                        ctx.fillStyle = color;
                        ctx.arc(pointsArray[i][j].x * scale + scale + wallWidth / 2 + marginXY / 3, pointsArray[i][j].y * scale + wallWidth / 2 + marginXY / 3, 15, 0, Math.PI * 2, false);
                        ctx.fill();
                        ctx.closePath();
                    }

    ///PUNKTY BRAMEK///
    for (let i = 0; i < gatewayArray.length; i++)
        for (let j = 0; j < gatewayArray[i].length; j++)
            if ((gatewayArray[i][j].x * scale + wallWidth / 2 <= cord_X + scale / 2 && gatewayArray[i][j].y * scale + wallWidth / 2 <= cord_Y + scale / 2)
                && (gatewayArray[i][j].x * scale + wallWidth / 2 >= cord_X - scale / 2 && gatewayArray[i][j].y * scale + wallWidth / 2 >= cord_Y - scale / 2))
                if (((posX + scale == gatewayArray[i][j].x * scale + wallWidth / 2 + marginXY / 3) || (posX - scale == gatewayArray[i][j].x * scale + wallWidth / 2 + marginXY / 3))
                    && ((posY - scale * 2 < gatewayArray[i][j].y * scale + wallWidth / 2 + marginXY / 3) && (posY + scale * 2 > gatewayArray[i][j].y * scale + wallWidth / 2 + marginXY / 3))) {
                    let value;
                    if (middleWidth == 10) value = 2;
                    else value = 0;
                    if ((curPoint.moveTable[j + 1 - (middleHeight - 3)][value] == 0)) {
                        loadBoardState();
                        ctx.beginPath();
                        ctx.fillStyle = color;
                        ctx.arc(gatewayArray[i][j].x * scale + wallWidth / 2 + marginXY / 3, gatewayArray[i][j].y * scale + wallWidth / 2 + marginXY / 3, 15, 0, Math.PI * 2, false);
                        ctx.fill();
                        ctx.closePath();
                    }
                }
}

function clickEvent(evt) {
    var mousePos = getMousePos(canvas, evt);
    var przelicznik_na_x = canvasWidthResolution / boardWidth;
    var przelicznik_na_y = canvasHeightResolution / boardHeight;
    var cord_X = mousePos.x * przelicznik_na_x;
    var cord_Y = mousePos.y * przelicznik_na_y;
    let wallmove = false;

    ///PUNKTY MAPY///
    for (let i = 0; i < pointsArray.length; i++)
        for (let j = 0; j < pointsArray[i].length; j++)
            if ((pointsArray[i][j].x * scale + scale + wallWidth / 2 <= cord_X + scale / 2 && pointsArray[i][j].y * scale + wallWidth / 2 <= cord_Y + scale / 2)
                && (pointsArray[i][j].x * scale + scale + wallWidth / 2 >= cord_X - scale / 2 && pointsArray[i][j].y * scale + wallWidth / 2 >= cord_Y - scale / 2))
                {
                    if ((i >= middleHeight - 1 && i <= middleHeight + 1) && (j >= middleWidth - 1 && j <= middleWidth + 1))
                    {
                        if (curPoint.moveTable[i - middleHeight + 1][j - middleWidth + 1] == 0) {
                            ctx.clearRect(0, 0, canvasWidthResolution, canvasHeightResolution);
                            ctx.putImageData(myImgData, 0, 0);
                            ctx.strokeStyle = "blue";
                            ctx.beginPath();
                            ctx.moveTo(posX, posY);
                            ctx.lineTo(pointsArray[i][j].x * scale + scale + wallWidth / 2 + marginXY / 3, pointsArray[i][j].y * scale + wallWidth / 2 + marginXY / 3)
                            ctx.stroke();
                            ctx.closePath();
                            saveBoardState(i, j, true);
                            loadBoardState();
                            if (pointsArray[i][j].wall)
                                wallmove = true;
                            pointsArray[i][j].wall = true;
                            pointsArray[i][j].ghostWall = true;
                        }
                        if (!wallmove) {
                            let newGhost = new ghostMoves();
                            tmpPoint = JSON.parse(JSON.stringify(curPoint));
                            botTry(newGhost, tmpPoint)
                            log(bestGhost);
                            startDrawGhost = setInterval(function () { ghostDraw(); }, 400);
                            bestGhost.gateDistance = 100;
                        }
                    }
                }

    ///PUNKTY BRAMEK///
    for (let i = 0; i < gatewayArray.length; i++)
        for (let j = 0; j < gatewayArray[i].length; j++)
            if ((gatewayArray[i][j].x * scale + wallWidth / 2 <= cord_X + scale / 2 && gatewayArray[i][j].y * scale + wallWidth / 2 <= cord_Y + scale / 2)
                && (gatewayArray[i][j].x * scale + wallWidth / 2 >= cord_X - scale / 2 && gatewayArray[i][j].y * scale + wallWidth / 2 >= cord_Y - scale / 2))
                if (((posX + scale == gatewayArray[i][j].x * scale + wallWidth / 2 + marginXY / 3) || (posX - scale == gatewayArray[i][j].x * scale + wallWidth / 2 + marginXY / 3))
                    && ((posY - scale * 2 < gatewayArray[i][j].y * scale + wallWidth / 2 + marginXY / 3) && (posY + scale * 2 > gatewayArray[i][j].y * scale + wallWidth / 2 + marginXY / 3))) {
                    let value;
                    if (middleWidth == 10) value = 2;
                    else value = 0;
                    if ((curPoint.moveTable[j + 1 - (middleHeight - 3)][value] == 0)) {
                        ctx.clearRect(0, 0, canvasWidthResolution, canvasHeightResolution);
                        ctx.putImageData(myImgData, 0, 0);
                        ctx.strokeStyle = "blue";
                        ctx.beginPath();
                        ctx.moveTo(posX, posY);
                        ctx.lineTo(gatewayArray[i][j].x * scale + wallWidth / 2 + marginXY / 3, gatewayArray[i][j].y * scale + wallWidth / 2 + marginXY / 3);
                        ctx.stroke();
                        ctx.closePath();
                        saveBoardState(i, j, false);
                        loadBoardState();
                        endGame(i + 1);
                        return;
                    }
                }


}

canvas.addEventListener('mousemove', mouseMoveEvent, false);

canvas.addEventListener('click', clickEvent, false);