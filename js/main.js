function Board(div_id) 
{
    this.div = document.getElementById(div_id);
    log(this.div);
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext('2d');
    this.canvasWidthResolution = 1800;
    this.canvasHeightResolution = 1200;
    this.squaresX = 10;
    this.squaresY = 8;

    this.setup = function () 
    {
        this.div.appendChild(this.canvas);
        this.canvas.width = this.canvasWidthResolution;
        this.canvas.height = this.canvasHeightResolution;
        this.ctx.moveTo(0,0);
        this.ctx.lineTo(this.canvasWidthResolution,this.canvasHeightResolution);
        this.ctx.stroke();

        this.ctx.moveTo(0, this.canvasHeightResolution);
        this.ctx.lineTo(this.canvasWidthResolution,0);
        this.ctx.stroke();
        
    }
}

function Point(x,y){
    this.x = x;
    this.y = y;
    this.moveTable = 
    [
        [0,0,0],
        [0,0],
        [0,0,0]
    ];
}

var myboard = new Board("board");
myboard.setup();

//--------------------------------------------
function log(x)
{
    if(true)
        console.log(x);
}