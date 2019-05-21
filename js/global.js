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



//?Graph
const addNode = (graph, node) => {
    graph.set(node, { out: new Set() });
};

const connectNodes = (graph, source, target) => {
    graph.get(source).out.add(target);
    graph.get(target).out.add(source);
};

const buildGraphFromEdges = (edges) => edges.reduce(
    (graph, { source, target }) => {
        if (!graph.has(source)) {
            addNode(graph, source);
        }

        if (!graph.has(target)) {
            addNode(graph, target);
        }

        connectNodes(graph, source, target);

        return graph;
    },
    new Map()
);

const buildPath = (target, path) => {
    const result = [];

    while (path.has(target)) {
        const source = path.get(target);
        result.push({ source, target });
        target = source;
    }

    return result.reverse();
};

const findPath = (source, target, graph) => {
    if (!graph.has(source)) {
        throw new Error('Unknown source.');
    }

    if (!graph.has(target)) {
        throw new Error('Unknown target.');
    }

    const queue = [source];
    const visited = new Set();
    const path = new Map();

    while (queue.length > 0) {
        const start = queue.shift();

        if (start === target) {
            return buildPath(start, path);
        }

        for (const next of graph.get(start).out) {
            if (visited.has(next)) {
                continue;
            }

            if (!queue.includes(next)) {
                path.set(next, start);
                queue.push(next);
            }
        }

        visited.add(start);
    }

    return null;
};

function createGraph(rows, columns) {
    let tab = new Array(rows + 1);
    for (let i = 0; i < tab.length; i++) {
        tab[i] = new Array(columns + 1);
    }

    for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= columns; j++) {
            if (j >= 1 && j < columns) {
                tab[i][j] = 1;
                continue;
            }
            else if (i >= rows / 2 - 1 && i <= rows / 2 + 1) {
                tab[i][j] = 1;
                continue;
            }
            else {
                tab[i][j] = -1;
            }
        }
    }

    let tabEdges = new Array();
    let horizontalBlock = false;
    let verticalBlock = false;
    let blockLeftGate = false;
    let blockRightGate = false;
    let blockTopGate = false;
    let blockBottomGate = false;

    for (let i = 0; i < tab.length; i++) {
        for (let j = 0; j < tab[i].length; j++) {
            if (tab[i] != -1 && tab[i][j] != -1) {
                if (i == rows / 2 - 1 && j == 1) {
                    blockLeftGate = true;
                    blockTopGate = true;
                }

                if (i == rows / 2 + 1 && j == 1) {
                    blockLeftGate = true;
                    blockBottomGate = true;
                }

                if (i == rows / 2 - 1 && j == columns - 1) {
                    blockRightGate = true;
                    blockTopGate = true;
                }

                if (i == rows / 2 + 1 && j == columns - 1) {
                    blockRightGate = true;
                    blockBottomGate = true;
                }

                if ((i == rows / 2 - 1 || i == rows / 2 + 1) && j == 0) {
                    continue;
                }

                if ((i == rows / 2 - 1 || i == rows / 2 + 1) && j == columns) {
                    continue;
                }

                if (i == 0 || i == rows) horizontalBlock = true;

                if ((i >= rows / 2 - 1 && i <= rows / 2 + 1) && (j == 0 || j == columns)) {
                    verticalBlock = true;
                    horizontalBlock = true;
                }

                if (!(i >= rows / 2 - 1 && i <= rows / 2 + 1) && (j == 1 || j == columns - 1)) verticalBlock = true;

                if (tab[i - 1] != undefined && tab[i - 1][j - 1] > -1 && verticalBlock == false) {
                    tabEdges.push({ source: `${i}_${j}`, target: `${i - 1}_${j - 1}` })
                }
                if (tab[i - 1] != undefined && tab[i - 1][j] > -1 && verticalBlock == false && blockTopGate == false) {
                    tabEdges.push({ source: `${i}_${j}`, target: `${i - 1}_${j}` })
                }
                if (tab[i - 1] != undefined && tab[i - 1][j + 1] > -1 && verticalBlock == false) {
                    tabEdges.push({ source: `${i}_${j}`, target: `${i - 1}_${j + 1}` })
                }
                if (tab[i][j - 1] > -1 && horizontalBlock == false && blockLeftGate == false) {
                    tabEdges.push({ source: `${i}_${j}`, target: `${i}_${j - 1}` })
                }
                if (tab[i][j + 1] > -1 && horizontalBlock == false && blockRightGate == false) {
                    tabEdges.push({ source: `${i}_${j}`, target: `${i}_${j + 1}` })
                }
                if (tab[i + 1] != undefined && tab[i + 1][j - 1] > -1 && verticalBlock == false) {
                    tabEdges.push({ source: `${i}_${j}`, target: `${i + 1}_${j - 1}` })
                }
                if (tab[i + 1] != undefined && tab[i + 1][j] > -1 && verticalBlock == false && blockBottomGate == false) {
                    tabEdges.push({ source: `${i}_${j}`, target: `${i + 1}_${j}` })
                }
                if (tab[i + 1] != undefined && tab[i + 1][j + 1] > -1 && verticalBlock == false) {
                    tabEdges.push({ source: `${i}_${j}`, target: `${i + 1}_${j + 1}` })
                }
                horizontalBlock = false;
                verticalBlock = false;
                blockLeftGate = false;
                blockRightGate = false;
                blockTopGate = false;
                blockBottomGate = false;
            }
        }
    }

    return buildGraphFromEdges(tabEdges);
}

