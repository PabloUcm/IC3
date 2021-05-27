var centros = [[4.6, 3.0, 4.0, 0.0], [6.8, 3.4, 4.6, 0.7]];
var KMediasFile = null;
var KMediasInfo = [];
var fichero = [];
// var KMediasInfo = [ { data: [[[2],[1],[3]]] } ]
var initCentroidMatrix = [[[4.6], [3.0], [4.0], [0.0]], [[6.8], [3.4], [4.6], [0.7]]];
var vSize = 4;
// var initCentroidMatrix = [[[1],[1],[1]], [[2],[3],[3]], [[4],[4],[4]]];
var b = 2;
var nAttrK = 2;

var E = 0.01;

function startKMedias() {
    let end = false;
    while (!end) {
        let U = calculateU();
        console.log(U);
        let newCentroid = recalculateCentroid(U);

        let v1 = (newCentroid[0][0] - initCentroidMatrix[0][0]) + (newCentroid[0][1] - initCentroidMatrix[0][1]) +
            (newCentroid[0][2] - initCentroidMatrix[0][2]) + (newCentroid[0][3] - initCentroidMatrix[0][3]);

        let v2 = (newCentroid[1][0] - initCentroidMatrix[1][0]) + (newCentroid[1][1] - initCentroidMatrix[1][1]) +
            (newCentroid[1][2] - initCentroidMatrix[1][2]) + (newCentroid[1][3] - initCentroidMatrix[1][3]);

        console.log('VS', v1, v2);

        if (v1 < E && v2 < E) end = true;
        initCentroidMatrix = newCentroid;

        if (!end) uMatrix = [[], [-1], [-1]];
    }
}

function calculateU() {
    var U = [];
    for (var i = 0; i < nAttrK; i++) U.push([])

    for (var i = 0; i < KMediasInfo.length; i++) {
        for (var j = 0; j < KMediasInfo[i].data.length; j++) {
            let dList = [];
            for (var z = 0; z < initCentroidMatrix.length; z++) {
                dList.push(calculateDK(KMediasInfo[i].data[j], initCentroidMatrix[z]));
            }
            // console.log(dList);
            for (var z = 0; z < dList.length; z++) {
                U[z].push(calculateP(dList, z));
            }
        }
    }

    return U;
}

function calculateDK(m, centroid) {
    const D = math.subtract(m, centroid);
    let sum = 0;
    for (var i = 0; i < D.length; i++) sum += Math.pow(math.abs(D[i]), b);
    return sum;
}

function calculateP(dList, idx) {
    let denominator = 0;
    for (var i = 0; i < dList.length; i++) {
        denominator += Math.pow(1 / dList[i], 1 / (b - 1));
    }

    return (Math.pow(1 / dList[idx], 1 / (b - 1)) / denominator);
}

function recalculateCentroid(U) {
    denominatorList = [];
    numeratorListV = [];
    numeratorListV2 = [];

    for (var i = 0; i < U.length; i++) {
        let denominator = 0;
        for (var j = 0; j < U[i].length; j++) {
            denominator += Math.pow(U[i][j], b);
        }
        denominatorList.push(denominator);
    }

    let a = 0, b1 = 0, c = 0, d = 0, a2 = 0, b2 = 0, c2 = 0, d2 = 0;

    for (let i = 0; i < fichero.length; i++) {
        let pro = Math.pow(U[0][i], b);
        a += pro * fichero[i][0];
        b1 += pro * fichero[i][1]
        c += pro * fichero[i][2]
        d += pro * fichero[i][3]
        let pro2 = Math.pow(U[1][i], b);
        a2 += pro2 * fichero[i][0]
        b2 += pro2 * fichero[i][1]
        c2 += pro2 * fichero[i][2]
        d2 += pro2 * fichero[i][3]
    }

    console.log(a,b1,c,d,a2,b2,c2,d2);
    newCentroid = [[[], [], [], []], [[], [], [], []]]
    newCentroid[0][0] = [a / denominatorList[0]];
    newCentroid[0][1] = [b1 / denominatorList[0]];
    newCentroid[0][2] = [c / denominatorList[0]];
    newCentroid[0][3] = [d / denominatorList[0]];

    newCentroid[1][0] = [a2 / denominatorList[1]];
    newCentroid[1][1] = [b2 / denominatorList[1]];
    newCentroid[1][2] = [c2 / denominatorList[1]];
    newCentroid[1][3] = [d2 / denominatorList[1]];

    console.log(newCentroid);
    return newCentroid;
}


function processFile() {
    classesInfo = [];
    const fileContent = KMediasFile.split('\n');


    for (var i = 0; i < fileContent.length; i++) {
        splitContent = fileContent[i].split(',');
        for (var j = 0; j < splitContent.length; j++) {
            splitContent[j] = splitContent[j].split('\r')[0];
        }
        const className = splitContent[splitContent.length - 1];

        splitContent = splitContent.splice(0, splitContent.length - 1);

        for (var z = 0; z < splitContent.length; z++) {
            splitContent[z] = [splitContent[z]];
        }

        const idx = KMediasInfo.findIndex((elem) => { return elem.classBName === className });
        if (idx === -1) {
            KMediasInfo.push({ classBName: className, data: [splitContent] })
        } else {
            KMediasInfo[idx].data.push(splitContent);
        }
    }

    for (let i = 0; i < KMediasInfo.length; i++) {
        for (let j = 0; j < KMediasInfo[i].data.length; j++)
            fichero.push(KMediasInfo[i].data[j])
    }

    console.log(KMediasInfo);
}

function readKMediasFile() {
    if (document.querySelector("#dataFile-input-kmedias").files.length == 0) {
        alert('Error : No file selected');
        return;
    }

    let file = document.querySelector("#dataFile-input-kmedias").files[0];
    let reader = new FileReader();

    reader.addEventListener('load', function (e) {
        KMediasFile = e.target.result;
        let v1 = initCentroidMatrix[1];
        let v2 = initCentroidMatrix[2];
        processFile();
    });

    reader.addEventListener('error', function () {
        alert('Error : Failed to read attributes file');
    });

    reader.readAsText(file);
}

function solve() {
    let sample = "5.1,3.5,1.4,0.2".split(",");  //document.getElementById("ejemplokmedias").value.split(",");
    let d1= calculateDK(sample,initCentroidMatrix[0])
    let d2= calculateDK(sample,initCentroidMatrix[1])
    let resultado1 = calculateP([d1,d2],0)
    let resultado2 = calculateP([d1,d2],1)

    if (resultado1 > resultado2)
      console.log('Iris-setosa');
    else
        console.log('Iris-versicolor');
};

window.onload = function () {
    document.getElementById('read-data-button-kmedias').addEventListener('click', readKMediasFile);
};