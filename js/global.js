function logs() {

    if (true)
    {
        let arg = '';
        for (var i=0; i<arguments.length; i++) arg += arguments[i]+'--';
        console.log(arg);
    }

}

function log(arg) {

    if (true)
    {
        console.log(arg);
    }

}

function create2dArray(row,column){
    let tab = new Array(row+1);
    for(let i=0; i<=row;i++){
        tab[i]=new Array(column+1);
    }
    return tab;
}

function colorRullete(){
    let r = Math.floor((Math.random() * 255));
    let g = Math.floor((Math.random() * 255));
    let b = Math.floor((Math.random() * 255));
    let color = 'rgb('+r+','+g+','+b+')';

    return color;
}