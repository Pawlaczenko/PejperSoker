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

let rows = 8;
let columns = 10;

let tab = new Array(rows + 1);
for (let i = 0; i < tab.length; i++) {
    tab[i] = new Array(columns + 1);
}
counter = 0;

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

const graph = buildGraphFromEdges(tabEdges);

console.log('0 -> 15', findPath("0_1", "4_10", graph));

