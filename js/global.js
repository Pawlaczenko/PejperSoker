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

const findLowestCostNode = (costs, processed) => {
    const knownNodes = Object.keys(costs)

    const lowestCostNode = knownNodes.reduce((lowest, node) => {
        if (lowest === null && !processed.includes(node)) {
            lowest = node;
        }
        if (costs[node] < costs[lowest] && !processed.includes(node)) {
            lowest = node;
        }
        return lowest;
    }, null);

    return lowestCostNode
};

const dijkstra = (startNodeName, endNodeName, graph) => {

    // track the lowest cost to reach each node
    let costs = {};
    let makeCostObject = new Object();
    for (const child of graph.get(startNodeName).out) {
        makeCostObject[child] = graph.get(child).wallValue;
    }
    costs[endNodeName] = "Infinity";
    costs = Object.assign(costs, makeCostObject);


    // track paths
    const parents = { startNodeName: null };
    for (let child of graph.get(startNodeName).out) {
        let parentValArray = new Array();
        let parentVal = new Object();
        parentVal[startNodeName] = graph.get(child).wallValue;
        parentValArray.push(parentVal)
        parents[child] = parentValArray;
    }

    // track nodes that have already been processed
    const processed = [];

    let node = findLowestCostNode(costs, processed);
    // break1:
    while (node) {
        let cost = costs[node];
        let children = graph.get(node);
        for (let n of children.out) {
            if (String(n) !== String(startNodeName)) {
                let newCost = cost + graph.get(n).wallValue;
                if (costs[n] == undefined || costs[n] > newCost) {
                    costs[n] = newCost;


                }
                let parentValArray = new Array();
                let parentVal = new Object();
                parentVal[node] = newCost
                parentValArray.push(parentVal);
                if (parents[n] == undefined)
                    parents[n] = parentValArray;
                else parents[n].push(parentVal)
                // if (n === endNodeName) {
                //     break break1;
                // }

            }
        }
        processed.push(node);
        node = findLowestCostNode(costs, processed);
    }

    let optimalPathArray = new Array();
    let flag = { status: false, rounds: -1 };

    for (let k = 0; k < 5; k++) {
        let optimalPath = [endNodeName];
        let parent = parents[endNodeName];
        break1:
        while (parent) {
            for (let j = 0; j < parent.length; j++) {
                for (let i in parent[j]) {
                    if (i == startNodeName) {
                        optimalPath.push(i);
                        break break1;
                    }
                }
            }
            let key;

            if (parent[k - 1] != undefined && parent[k] != undefined) {
                if (Object.values(parent[k])[0] == Object.values(parent[0])[0]) {
                    key = Object.keys(parent[k])[0];
                }
                else if (Object.values(parent[k - 1])[0] == Object.values(parent[0])[0]) {
                    key = Object.keys(parent[k - 1])[0];
                }
                else if (parent[k - 2] != undefined && Object.values(parent[k - 2])[0] == Object.values(parent[0])[0]) {
                    key = Object.keys(parent[k - 2])[0];
                }
                else {
                    key = Object.keys(parent[0])[0];
                }
            }
            else {
                key = Object.keys(parent[0])[0];
            }

            for (element of optimalPath) {
                if (key == element) {
                    if (k >= 2 && k < optimalPath.length) {
                        key = Object.keys(parent[0])[0];
                    }
                    // if (parent[k - 1] != undefined && parent[k] != undefined)
                    // if (Object.keys(parent[k - 1])[0] == key)
                    //     key = Object.keys(parent[k])[0];
                    // else if (Object.keys(parent[k])[0] == key) {
                    //     key = Object.keys(parent[k - 1])[0];
                    // }
                }
            }
            //     if (parent[1] != undefined && k > 0 && Object.values(parent[1])[0] == Object.values(parent[0])[0] && flag.rounds <= counter && flag.status == false) {
            //         if (flag.rounds == counter) {
            //             key = Object.keys(parent[1])[0];

            //         }
            //         else {
            //             key = Object.keys(parent[1])[0];
            //             flag.status = true;
            //             flag.rounds = counter;
            //         }
            //     }
            //     else
            //         key = Object.keys(parent[0])[0];
            optimalPath.push(key);
            parent = parents[key];
            //     counter++;
        }
        // optimalPath.reverse();
        optimalPathArray.push(optimalPath)
        flag.status = false;
    }

    const results = {
        distance: costs[endNodeName],
        path: optimalPathArray
    };
    console.log(results.distance);
    if (results.distance === "Infinity") return false
    return results;
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

