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
                //!PROBLEM
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
                bestPath.point = ownGate;
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

var colors = [
    "blue","yellow","cyan","pink","red","orange"
];

function genereteCreator(lock) {
    $.ajax({
        url:'php_scripts/checkColors.php',
        type:'POST',
        success: function(results) {

            colors.forEach(function(color,i){
                $(".creator .colors").append(`
                    <div class="color">
                        <input type="radio" name="color" value=${i} class="colorInput" id="id${i}" required>
                        <label for="id${i}"></label>
                    </div>
                `);
                if(results==i){

                    $('.color #id'+i).prop('disabled', true);
                }
                $('.color #id'+i+' + label').css("background-color", colors[i]);
            });
        },
        error: function(err) {

        }
    })
};


genereteCreator();