function logs() {

    if (true) {
        let arg = '';
        for (var i = 0; i < arguments.length; i++) arg += arguments[i] + '--';
        console.log(arg);
    }

}

function log(arg) {

    if (true) {
        console.log(arg);
    }

}

function create2dArray(row, column) {
    let tab = new Array(row + 1);
    for (let i = 0; i <= row; i++) {
        tab[i] = new Array(column + 1);
    }
    return tab;
}

function colorRullete() {
    let r = Math.floor((Math.random() * 255));
    let g = Math.floor((Math.random() * 255));
    let b = Math.floor((Math.random() * 255));
    let color = 'rgb(' + r + ',' + g + ',' + b + ')';

    return color;
}

function copyObj(obj, bool = false) {

    if (bool == false) {
        var newObj = new Object();
        for (let x in obj) {
            if (Array.isArray(obj[x])) {
                newObj[x] = copyObj(obj[x], true);
                break;
            }
            if (typeof obj[x] == 'object') {
                newObj[x] = copyObj(obj[x]);
            }
            else
                newObj[x] = obj[x];
        }
    }
    else {

        var newObj = create2dArray(obj.length, obj[0].length);
        for (let i = 0; i < obj.length; i++)
            for (let j = 0; j < obj[i].length; j++)
                newObj[i][j] = obj[i][j];
    }
    // else {
    //     if (Array.isArray(obj[0])) {
    //         var newObj = create2dArray(obj.length, obj[0].length);
    //         for (let i = 0; i < obj.length; i++)
    //             for (let j = 0; j < obj[i].length; j++)
    //                 newObj[i][j] = obj[i][j];
    //     }
    //     else {
    //         var newObj = new Object();
    //         for (let x in obj) {
    //             if (typeof obj[x] == 'object') {
    //                 if (Array.isArray(obj[x])) {
    //                     newObj[x] = copyObj(obj[x], true);
    //                 }
    //                 else
    //                     newObj[x] = copyObj(obj[x]);
    //             }
    //             else
    //                 newObj[x] = obj[x];
    //         }
    //     }
    // }
    return newObj;
}