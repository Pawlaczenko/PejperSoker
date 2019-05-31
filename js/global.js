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



const findLowestCostNode = (costs, processed, endPoint = -1) => {
    const knownNodes = Object.keys(costs)

    const lowestCostNode = knownNodes.reduce((lowest, node) => {
        if (node == endPoint && costs[node] != "Infinity") {
            return node;
        }
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

const findSinglePath = (startNodeName, endNodeName, graph) => {

    let costs = {};
    let makeCostObject = new Object();
    for (const child of graph.get(startNodeName).out) {
        makeCostObject[child] = graph.get(child).wallValue;
    }
    costs = Object.assign(costs, makeCostObject);
    costs[endNodeName] = "Infinity";

    const parents = { endNodeName: null };
    for (let child of graph.get(startNodeName).out) {
        parents[child] = startNodeName;
        if (child === endNodeName) {
            let optimalPath = [startNodeName];
            const results = {
                distance: 1,
                path: optimalPath
            };
            return results;
        }

    }


    const processed = [];

    let node = findLowestCostNode(costs, processed, endNodeName);
    break1:
    while (node) {
        if (node == endNodeName) {
            costs[endNodeName] = 1;
            break;
        }
        let cost = costs[node];
        let children = graph.get(node);
        for (let n of children.out) {
            if (String(n) !== String(startNodeName)) {
                let newCost = cost + graph.get(n).wallValue;
                if (costs[n] == undefined || costs[n] > newCost) {
                    costs[n] = newCost;
                    parents[n] = node;
                    if (n === endNodeName) {
                        break break1;
                    }
                }
            }
        }
        processed.push(node);
        node = findLowestCostNode(costs, processed);
    }

    let optimalPath = [endNodeName];
    let parent = parents[endNodeName];
    while (parent) {
        optimalPath.push(parent);
        parent = parents[parent];
    }

    const results = {
        distance: costs[endNodeName],
        path: optimalPath
    };
    if (results.distance === "Infinity") return false
    return results;
};

const findAllSinglePath = (startNodeName, graph) => {

    let costs = {};
    let makeCostObject = new Object();
    for (const child of graph.get(startNodeName).out) {
        makeCostObject[child] = graph.get(child).wallValue;
    }
    costs = Object.assign(costs, makeCostObject);

    let parents = {};
    for (let child of graph.get(startNodeName).out) {
        parents[child] = startNodeName;
    }

    const processed = [];

    let node = findLowestCostNode(costs, processed);
    while (node) {
        let cost = costs[node];
        let children = graph.get(node);
        for (let n of children.out) {
            if (String(n) !== String(startNodeName)) {
                let newCost = cost + graph.get(n).wallValue;
                if (costs[n] == undefined || costs[n] > newCost) {
                    costs[n] = newCost;
                    parents[n] = node;
                }
            }
        }
        processed.push(node);
        node = findLowestCostNode(costs, processed);
    }

    return parents;
};

const getDistance = (startNodeName, endNodeName, graph) => {

    let costs = {};
    let makeCostObject = new Object();
    for (const child of graph.get(startNodeName).out) {
        makeCostObject[child] = graph.get(child).wallValue;
    }
    costs = Object.assign(costs, makeCostObject);
    costs[endNodeName] = "Infinity";

    // track paths
    const parents = { endNodeName: null };
    for (let child of graph.get(startNodeName).out) {
        parents[child] = startNodeName;
        if (child == endNodeName) {
            let distance = 0;
            return distance;
        }
    }

    const processed = [];

    let node = findLowestCostNode(costs, processed);
    break1:
    while (node) {
        let cost = costs[node];
        let children = graph.get(node);
        for (let n of children.out) {
            if (String(n) !== String(startNodeName)) {
                let newCost = cost + graph.get(n).wallValue;
                if (costs[n] == undefined || costs[n] > newCost) {
                    costs[n] = newCost;
                    parents[n] = node;
                    if (n === endNodeName) {
                        break break1;
                    }
                }
            }
        }
        processed.push(node);
        node = findLowestCostNode(costs, processed);
    }

    let distance = costs[endNodeName]

    if (distance === "Infinity") return -1
    return distance;
};


const checkAllPaths = (source, target, ownGate, graph) => {
    const queue = [source];
    const visited = new Set();
    let bestPath = { point: null, sumDistance: 100 };
    let enemyWinPoint = null;
    let findAllShortPaths = findAllSinglePath(source, graph);

    while (queue.length > 0) {
        const start = queue.shift();

        if (start == target) {
            bestPath.point = start;
            return bestPath;
        }

        if (visited.has(start)) {
            continue;
        }

        if (graph.get(start).wallValue == 1) {
            let optimalPath = [start];
            let parent = findAllShortPaths[start];
            while (parent) {
                optimalPath.push(parent);
                if (parent == source) {
                    break;
                }
                parent = findAllShortPaths[parent];

            }
            if (optimalPath.find(function (element) {
                return element == ownGate;
            }) != undefined) {
                continue;
            }
            for (let i = 0; i < optimalPath.length - 1; i++) {
                graph.get(optimalPath[i]).out.delete(optimalPath[i + 1]);
                graph.get(optimalPath[i + 1]).out.delete(optimalPath[i]);
            }
            graph.get(start).wallValue = 0;
            let ownDistance = getDistance(start, target, graph);
            let enemyDistance = getDistance(start, ownGate, graph);
            graph.get(start).wallValue = 1;

            for (let i = 0; i < optimalPath.length - 1; i++) {
                graph.get(optimalPath[i]).out.add(optimalPath[i + 1]);
                graph.get(optimalPath[i + 1]).out.add(optimalPath[i]);
            }

            if (ownDistance == -1) {
                return false;
                //!MAMY PROBLEM
            }
            // if (ownDistance == -1) {
            let sumDistance = ownDistance - enemyDistance;
            // }
            if (bestPath.sumDistance > sumDistance) {
                if (enemyDistance > 0) {
                    bestPath.sumDistance = sumDistance;
                    bestPath.point = start;
                }
                else {
                    if (bestPath.sumDistance == 100) {
                        enemyWinPoint = start;
                    }
                }
            }

            visited.add(start);
            continue;
        }

        for (const next of graph.get(start).out) {
            if (visited.has(next)) {
                continue;
            }

            if (!queue.includes(next)) {
                // path.set(next, start);
                queue.push(next);
            }
        }

        visited.add(start);
    }

    if (bestPath.sumDistance == 100) {
        if (enemyWinPoint != null) {
            bestPath.point = enemyWinPoint;
            return bestPath;
        }
        else {
            if (getDistance(source, ownGate, graph) == -1) {
                let lastVisit;
                visited.forEach(function (value) {
                    console.log(graph.get(value).out.size);
                    if (graph.get(value).out.size == 1)
                        lastVisit = value;
                })
                bestPath.point = lastVisit;
                bestPath.sumDistance = 101;
                return bestPath;
            }
            else {
                bestPath.point = ownGate;
                return bestPath;
            }
        }
    }
    else {
        return bestPath;

    }

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

// function arraysEqual(arr1, arr2) {
//     if (arr1.length !== arr2.length)
//         return false;
//     for (var i = arr1.length; i--;) {
//         if (arr1[i] !== arr2[i])
//             return false;
//     }

//     return true;
// }

// function findBestPath(paths, ownGatePoint, enemyGatePoint) {
//     let bestPath = { path: null, sumDistance: 100 };
//     let ownDistance = null;
//     let enemyDistance = null;
//     let enemyWinPath = null;


//     if (ownDistance > 0) {
//         if (bestPath.sumDistance > sumDistance) {
//             if (enemyDistance > 0) {
//                 bestPath.sumDistance = sumDistance;
//                 bestPath.path = path;
//             }
//             else {
//                 if (bestPath.sumDistance == 100) {
//                     enemyWinPath = path;
//                 }
//             }
//         }
//     }
//     else {
//         bestPath.sumDistance = sumDistance;
//         bestPath.path = path;
//         return bestPath;
//     }

//     //?

//     if (x >= paths.length) { //! jeszcze nie wiem czym jest x moze byc ze po wyjsciu z petli wchodzi tu
//         if (bestPath.distance == 100) {
//             bestPath.sumDistance = sumDistance;
//             bestPath.path = enemyWinPath;
//             return bestPath;
//         }
//         else {
//             return bestPath;
//         }
//     }

// }

// const findPath = (source, target, graph) => {
//     if (!graph.has(source)) {
//         throw new Error('Unknown source.');
//     }

//     if (!graph.has(target)) {
//         throw new Error('Unknown target.');
//     }

//     const queue = [source];
//     const visited = new Set();
//     const path = new Map();

//     while (queue.length > 0) {
//         const start = queue.shift();

//         if (start === target) {
//             return buildPath(start, path);
//         }

//         for (const next of graph.get(start).out) {
//             if (visited.has(next)) {
//                 continue;
//             }

//             if (!queue.includes(next)) {
//                 path.set(next, start);
//                 queue.push(next);
//             }
//         }

//         visited.add(start);
//     }

//     return null;
// };

// const checkPath = function (enemyGatePoint, ownGatePoint, path) {
//     for (let i = 1; i < path.length; i++) {
//         if (graph.get(path[i]).wallValue == 1) {
//             let ownDistance = findSinglePath(`4_${enemyGatePoint}`, `${path[i]}`, graph).distance;
//             let enemyDistance = findSinglePath(`4_${ownGatePoint}`, `${path[i]}`, graph).distance;
//             let obj = {};
//             obj[i] = [ownDistance, enemyDistance]
//             return obj
//         }
//         if (path[i] == `4_${enemyGatePoint}`) {
//             let ownDistance = 0;
//             let obj = {};
//             obj[i] = [ownDistance]
//             return obj
//         }
//     }
// };

// const findMultiplyPaths = (startNodeName, endNodeName, graph, blockNodeName) => {

//     // track the lowest cost to reach each node
//     let costs = {};
//     let makeCostObject = new Object();
//     for (const child of graph.get(startNodeName).out) {
//         makeCostObject[child] = graph.get(child).wallValue;
//     }
//     costs[endNodeName] = "Infinity";
//     costs = Object.assign(costs, makeCostObject);


//     // track paths
//     const parents = { endNodeName: null };
//     for (let child of graph.get(startNodeName).out) {
//         let parentValArray = new Array();
//         let parentVal = new Object();
//         parentVal[startNodeName] = graph.get(child).wallValue;
//         parentValArray.push(parentVal)
//         parents[child] = parentValArray;
//     }

//     // track nodes that have already been processed
//     const processed = [];

//     let node = findLowestCostNode(costs, processed);
//     // break1:
//     while (node) {
//         let cost = costs[node];
//         let children = graph.get(node);
//         for (let n of children.out) {
//             if (String(n) !== String(startNodeName)) {
//                 let newCost = cost + graph.get(n).wallValue;
//                 if (costs[n] == undefined || costs[n] > newCost) {
//                     costs[n] = newCost;


//                 }
//                 let parentValArray = new Array();
//                 let parentVal = new Object();
//                 parentVal[node] = newCost
//                 parentValArray.push(parentVal);
//                 if (parents[n] == undefined)
//                     parents[n] = parentValArray;
//                 else parents[n].push(parentVal)
//             }
//         }
//         processed.push(node);
//         node = findLowestCostNode(costs, processed);
//     }

//     const results = {
//         distance: costs[endNodeName],
//         path: parents
//     };

//     if (results.distance === "Infinity") return false
//     return results;
// };

// function create2dArray(row, column) {
//     let tab = new Array(row + 1);
//     for (let i = 0; i <= row; i++) {
//         tab[i] = new Array(column + 1);
//     }
//     return tab;
// }

// function copyObj(obj, bool = false) {

//     if (bool == false) {
//         var newObj = new Object();
//         for (let x in obj) {
//             if (Array.isArray(obj[x])) {
//                 newObj[x] = copyObj(obj[x], true);
//                 break;
//             }
//             if (typeof obj[x] == 'object') {
//                 newObj[x] = copyObj(obj[x]);
//             }
//             else
//                 newObj[x] = obj[x];
//         }
//     }
//     else {

//         var newObj = create2dArray(obj.length, obj[0].length);
//         for (let i = 0; i < obj.length; i++)
//             for (let j = 0; j < obj[i].length; j++)
//                 newObj[i][j] = obj[i][j];
//     }
//     return newObj;
// }

// const buildPath = (target, path) => {
//     const result = [];

//     while (path.has(target)) {
//         const source = path.get(target);
//         result.push({ source, target });
//         target = source;
//     }

//     return result.reverse();
// };