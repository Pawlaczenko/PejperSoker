// let tab = new Array(4);

// for (let i = 0; i < tab.length; i++) {
//     tab[i] = new Array(4);
// }
// counter = 1;
// for (let i = 0; i < tab.length; i++) {
//     for (let j = 0; j < tab.length; j++) {
//         tab[i][j] = counter;
//         counter++;
//     }
// }

// let pathTab = new Array(16);
// for (let i = 0; i < pathTab.length; i++) {
//     pathTab[i] = new Array();
// }


// for (let i = 0; i < tab.length; i++) {
//     for (let j = 0; j < tab[i].length; j++) {
//         let curNumber = i * 4 + j;
//         if (curNumber - 5 >= 0) {
//             pathTab[curNumber].push(curNumber - 5)
//         }
//         if (curNumber - 4 >= 0) {
//             pathTab[curNumber].push(curNumber - 4)
//         }
//         if (curNumber - 3 >= 0) {
//             pathTab[curNumber].push(curNumber - 3)
//         }
//         if (curNumber - 1 >= 0) {
//             pathTab[curNumber].push(curNumber - 1)
//         }
//         if (curNumber + 1 < pathTab.length) {
//             pathTab[curNumber].push(curNumber + 1)
//         }
//         if (curNumber + 3 < pathTab.length) {
//             pathTab[curNumber].push(curNumber + 3)
//         }
//         if (curNumber + 4 < pathTab.length) {
//             pathTab[curNumber].push(curNumber + 4)
//         }
//         if (curNumber + 5 < pathTab.length) {
//             pathTab[curNumber].push(curNumber + 5)
//         }

//     }


// }

// pathTab[0].push(1)
// pathTab[0].push(4)
// pathTab[0].push(5)

// console.log(tab);
// console.log(pathTab);


/* let Graph = function () {
    this.storage = {};
    this.size = 0;
}

Graph.prototype.add = function (value) {
    this.storage[value] = {};
    this.size++;
}

Graph.prototype.addConnection = function (fr, to) {
    this.storage[fr][to] = true;
    this.storage[to][fr] = true;
}

Graph.prototype.removeConnection = function (fr, to) {
    delete this.storage[fr][to];
    delete this.storage[to][fr];
}

Graph.prototype.contains = function (taget) {
    return this.storage.hasOwnProperty(taget);
}

Graph.prototype.hasConnection = function (fr, to) {
    return this.storage[fr].hasOwnProperty(to);
}

Graph.prototype.remove = function (val) {
    delete this.storage[val];
    this.size--;
    for (let key in this.storage) {
        if (this.storage[key][val]) {
            delete this.storage[key][val];
        }
    }
}


let maple = new Graph();
maple.add(1);
maple.add(2);
maple.add(3);
maple.add(4);
maple.add(5);
maple.add(6);
maple.add(7);
maple.add(8);
maple.add(9);

maple.addConnection(1, 2);
maple.addConnection(1, 4);
maple.addConnection(1, 5);
maple.addConnection(2, 3);
maple.addConnection(2, 4);
maple.addConnection(2, 5);
maple.addConnection(2, 6);

 */

const addNode = (graph, node) => {
    graph.set(node, { in: new Set(), out: new Set() });
};

const connectNodes = (graph, source, target) => {
    graph.get(source).out.add(target);
    graph.get(target).in.add(source);
    graph.get(source).in.add(target);
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

//  A --* B
//      / | \
//     *  |  *
//    C   |   D --* E
//     \  |  /     *
//      * * *     /
//        F------/

let rows = 8;
let columns = 10;

let tab = new Array(rows + 1);
for (let i = 0; i < tab.length; i++) {
    tab[i] = new Array(columns + 1);
}
counter = 0;
// for (let i = 0; i < tab.length; i++) {
//     for (let j = 0; j < tab.length; j++) {
//         tab[i][j] = counter;
//         counter++;
//     }
// }

for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= columns; j++) {
        if (j >= 1 && j < columns) {
            tab[i][j] = counter;
            counter++;
            continue;
        }
        else if (i >= rows / 2 - 1 && i <= rows / 2 + 1) {
            tab[i][j] = counter;
            counter++;
            continue;
        }
        else {
            tab[i][j] = -1;
        }
    }
}

// for (let i = 0; i < tab.length; i++) {
//     for (let j = 0; j < tab[i].length; j++) {
//         if (tab[i][j] == undefined) tab[i].shift();

//     }

// }

let tabEdges = new Array();
let horizontalBlock = false;
let verticalBlock = false;

for (let i = 0; i < tab.length; i++) {
    for (let j = 0; j < tab[i].length; j++) {
        if (tab[i] != -1 && tab[i][j] != -1) {
            if ((i == rows / 2 - 1 || i == rows / 2 + 1) && j == 0) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i}_${j + 1}` })
                continue;
            }

            if ((i == rows / 2 - 1 || i == rows / 2 + 1) && j == columns) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i}_${j - 1}` })
                continue;
            }

            if (i == 0 || i == rows) horizontalBlock = true;

            if ((i >= rows / 2 - 1 && i <= rows / 2 + 1) && (j == 0 || j == columns)) verticalBlock = true;

            if (!(i >= rows / 2 - 1 && i <= rows / 2 + 1) && (j == 1 || j == columns - 1)) verticalBlock = true;

            if (tab[i - 1] != undefined && tab[i - 1][j - 1] > -1 && verticalBlock == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i - 1}_${j - 1}` })
            }
            if (tab[i - 1] != undefined && tab[i - 1][j] > -1 && verticalBlock == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i - 1}_${j}` })
            }
            if (tab[i - 1] != undefined && tab[i - 1][j + 1] > -1 && verticalBlock == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i - 1}_${j + 1}` })
            }
            if (tab[i][j - 1] > -1 && horizontalBlock == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i}_${j - 1}` })
            }
            if (tab[i][j + 1] > -1 && horizontalBlock == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i}_${j + 1}` })
            }
            if (tab[i + 1] != undefined && tab[i + 1][j - 1] > -1 && verticalBlock == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i + 1}_${j - 1}` })
            }
            if (tab[i + 1] != undefined && tab[i + 1][j] > -1 && verticalBlock == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i + 1}_${j}` })
            }
            if (tab[i + 1] != undefined && tab[i + 1][j + 1] > -1 && verticalBlock == false) {
                tabEdges.push({ source: `${i}_${j}`, target: `${i + 1}_${j + 1}` })
            }
            horizontalBlock = false;
            verticalBlock = false;
        }
    }
}

const graph = buildGraphFromEdges(tabEdges);

console.log('0 -> 15', findPath("0_1", "4_10", graph));

