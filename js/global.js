function create2dArray(row, column) {
    let tab = new Array(row + 1);
    for (let i = 0; i <= row; i++) {
        tab[i] = new Array(column + 1);
    }
    return tab;
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
    return newObj;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}