'use strict'
document.addEventListener('DOMContentLoaded', function () {
    let matrixSize = 4;
    let graphData = [];
    function handleClick() {
        getGraphData();
        if (graphData.length <= 3) {
            graphData = [
                '121',
                '231',
                '243',
                '314',
                '341'
            ];
        }
        let matrWeight = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(null));
        let matrRoad = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(0));
        graphData.forEach(strData => {
            let i = parseInt(strData[0]) - 1;
            let j = parseInt(strData[1]) - 1;
            let weight = parseInt(strData[2]);
            matrWeight[i][j] = weight;
        });
        for (let i = 0; i < matrixSize; i++) {
            matrWeight[i][i] = 0;
        }
        matrWeight.forEach((strElems, rowIndex) => {
            strElems.forEach((elem, columnIndex) => {
                if (elem !== null) {
                    matrRoad[rowIndex][columnIndex] = rowIndex + 1;
                }
            })
        });
        console.log('W(0) и Z(0) матрицы')
        console.log('Матрица весов:')
        matrWeight.forEach(strElems => {
            console.log(strElems);
        });
        console.log('Матрица расстояний:')
        matrRoad.forEach(strElems => {
            console.log(strElems);
        });
        console.log('')
        let matrWeightNew = JSON.parse(JSON.stringify(matrWeight));
        let matrRoadNew = JSON.parse(JSON.stringify(matrRoad));
        for (let k = 1; k <= matrixSize; k++) {
            let ai = iterateMatrix(matrWeightNew, matrixSize, k, "row");
            let aj = iterateMatrix(matrWeightNew, matrixSize, k, "column");
            let descartMult = cartesianProduct(ai, aj);
            let intermResult = mainFunc(matrWeightNew, matrWeight, matrRoadNew, matrRoad, descartMult, k);
            matrWeightNew = intermResult['newWeight'];
            matrRoad = intermResult['newRoad'];
            matrWeight = matrWeightNew;
            matrRoad = matrRoadNew;
            console.log('')
            console.log(`Это k = ${k}`);
            console.log(`Матрица весов W(${k}):`);
            matrWeight.forEach(strElems => {
                console.log(strElems);
            });
            console.log(`Матрица расстояний Z(${k}):`)
            matrRoad.forEach(strElems => {
                console.log(strElems);
            });
            console.log('')
        }
    }
    function addRow() {
        const table = document.getElementById("graphTable").getElementsByTagName('tbody')[0];
        const newRow = table.insertRow(table.rows.length);
        const cells = [];

        for (let i = 0; i < 3; i++) {
            cells[i] = newRow.insertCell(i);
            const input = document.createElement("input");
            input.type = "text";
            input.name = (i === 0) ? "startNode" : ((i === 1) ? "endNode" : "weight");
            input.placeholder = "Введите значение";
            input.required = true;
            cells[i].appendChild(input);
        }
    }
    function getGraphData() {
        const table = document.getElementById("graphTable");
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        graphData = [];
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            const startNode = cells[0].getElementsByTagName('input')[0].value;
            const endNode = cells[1].getElementsByTagName('input')[0].value;
            const weight = cells[2].getElementsByTagName('input')[0].value;

            if (startNode && endNode && weight) {
                graphData.push(`${startNode}${endNode}${weight}`);
            }
        }
    }
    function additionalChecks() {
        const matrixPowerInput = document.getElementById("matrixPower");
        if (matrixPowerInput.value !== "") {
            matrixSize = parseInt(matrixPowerInput.value, 10);
            console.log('Размер матрицы:', matrixSize);
        }
    }
    document.getElementById("addRowBtn").addEventListener("click", addRow);
    document.getElementById("getGraphDataBtn").addEventListener("click", handleClick);
    document.getElementById("matrixPower").addEventListener("click", additionalChecks);
    function isNumber(value) {
        return typeof value === 'number' && isFinite(value);
    }
    function iterateMatrix(matrWeight, matrixSize, k, direction) {
        const resultArray = [];
        if (direction === "row") {
            for (let i = 0; i < matrixSize; i++) {
                for (let j = 0; j < matrixSize; j++) {
                    if (isNumber(matrWeight[i][j]) && parseInt(matrWeight[i][j]) !== 0 && k === j + 1) {
                        resultArray.push(i + 1);
                    }
                }
            }
        } else if (direction === "column") {
            for (let j = 0; j < matrixSize; j++) {
                for (let i = 0; i < matrixSize; i++) {
                    if (isNumber(matrWeight[i][j]) && parseInt(matrWeight[i][j]) !== 0 && k === i + 1) {
                        resultArray.push(j + 1);
                    }
                }
            }
        } else {
            console.error("Invalid direction. Use 'row' or 'column'.");
        }
        return resultArray;
    }
    function cartesianProduct(setA, setB) {
        const result = [];
        for (let i = 0; i < setA.length; i++) {
            for (let j = 0; j < setB.length; j++) {
                result.push(String(setA[i]) + String(setB[j]));
            }
        }
        return result;
    }
    function mainFunc(matrWeightNew, matrWeight, matrRoadNew, matrRoad, descartMult, k) {
        k -= 1
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                descartMult.forEach(pair => {
                    if ((pair[0] == i + 1) && (pair[1] == j + 1)) {
                        let roadFlag = false;
                        if (matrWeight[i][j] === null && matrWeight[k][j] !== null && matrWeight[i][k] !== null) {
                            console.log(`Так как значение в матрице равно: ${matrWeightNew[i][j]}, то в ячейку ${i + 1}:${j + 1} присваиваем ${matrWeight[k][j] + matrWeight[i][k]}`);
                            matrWeightNew[i][j] = matrWeight[k][j] + matrWeight[i][k]
                            roadFlag = true;
                        } else {
                            if (matrWeight[i][j] > matrWeight[k][j] + matrWeight[i][k]) {
                                matrWeightNew[i][j] = matrWeight[k][j] + matrWeight[i][k];
                                roadFlag = true;
                                console.log(`Значение ${matrWeightNew[i][j]} в ${i + 1}:${j + 1} заменено на меньшее значение ${matrWeight[k][j] + matrWeight[i][k]}`);
                            } else {
                                console.log(`Значение ${matrWeightNew[i][j]} в ${i + 1}:${j + 1} НЕ!!! поменялось на ${matrWeight[k][j] + matrWeight[i][k]}`);
                            }
                        }
                        if (roadFlag) {
                            console.log(`Значение растояния в ${i + 1}:${j + 1} заменено на ${matrRoad[k][j]}`);
                            matrRoadNew[i][j] = matrRoad[k][j]
                        }
                    }
                });
            }
        }
        const result = {
            'newWeight': matrWeightNew,
            'newRoad': matrRoadNew
        }
        return result
    }
    (function () {
        var old = console.log;
        var logger = document.getElementById('log');
        console.log = function (message) {
            if (typeof message === 'object') {
                let matrix = (JSON && JSON.stringify ? JSON.stringify(message) : message);
                if (Array.isArray(message)) {
                    let arrayMessage = JSON.parse(JSON.stringify(message));
                    arrayMessage.forEach((elem, index, arr) => {
                        arr[index] = isNumber(elem) ? elem : '&#8734;';
                    });
                    logger.innerHTML += arrayMessage + '<br />';
                } else {
                    logger.innerHTML += matrix + '<br />';
                }
            } else {
                logger.innerHTML += message + '<br />';
            }
        }
    })();
});
