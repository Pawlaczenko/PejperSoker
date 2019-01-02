let squaresX = 10;
let squaresY = 8;
let pointsArray = create2dArray(8,10);
let gatewayArray = create2dArray(2, 1);
let canvas = document.createElement("canvas");
let ctx = canvas.getContext('2d');
let scale = 140;

function Board(div_id) 
{
    this.div = document.getElementById(div_id);
    this.canvasWidthResolution = 1800;
    this.canvasHeightResolution = 1200;
    this.squaresX = squaresX;
    this.squaresY = squaresY;

    this.draw = function () 
    {
        this.div.appendChild(canvas);
        canvas.width = this.canvasWidthResolution;
        canvas.height = this.canvasHeightResolution;        
    }
}

function Point(x,y){
    this.x = x;
    this.y = y;
    this.moveTable = 
    [
        [0,0,0],
        [0,2,0],
        [0,0,0]
    ];

    // this.draw=function(){
    //     ctx.beginPath();
    //         ctx.arc((this.x+1)*scale,this.y*scale,10,0,2*Math.PI,false);
    //         ctx.fill();
    //     ctx.closePath();
    // }
}

function drawLine(x1,y1,x2,y2){
    ctx.lineCap = "round";
    ctx.beginPath();
        ctx.moveTo((x1+1)*scale,y1*scale+10);// to plus 10 to ustawnia marginsow
        ctx.lineTo((x2+1)*scale,y2*scale+10);
        ctx.stroke();
    ctx.closePath();
}

function setup(){
    var myboard = new Board("board");
    myboard.draw();

    for(let i=0; i<=squaresY; i++){
        for(let j=0; j<=squaresX;j++){
            pointsArray[i][j]=new Point(j,i);
            if (i == 0) pointsArray[i][j].moveTable = [[2, 2, 2], [1, 2, 1], [0, 0, 0]];
            if (j == 0) pointsArray[i][j].moveTable = [[2, 1, 0], [2, 2, 0], [2, 1, 0]];
            if (i == squaresY) pointsArray[i][j].moveTable = [[0, 0, 0], [1, 2, 1], [2, 2, 2]];
            if (j == squaresX) pointsArray[i][j].moveTable = [[0, 1, 2], [0, 2, 2], [0, 1, 2]];

            // pointsArray[i][j].draw();
        }
    }

    ///ROGI///
    pointsArray[0][0].moveTable = [[2, 2, 2], [2, 2, 1], [2, 1, 0]];
    pointsArray[0][squaresX].moveTable = [[2, 2, 2], [1, 2, 2], [0, 1, 2]];
    pointsArray[squaresY][squaresX].moveTable = [[0, 1, 2], [1, 2, 2], [2, 2, 2]];
    pointsArray[squaresY][0].moveTable = [[2, 1, 0], [2, 2, 1], [2, 2, 2]];

    ///BRAMKI///
    pointsArray[((squaresY - 2) / 2)][0].moveTable = [[2, 1, 0], [1, 2, 0], [0, 0, 0]];
    pointsArray[((squaresY - 2) / 2) + 1][0].moveTable = [[0, 0, 0], [0, 2, 0], [0, 0, 0]];
    pointsArray[((squaresY - 2) / 2) + 2][0].moveTable = [[0, 0, 0], [1, 2, 0], [2, 1, 0]];
    pointsArray[((squaresY - 2) / 2)][squaresX].moveTable = [[0, 1, 2], [0, 2, 1], [0, 0, 0]];
    pointsArray[((squaresY - 2) / 2) + 1][squaresX].moveTable = [[0, 0, 0], [0, 2, 0], [0, 0, 0]];
    pointsArray[((squaresY - 2) / 2) + 2][squaresX].moveTable = [[0, 0, 0], [0, 2, 1], [0, 1, 2]];

    ///RYSOWANIE PLANSZY///
    for (let i = 0; i <= squaresY; i++) {
        for (let j = 0; j <= squaresX; j++) {
            if (pointsArray[i][j].moveTable[2][1] == 0) {
                ctx.lineWidth = 5;
                drawLine(pointsArray[i][j].x, pointsArray[i][j].y, pointsArray[i + 1][j].x, pointsArray[i + 1][j].y);
            }
            if (pointsArray[i][j].moveTable[2][1] == 1) {
                ctx.lineWidth = 20;
                drawLine(pointsArray[i][j].x, pointsArray[i][j].y, pointsArray[i + 1][j].x, pointsArray[i + 1][j].y);
            }
            if (j != squaresX) {
                if (pointsArray[i][j].moveTable[1][2] == 0) {
                    ctx.lineWidth = 5;
                    drawLine(pointsArray[i][j].x, pointsArray[i][j].y, pointsArray[i][j + 1].x, pointsArray[i][j + 1].y);
                }
                if (pointsArray[i][j].moveTable[1][2] == 1) {
                    ctx.lineWidth = 20;
                    drawLine(pointsArray[i][j].x, pointsArray[i][j].y, pointsArray[i][j + 1].x, pointsArray[i][j + 1].y);
                }
            }
        }
    }

    ///PUNKTY BRAMEK///
    gatewayArray[0][0] = new Point(((squaresY - 2) / 2,0));
    gatewayArray[1][0] = new Point(((squaresY - 2) / 2)+1, 0);
    gatewayArray[2][0] = new Point(((squaresY - 2) / 2)+2, 0);
    gatewayArray[0][1] = new Point(((squaresY - 2) / 2), squaresX);
    gatewayArray[1][1] = new Point(((squaresY - 2) / 2)+1, squaresX);
    gatewayArray[2][1] = new Point(((squaresY - 2) / 2)+2, squaresX);
    log(gatewayArray);
    ///RYSOWANIE BRAMEK///
    
    

    
}

setup();
