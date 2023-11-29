'use strict'
document.addEventListener('DOMContentLoaded', function () {
    let matrixSize = 4;
    let graphData = [];
    function handleClick() {
        getGraphData();
        console.log(matrixSize);
        // если лень вводить значения))0
        if (graphData.length<=3) {
            graphData = [
                '121',
                '231',
                '243',
                '314',
                '341'
            ];
        }

        // Инициализация матрицы весов
        let matrWeight = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(null));
        let matrRoad = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(0));
        // Заполнение матрицы весов на основе условий
        graphData.forEach(strData => {
            let i = parseInt(strData[0]) - 1;
            let j = parseInt(strData[1]) - 1;
            let weight = parseInt(strData[2]);
            matrWeight[i][j] = weight;
        });
        // Обработка дополнительных условий
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

        let matrWeightNew = JSON.parse(JSON.stringify(matrWeight));
        let matrRoadNew = JSON.parse(JSON.stringify(matrRoad));

        //Работа алгоритма
        for (let k = 1; k <= matrixSize; k++) {

            //Нахождение Декартово произведения
            let ai = iterateMatrix(matrWeightNew, matrixSize, k, "row");
            let aj = iterateMatrix(matrWeightNew, matrixSize, k, "column");
            let descartMult = cartesianProduct(ai, aj);
            // console.log('К равно:', k);
            // console.log(ai, aj);
            // console.log(descartMult);

            let intermResult = mainFunc(matrWeightNew, matrWeight, matrRoadNew, matrRoad, descartMult, k);
            matrWeightNew = intermResult['newWeight'];
            matrRoad = intermResult['newRoad'];

            matrWeight = matrWeightNew;
            matrRoad = matrRoadNew;

            //Вывод знанчения
            console.log(`Это k = ${k}`);
            console.log(`Матрица весов W(${k}):`);
            matrWeight.forEach(strElems => {
                console.log(strElems);
            });
            console.log(`Матрица расстояний Z(${k}):`)
            matrRoad.forEach(strElems => {
                console.log(strElems);
            });
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
            input.placeholder="Введите значение";
            input.required=true;
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
            console.log(matrixSize);
        }
        
    }
    document.getElementById("addRowBtn").addEventListener("click", addRow);
    document.getElementById("getGraphDataBtn").addEventListener("click", handleClick);
    document.getElementById("matrixPower").addEventListener("click", additionalChecks);

    function isNumber(value) {
        return typeof value === 'number' && isFinite(value);
    }

    //костыльная функция-перебор матрицы для взятия А-iтого и A-jтого множества
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

    //Пары в декартовом произведении
    function cartesianProduct(setA, setB) {
        const result = [];

        for (let i = 0; i < setA.length; i++) {
            for (let j = 0; j < setB.length; j++) {
                result.push(String(setA[i]) + String(setB[j]));
            }
        }

        return result;
    }

    //Основная функция
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
                            console.log(matrRoad[k][j], 'dsadasda');
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
});
