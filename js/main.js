let squaresX = 10;
let squaresY = 8;
let pointsArray = create2dArray(8,10);
let canvas = document.createElement("canvas");
let ctx = canvas.getContext('2d');
let scale = 150;

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

    this.draw=function(){
        ctx.beginPath();
            ctx.arc((this.x+1)*scale,this.y*scale,10,0,2*Math.PI,false);
            ctx.fill();
        ctx.closePath();
    }
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

            pointsArray[i][j].draw();
        }
    }

    ///ROGI///
    pointsArray[0][0].moveTable = [[2, 2, 2], [2, 2, 1], [2, 1, 0]];
    pointsArray[0][squaresX].moveTable = [[2, 2, 2], [1, 2, 2], [0, 1, 2]];
    pointsArray[squaresY][squaresX].moveTable = [[0, 1, 2], [1, 2, 2], [2, 2, 2]];
    pointsArray[squaresY][0].moveTable = [[2, 1, 0], [2, 2, 1], [2, 2, 2]];

    ///BRAMKI///
    pointsArray[((squaresY - 2) / 2) + 1][0].moveTable = [[2, 1, 0], [1, 2, 0], [0, 0, 0]];
    pointsArray[((squaresY - 2) / 2) + 2][0].moveTable = [[0, 0, 0], [0, 2, 0], [0, 0, 0]];
    pointsArray[((squaresY - 2) / 2) + 3][0].moveTable = [[0, 0, 0], [1, 2, 0], [2, 1, 0]];
    pointsArray[((squaresY - 2) / 2) + 1][squaresX].moveTable = [[0, 1, 2], [0, 2, 1], [0, 0, 0]];
    pointsArray[((squaresY - 2) / 2) + 2][squaresX].moveTable = [[0, 0, 0], [0, 2, 0], [0, 0, 0]];
    pointsArray[((squaresY - 2) / 2) + 3][squaresX].moveTable = [[0, 0, 0], [0, 2, 1], [0, 1, 2]];

}

setup();
