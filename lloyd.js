"use strict";

let epsilon = 0.0000000001;
let centroidMatrix = [[], [4.6, 3.0, 4.0, 0.0], [6.8, 3.4, 4.6, 0.7]];
let OldCentroidMatrix = [[], [4.6, 3.0, 4.0, 0.0], [6.8, 3.4, 4.6, 0.7]];

function refreshClass(v, sample) {
    let sampleMatrix = math.matrix([[Number(sample[0])], [Number(sample[1])], [Number(sample[2])], [Number(sample[3])]]);
    let subtractAndkMultiply = math.multiply(math.subtract(sampleMatrix, math.matrix([[v[0]], [v[1]], [v[2]], [v[3]]])), 0.1);
    return math.add(math.matrix([[v[0]], [v[1]], [v[2]], [v[3]]]), subtractAndkMultiply);;
}

function updateCentroids(data) {

    for (let j = 0; j < data.length; j++) {
        const sample = data[j].split(",");

        if (calculateD(1, sample) < calculateD(2, sample)) { // se actualiza c1
            let sol = refreshClass(centroidMatrix[1], sample);
            centroidMatrix[1] = [sol.get([0, 0]), sol.get([1, 0]), sol.get([2, 0]), sol.get([3, 0])];
        }
        else {// se actualiza c2
            let sol2 = refreshClass(centroidMatrix[2], sample);
            centroidMatrix[2] = [sol2.get([0, 0]), sol2.get([1, 0]), sol2.get([2, 0]), sol2.get([3, 0])];
        }
    }
};

function calculateD(i, dato) {
    let dij = 0;
    let centroid = centroidMatrix[i];

    for (let j = 0; j < dato.length - 1; j++) {
        let base = dato[j] - centroid[j];
        dij += Math.pow(base, 2)
    }

    return Math.sqrt(dij);
};

function lloyd() {
    const fileContent = bayesClassesFile.split('\n');
    let valueS = false;

    for (let i = 1; i < 10 && !valueS; i++) {
        updateCentroids(fileContent);

        if (math.subtract(centroidMatrix[1], OldCentroidMatrix[1]) < epsilon && math.subtract(centroidMatrix[2], OldCentroidMatrix[2]) < epsilon)
            valueS = true;

        OldCentroidMatrix = centroidMatrix.slice();
    }

}

function readlloydFile() {
    if (document.querySelector("#dataFile-input2").files.length == 0) {
        alert('Error : No file selected');
        return;
    }

    let file = document.querySelector("#dataFile-input2").files[0];
    let reader = new FileReader();

    reader.addEventListener('load', function (e) {
        bayesClassesFile = e.target.result;
        lloyd();
        let v1 = centroidMatrix[1];
        let v2 = centroidMatrix[2];
        console.log(v1);
        console.log(v2)
    });

    reader.addEventListener('error', function () {
        alert('Error : Failed to read attributes file');
    });

    reader.readAsText(file);
}

function solveLloyd() {
    let sample = document.getElementById("ejemplo").value.split(",");

    let resultado1 = (1 / calculateD(1, sample)) / ((1 / calculateD(1, sample)) + (1 / calculateD(2, sample)));
    let resultado1 = (1 / calculateD(2, sample)) / ((1 / calculateD(1, sample)) + (1 / calculateD(2, sample)));

    if (resultado1 > resultado2)
      console.log('Iris-setosa');
    else
        console.log('Iris-versicolor');
};

window.onload = function () {
    document.getElementById('read-data-button2').addEventListener('click', readlloydFile);
};