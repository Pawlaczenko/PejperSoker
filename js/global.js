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

const findMultiplyPaths = (startNodeName, endNodeName, graph, blockNodeName) => {

    // track the lowest cost to reach each node
    let costs = {};
    let makeCostObject = new Object();
    for (const child of graph.get(startNodeName).out) {
        makeCostObject[child] = graph.get(child).wallValue;
    }
    costs[endNodeName] = "Infinity";
    costs = Object.assign(costs, makeCostObject);


    // track paths
    const parents = { endNodeName: null };
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
            }
        }
        processed.push(node);
        node = findLowestCostNode(costs, processed);
    }

    // let optimalPathArray = new Array();
    // let flag = { rounds: [] };
    // let keyRepeat = { key: "", counter: 0 };
    // break2:
    // while (true) {
    //     let optimalPath = [endNodeName];
    //     let parent = parents[endNodeName];
    //     let counter = 0;
    //     break1:
    //     while (parent) {
    //         for (let j = 0; j < parent.length; j++) {
    //             for (let i in parent[j]) {
    //                 if (i == startNodeName) {
    //                     optimalPath.push(i);
    //                     if (flag.rounds.length > 0) {
    //                         if (flag.rounds[flag.rounds.length - 1] + 1 <= counter) {
    //                             flag.rounds[flag.rounds.length - 1]++;
    //                         }
    //                         else {
    //                             flag.rounds[flag.rounds.length - 1] = flag.rounds.length - 1;
    //                             flag.rounds.push(flag.rounds.length)

    //                         }
    //                     }
    //                     if (optimalPathArray.length == 0) {
    //                         flag.rounds.push(0);
    //                     }
    //                     break break1;
    //                 }
    //             }
    //         }
    //         let key;
    //         let x = 0;
    //         for (const i of flag.rounds) {
    //             if (counter == i) {
    //                 x = 1;
    //                 break;
    //             }
    //         }
    //         if (parent[x] != undefined && (Object.values(parent[x])[0] == Object.values(parent[0])[0] || Object.values(parent[x])[0] == Object.values(parent[0])[0] + 1) && !optimalPath.includes(Object.keys(parent[x])[0]) && parent[x] != blockNodeName) {
    //             key = Object.keys(parent[x])[0];
    //             counter++;
    //         }
    //         else {
    //             if (flag.rounds[flag.rounds.length - 1] + 1 < parents[optimalPath[optimalPath.length - 1]].length) {
    //                 flag.rounds[flag.rounds.length - 1]++;
    //             }
    //             else {
    //                 flag.rounds[flag.rounds.length - 1] = flag.rounds.length - 1;
    //                 flag.rounds.push(flag.rounds.length)
    //             }
    //             break;
    //         }

    //         if (keyRepeat.counter == 4) {
    //             break break2;
    //         }
    //         if (keyRepeat.key == key) {
    //             keyRepeat.counter++;
    //         }
    //         else {
    //             keyRepeat.key = key;
    //             keyRepeat.counter = 0;;
    //         }

    //         optimalPath.push(key);
    //         parent = parents[key];
    //     }
    //     if (optimalPathArray[0] != undefined) {
    //         if (arraysEqual(optimalPathArray[0], optimalPath)) {
    //             break;
    //         }
    //     }



    //     if (optimalPath[optimalPath.length - 1] == `${startNodeName}`)
    //         optimalPathArray.push(optimalPath)
    //     if (optimalPathArray.length == 10) {
    //         break;
    //     }

    // }

    const results = {
        distance: costs[endNodeName],
        path: parents
    };
    // console.log(results.distance);
    if (results.distance === "Infinity") return false
    return results;
};

const findSinglePath = (startNodeName, endNodeName, graph) => {

    // track the lowest cost to reach each node
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
        if (child === endNodeName) {
            let optimalPath = [startNodeName];
            const results = {
                distance: 1,
                path: optimalPath
            };
            return results;
        }

    }


    // track nodes that have already been processed
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
    // optimalPath.reverse();

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

    // track the lowest cost to reach each node
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
    }

    // track nodes that have already been processed
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

    // let optimalPath = [endNodeName];
    // let parent = parents[endNodeName];
    // while (parent) {
    //     optimalPath.push(parent);
    //     parent = parents[parent];
    // }
    // optimalPath.reverse();

    let distance = costs[endNodeName]

    if (distance === "Infinity") return -1
    return distance;
};


const checkAllPaths = (source, target, ownGate, graph) => {
    const queue = [source];
    const visited = new Set();
    // const path = new Map();
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
            let ownDistance = getDistance(start, target, graph); //ile nam zostało do bramki
            let enemyDistance = getDistance(start, ownGate, graph); //ile przeciwnikowi zostało do bramki
            graph.get(start).wallValue = 1;

            for (let i = 0; i < optimalPath.length - 1; i++) {
                graph.get(optimalPath[i]).out.add(optimalPath[i + 1]);
                graph.get(optimalPath[i + 1]).out.add(optimalPath[i]);
            }
            if (enemyDistance == -1) {
                return false;
                //!MAMY PROBLEM
            }
            let sumDistance = ownDistance - enemyDistance;

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
        bestPath.point = enemyWinPoint;
        return bestPath;
    }
    else {
        return bestPath;

    }

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

const checkPath = function (enemyGatePoint, ownGatePoint, path) {
    for (let i = 1; i < path.length; i++) {
        if (graph.get(path[i]).wallValue == 1) {
            let ownDistance = findSinglePath(`4_${enemyGatePoint}`, `${path[i]}`, graph).distance;
            let enemyDistance = findSinglePath(`4_${ownGatePoint}`, `${path[i]}`, graph).distance;
            // console.log(ownDistance);
            let obj = {};
            obj[i] = [ownDistance, enemyDistance]
            return obj
        }
        if (path[i] == `4_${enemyGatePoint}`) {
            let ownDistance = 0;
            let obj = {};
            obj[i] = [ownDistance]
            return obj
        }
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

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (var i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

function findBestPath(paths, ownGatePoint, enemyGatePoint) {
    let bestPath = { path: null, sumDistance: 100 };
    let ownDistance = null;
    let enemyDistance = null;
    let enemyWinPath = null;

    //TODO

    // enemyDistance = distance(point, enemyGatePoint);
    // ownDistance = distance(point, ownGatePoint);
    // sumDistance = enemyDistance - ownDistance;
    // path.push(point);

    //TODO

    //TODO

    /* if(point.wallValue == 0){
        if(point.point != enemyGatePoint){

        }
        else
            return {path: path, status: true};
    }
    else{
        return {path: path, status: false, distance: sumDistance};
    } */

    //TODO

    //?

    if (ownDistance > 0) {
        if (bestPath.sumDistance > sumDistance) {
            if (enemyDistance > 0) {
                bestPath.sumDistance = sumDistance;
                bestPath.path = path;
            }
            else {
                if (bestPath.sumDistance == 100) {
                    enemyWinPath = path;
                }
            }
        }
    }
    else {
        bestPath.sumDistance = sumDistance;
        bestPath.path = path;
        return bestPath;
    }

    //?

    if (x >= paths.length) { //! jeszcze nie wiem czym jest x moze byc ze po wyjsciu z petli wchodzi tu
        if (bestPath.distance == 100) {
            bestPath.sumDistance = sumDistance;
            bestPath.path = enemyWinPath;
            return bestPath;
        }
        else {
            return bestPath;
        }
    }

}