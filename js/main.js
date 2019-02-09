
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

let marginXY = 15;
let curPoint;
let myImgData;
let posX;
let posY;
let color = 'blue';
let playerTurn = true;
let enemyGatePoint;
let bestGhost;
let bestPlayer;
let startDrawGhost;
let counter = 0;
let winFlag = false;
let debugmode = false;

function Board(squaresX, squaresY) {
    this.squaresX = squaresX;
    this.squaresY = squaresY;
    this.middleWidth = Math.ceil(squaresX / 2);
    this.middleHeight = Math.ceil(squaresY / 2);

    this.draw = function () {
        divBoard.appendChild(canvas);
        canvas.width = canvasWidthResolution;
        canvas.height = canvasHeightResolution;
    }
}

function Coordinates(x, y) {
    this.x = x;
    this.y = y;
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
    // this.ghostWall = false;
}

function ghostMoves() {
    this.pointsTab = [];
    this.enemyGateX = 100;
    this.enemyGateY = 100;
    this.awayGateX = 100;
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

function drawField(squaresX, squaresY, pointsArray) {
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

function pointsApply(squaresX, squaresY, pointsArray) {
    // WYPELNIANIE TABLICY SPECJALNYMI PKT
    for (let i = 0; i <= squaresY; i++) {
        for (let j = 0; j <= squaresX; j++) {
            pointsArray[i][j] = new Point(j, i);
            if (i == 0) {
                pointsArray[i][j].moveTable = [[2, 2, 2], [1, 2, 1], [0, 0, 0]];
                pointsArray[i][j].wall = true;
            }
            if (j == 0) {
                pointsArray[i][j].moveTable = [[2, 1, 0], [2, 2, 0], [2, 1, 0]];
                pointsArray[i][j].wall = true;
            }
            if (i == squaresY) {
                pointsArray[i][j].moveTable = [[0, 0, 0], [1, 2, 1], [2, 2, 2]];
                pointsArray[i][j].wall = true;
            }
            if (j == squaresX) {
                pointsArray[i][j].moveTable = [[0, 1, 2], [0, 2, 2], [0, 1, 2]];
                pointsArray[i][j].wall = true;
            }
        }
    }

    ///ROGI///
    pointsArray[0][0].moveTable = [[2, 2, 2], [2, 2, 1], [2, 1, 0]];
    pointsArray[0][0].wall = true;
    pointsArray[0][squaresX].moveTable = [[2, 2, 2], [1, 2, 2], [0, 1, 2]];
    pointsArray[0][squaresX].wall = true;
    pointsArray[squaresY][squaresX].moveTable = [[0, 1, 2], [1, 2, 2], [2, 2, 2]];
    pointsArray[squaresY][squaresX].wall = true;
    pointsArray[squaresY][0].moveTable = [[2, 1, 0], [2, 2, 1], [2, 2, 2]];
    pointsArray[squaresY][0].wall = true;

    ///BRAMKI///
    var side = ((squaresY - 2) / 2); //odleglosc_rogu_planszy_do_bramki
    pointsArray[side][0].moveTable = [[2, 1, 0], [1, 2, 0], [0, 0, 0]];
    pointsArray[side][0].wall = true;
    pointsArray[side + 1][0].moveTable = [[0, 0, 0], [0, 2, 0], [0, 0, 0]];
    pointsArray[side + 1][0].wall = false;
    pointsArray[side + 2][0].moveTable = [[0, 0, 0], [1, 2, 0], [2, 1, 0]];
    pointsArray[side + 2][0].wall = true;
    pointsArray[side][squaresX].moveTable = [[0, 1, 2], [0, 2, 1], [0, 0, 0]];
    pointsArray[side][squaresX].wall = true;
    pointsArray[side + 1][squaresX].moveTable = [[0, 0, 0], [0, 2, 0], [0, 0, 0]];
    pointsArray[side + 1][squaresX].wall = false;
    pointsArray[side + 2][squaresX].moveTable = [[0, 0, 0], [0, 2, 1], [0, 1, 2]];
    pointsArray[side + 2][squaresX].wall = true;

    // for (let i = 0; i <= squaresY; i++) {
    //     for (let j = 0; j <= squaresX; j++) {
    //         pointsArray[i][j].ghostWall = pointsArray[i][j].wall;
    //     }
    // }

    ///PUNKTY BRAMEK///
    gatewayArray[0][0] = new Point(0, side);
    gatewayArray[0][1] = new Point(0, (side) + 1);
    gatewayArray[0][2] = new Point(0, (side) + 2);
    gatewayArray[1][0] = new Point(squaresX + 2, side);
    gatewayArray[1][1] = new Point(squaresX + 2, (side) + 1);
    gatewayArray[1][2] = new Point(squaresX + 2, (side) + 2);
}

function setup() {
    let squaresX = 10;
    let squaresY = 8;
    let myboard = new Board(squaresX, squaresY);
    let pointsArray = create2dArray(8, 10);

    myboard.draw();

    bestGhost = new ghostMoves();
    bestPlayer = new ghostMoves();
    bestPlayer.enemyGateX = 0;
    bestPlayer.enemyGateY = 0;
    enemyGatePoint = new Point(squaresX + 1, squaresY / 2);

    ///NAKŁADANIE PUNKTÓW///
    pointsApply(squaresX, squaresY, pointsArray);
    ///RYSOWANIE PLANSZY///
    drawField(squaresX, squaresY, pointsArray);
    ///RYSOWANIE BRAMEK///
    drawGateway();

    myImgData = ctx.getImageData(0, 0, canvasWidthResolution, canvasHeightResolution);

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(pointsArray[myboard.middleHeight][myboard.middleWidth].x * scale + scale + wallWidth / 2 + marginXY / 3, pointsArray[myboard.middleHeight][myboard.middleWidth].y * scale + wallWidth / 2 + marginXY / 3, 15, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    pointsArray[myboard.middleHeight][myboard.middleWidth].wall = true;
    // pointsArray[myboard.middleHeight][myboard.middleWidth].ghostWall = true;
    curPoint = pointsArray[myboard.middleHeight][myboard.middleWidth];
    posX = curPoint.x * scale + scale + wallWidth / 2 + marginXY / 3;
    posY = curPoint.y * scale + wallWidth / 2 + marginXY / 3;

    canvas.addEventListener('mousemove', function () { mouseMoveEvent(event, myboard, pointsArray); }, false);

    canvas.addEventListener('click', function () { clickEvent(event, myboard, pointsArray); }, false);
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

function saveBoardState(i, j, bol, myboard, pointsArray) {
    if (bol) {
        myImgData = ctx.getImageData(0, 0, canvasWidthResolution, canvasHeightResolution);
        curPoint.moveTable[i - myboard.middleHeight + 1][j - myboard.middleWidth + 1] = 1;
        pointsArray[i][j].moveTable[2 - (i - myboard.middleHeight + 1)][2 - (j - myboard.middleWidth + 1)] = 1;
        curPoint = pointsArray[i][j];
        log(curPoint);
        posX = curPoint.x * scale + scale + wallWidth / 2 + marginXY / 3;
        posY = curPoint.y * scale + wallWidth / 2 + marginXY / 3;
        myboard.middleHeight = i;
        myboard.middleWidth = j;
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

function ghostDraw(myboard, pointsArray) {
    ctx.clearRect(0, 0, canvasWidthResolution, canvasHeightResolution);
    ctx.putImageData(myImgData, 0, 0);
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(posX, posY);
    ctx.lineTo(bestGhost.pointsTab[counter].x * scale + scale + wallWidth / 2 + marginXY / 3, bestGhost.pointsTab[counter].y * scale + wallWidth / 2 + marginXY / 3)
    ctx.stroke();
    ctx.closePath();
    saveBoardState(bestGhost.pointsTab[counter].y, bestGhost.pointsTab[counter].x, true, myboard, pointsArray);
    loadBoardState();
    pointsArray[bestGhost.pointsTab[counter].y][bestGhost.pointsTab[counter].x].wall = true;
    // pointsArray[bestGhost.pointsTab[counter].y][bestGhost.pointsTab[counter].x].ghostWall = true;
    counter++;
    if (counter == bestGhost.pointsTab.length) {
        counter = 0;
        changePlayer();
        clearInterval(startDrawGhost);
    }

}

function playerCheckTurn(nowGhost, tmpPoint, pointsArray) {
    for (let i = tmpPoint.y - 1; i <= tmpPoint.y + 1; i++)
        for (let j = tmpPoint.x - 1; j <= tmpPoint.x + 1; j++)
            if (tmpPoint.moveTable[i - tmpPoint.y + 1][j - tmpPoint.x + 1] == 0) {
                if (j == -1) {
                    nowGhost.enemyGateX = pointsArray[i].length;
                    bestPlayer = Object.assign({}, nowGhost);
                    winFlag = true;
                    return;
                }
                if (j == pointsArray[i].length)
                    break;
                nowGhost.enemyGateX = (enemyGatePoint.x - pointsArray[i][j].x);
                nowGhost.enemyGateY = Math.abs(enemyGatePoint.y - pointsArray[i][j].y);
                // pointsArray[i][j].ghostWall = true;
                pointsArray[tmpPoint.y][tmpPoint.x].moveTable[i - tmpPoint.y + 1][j - tmpPoint.x + 1] = 1;
                pointsArray[i][j].moveTable[2 - (i - tmpPoint.y + 1)][2 - (j - tmpPoint.x + 1)] = 1;

                if (pointsArray[i][j].wall && !(i == tmpPoint.y && j == tmpPoint.x + 1)) {
                    let newPoint = copyObj(pointsArray[i][j]);
                    let newGhost = Object.assign({}, nowGhost);
                    playerCheckTurn(newGhost, newPoint, pointsArray)
                    if (winFlag == true) {
                        // pointsArray[i][j].ghostWall = pointsArray[i][j].wall;
                        pointsArray[tmpPoint.y][tmpPoint.x].moveTable[i - tmpPoint.y + 1][j - tmpPoint.x + 1] = 0;
                        pointsArray[i][j].moveTable[2 - (i - tmpPoint.y + 1)][2 - (j - tmpPoint.x + 1)] = 0;
                        return;
                    }
                }
                else
                    if (nowGhost.enemyGateX > bestPlayer.enemyGateX) {
                        bestPlayer = Object.assign({}, nowGhost);
                    }
                    else {
                        if (nowGhost.enemyGateX == bestPlayer.enemyGateX)
                            if (nowGhost.enemyGateY < bestPlayer.enemyGateY)
                                bestPlayer = Object.assign({}, nowGhost);
                    }
                // pointsArray[i][j].ghostWall = pointsArray[i][j].wall;
                pointsArray[tmpPoint.y][tmpPoint.x].moveTable[i - tmpPoint.y + 1][j - tmpPoint.x + 1] = 0;
                pointsArray[i][j].moveTable[2 - (i - tmpPoint.y + 1)][2 - (j - tmpPoint.x + 1)] = 0;
            }
}

function botTry(nowGhost, tmpPoint, pointsArray) {
    for (let i = tmpPoint.y - 1; i <= tmpPoint.y + 1; i++)
        for (let j = tmpPoint.x - 1; j <= tmpPoint.x + 1; j++)
            if (tmpPoint.moveTable[i - tmpPoint.y + 1][j - tmpPoint.x + 1] == 0) {
                if (j == - 1)
                    break;
                if (j == pointsArray[i].length) {
                    nowGhost.pointsTab.push(new Coordinates(gatewayArray[1][1].x - 1, gatewayArray[1][1].y))
                    nowGhost.enemyGateX = 0;
                    bestGhost = JSON.parse(JSON.stringify(nowGhost));
                    winFlag = true;
                    return;
                }
                nowGhost.pointsTab.push(new Coordinates(pointsArray[i][j].x, pointsArray[i][j].y))
                nowGhost.enemyGateX = (enemyGatePoint.x - pointsArray[i][j].x);
                nowGhost.enemyGateY = Math.abs(enemyGatePoint.y - pointsArray[i][j].y);
                // pointsArray[i][j].ghostWall = true;
                pointsArray[tmpPoint.y][tmpPoint.x].moveTable[i - tmpPoint.y + 1][j - tmpPoint.x + 1] = 1;
                pointsArray[i][j].moveTable[2 - (i - tmpPoint.y + 1)][2 - (j - tmpPoint.x + 1)] = 1;
                let newPoint = copyObj(pointsArray[i][j]);
                let newGhost = Object.assign({}, nowGhost);
                if (pointsArray[i][j].wall) {
                    botTry(newGhost, newPoint, pointsArray)
                    if (winFlag == true)
                        return;
                }
                else {
                    playerCheckTurn(newGhost, newPoint, pointsArray);
                    winFlag = false;
                    // loadBoardState();
                    if (nowGhost.enemyGateX < bestGhost.enemyGateX) {
                        if (bestPlayer.enemyGateX <= bestGhost.awayGateX) {
                            bestGhost = JSON.parse(JSON.stringify(nowGhost));
                            bestGhost.awayGateX = bestPlayer.enemyGateX;
                        }
                    }
                    else {
                        if (nowGhost.enemyGateX == bestGhost.enemyGateX)
                            if (bestPlayer.enemyGateX < bestGhost.awayGateX) {
                                bestGhost = JSON.parse(JSON.stringify(nowGhost));
                                bestGhost.awayGateX = bestPlayer.enemyGateX;
                            }
                            // else
                            //     if (nowGhost.enemyGateY < bestGhost.enemyGateY)
                            //         bestGhost = JSON.parse(JSON.stringify(nowGhost));
                    }
                    bestPlayer.enemyGateX = 0;
                    bestPlayer.enemyGateY = 0;
                    bestPlayer.awayGateX = 100;
                }
                // pointsArray[i][j].ghostWall = false;
                pointsArray[tmpPoint.y][tmpPoint.x].moveTable[i - tmpPoint.y + 1][j - tmpPoint.x + 1] = 0;
                pointsArray[i][j].moveTable[2 - (i - tmpPoint.y + 1)][2 - (j - tmpPoint.x + 1)] = 0;
                nowGhost.pointsTab.pop();
            }
}

function mouseMoveEvent(evt, myboard, pointsArray) {
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
                if ((i >= myboard.middleHeight - 1 && i <= myboard.middleHeight + 1) && (j >= myboard.middleWidth - 1 && j <= myboard.middleWidth + 1))
                    if (curPoint.moveTable[i - myboard.middleHeight + 1][j - myboard.middleWidth + 1] == 0) {
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
                    if (myboard.middleWidth == 10) value = 2;
                    else value = 0;
                    if ((curPoint.moveTable[j + 1 - (myboard.middleHeight - 3)][value] == 0)) {
                        loadBoardState();
                        ctx.beginPath();
                        ctx.fillStyle = color;
                        ctx.arc(gatewayArray[i][j].x * scale + wallWidth / 2 + marginXY / 3, gatewayArray[i][j].y * scale + wallWidth / 2 + marginXY / 3, 15, 0, Math.PI * 2, false);
                        ctx.fill();
                        ctx.closePath();
                    }
                }
}

function clickEvent(evt, myboard, pointsArray) {
    var mousePos = getMousePos(canvas, evt);
    var przelicznik_na_x = canvasWidthResolution / boardWidth;
    var przelicznik_na_y = canvasHeightResolution / boardHeight;
    var cord_X = mousePos.x * przelicznik_na_x;
    var cord_Y = mousePos.y * przelicznik_na_y;
    let wallmove = false;

    ///PUNKTY MAPY///
    if (playerTurn) {
        for (let i = 0; i < pointsArray.length; i++)
            for (let j = 0; j < pointsArray[i].length; j++)
                if ((pointsArray[i][j].x * scale + scale + wallWidth / 2 <= cord_X + scale / 2 && pointsArray[i][j].y * scale + wallWidth / 2 <= cord_Y + scale / 2)
                    && (pointsArray[i][j].x * scale + scale + wallWidth / 2 >= cord_X - scale / 2 && pointsArray[i][j].y * scale + wallWidth / 2 >= cord_Y - scale / 2)) {
                    if ((i >= myboard.middleHeight - 1 && i <= myboard.middleHeight + 1) && (j >= myboard.middleWidth - 1 && j <= myboard.middleWidth + 1)) {
                        if (curPoint.moveTable[i - myboard.middleHeight + 1][j - myboard.middleWidth + 1] == 0) {
                            ctx.clearRect(0, 0, canvasWidthResolution, canvasHeightResolution);
                            ctx.putImageData(myImgData, 0, 0);
                            ctx.strokeStyle = "blue";
                            ctx.beginPath();
                            ctx.moveTo(posX, posY);
                            ctx.lineTo(pointsArray[i][j].x * scale + scale + wallWidth / 2 + marginXY / 3, pointsArray[i][j].y * scale + wallWidth / 2 + marginXY / 3)
                            ctx.stroke();
                            ctx.closePath();
                            saveBoardState(i, j, true, myboard, pointsArray);
                            loadBoardState();
                            if (pointsArray[i][j].wall)
                                wallmove = true;
                            pointsArray[i][j].wall = true;
                            // pointsArray[i][j].ghostWall = true;

                            if (!wallmove) {
                                changePlayer();
                                let newGhost = new ghostMoves();
                                tmpPoint = copyObj(curPoint);
                                botTry(newGhost, tmpPoint, pointsArray)
                                startDrawGhost = setInterval(function () { ghostDraw(myboard, pointsArray); }, 400);
                                bestGhost.enemyGateX = 100;
                                bestGhost.enemyGateY = 100;
                                bestGhost.awayGateX = 100;
                                winFlag = false;
                            }
                        }
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
                    if (myboard.middleWidth == 10) value = 2;
                    else value = 0;
                    if ((curPoint.moveTable[j + 1 - (myboard.middleHeight - 3)][value] == 0)) {
                        ctx.clearRect(0, 0, canvasWidthResolution, canvasHeightResolution);
                        ctx.putImageData(myImgData, 0, 0);
                        ctx.strokeStyle = "blue";
                        ctx.beginPath();
                        ctx.moveTo(posX, posY);
                        ctx.lineTo(gatewayArray[i][j].x * scale + wallWidth / 2 + marginXY / 3, gatewayArray[i][j].y * scale + wallWidth / 2 + marginXY / 3);
                        ctx.stroke();
                        ctx.closePath();
                        saveBoardState(i, j, false, myboard, pointsArray);
                        loadBoardState();
                        endGame(i + 1);
                        return;
                    }
                }
}

