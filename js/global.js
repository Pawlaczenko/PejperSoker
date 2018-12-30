function log(x) {
    if (true)
        console.log(x);
}

function create2dArray(row,column){
    let tab = new Array(row+1);
    for(let i=0; i<=row;i++){
        tab[i]=new Array(column+1);
    }
    return tab;
}