const NAttr = 4;

var bayesClassesFile = null;
var bayesClassesInfo = [];

function init(){
    console.log('Medias');
    const medias = [];
    for(var i=0; i < bayesClassesInfo.length; i++){
        medias.push(calculateMedia(bayesClassesInfo[i].data));
    }
    console.log(medias);


    console.log('Covariances');
    const covariances = [];
    for(var i=0; i < bayesClassesInfo.length; i++){
        covariances.push(calculateCovariance(bayesClassesInfo[i].data,medias[i]));
    }
    console.log(covariances);

    console.log('Distances');
    // const distances = calculateDistance([[5.1],[3.5],[1.4],[0.2]], covariances, medias);
    const distances = calculateDistance([[6.9],[3.1],[4.9],[1.5]], covariances, medias);
    // const distances = calculateDistance([[5.0],[3.4],[1.5],[0.2]], covariances, medias);
    console.log(distances);


    const minorDistance = getMinorD(distances);
    console.log(`La menor distancia es ${minorDistance.n} `);
    console.log(`La muestra [xxx] pertenece a ${minorDistance.c}`);
}

// m = 1/n * Sum(1,n) xi
// m = 1/bClass.length * Sum(1,NAttr) xi
function calculateMedia(bClass){
    let m = [];

    for(var i=0; i < NAttr; i++){
        let sum = 0;
        for(var j = 0; j < bClass.length; j++){
            sum += parseFloat(bClass[j][i][0]);
        }
        m.push([sum]);
    }

    for(var i=0; i < m.length; i++){
        m[i][0] = (1/bClass.length) * m[i][0];
    }

    return m;
}

// C = 1/n * Sum(1,n)(xi - m)*(xi - m)t
function calculateCovariance(bClass, media){
    let C = [];
    const XM = [];

    for(var i=0; i < bClass.length; i++){
        const xSubM =[];
        for(var j = 0; j <NAttr; j++){
            xSubM.push(bClass[i][j][0] - media[j][0]);
        }
        XM.push([xSubM]);
    }

    for(var i=0; i < XM.length; i++){
        C.push(math.multiply(math.transpose(XM[i]),XM[i]));
    }

    let sum = C[0];
    for(var i=1; i < C.length; i++){
        sum = math.add(sum,C[i]);
    }

    C = math.multiply(sum, 1/bClass.length);

    return C;
}

//C^-1 = Identity
function calculateDistance(x,covariances, medias){
    distances = [];
    const xSubMList = [];

    for(var i=0; i < medias.length; i++){
        xSubMList.push(math.subtract(x,medias[i]))
    }


    for(var i=0; i < xSubMList.length; i++){
        // const matrixResult = math.multiply(xSubMList[i],math.transpose(xSubMList[i]));
        const matrixResult = math.multiply(xSubMList[i],math.transpose(xSubMList[i]), math.inv(covariances[i]));
        let sum = 0;
        for(var j=0; j < matrixResult.length; j++){
            sum += matrixResult[j][j];
        }
        distances.push(sum);
    }

    return distances;
}

function getMinorD(distances){
    let minor = distances[0];
    let idx = 0;

    for(var i=0; i < distances.length; i++){
        if(distances[i] < minor){
            minor = distances[i];
            idx = i;
        }
    }

    return {n: minor, c: bayesClassesInfo[idx].classBName};
}

function processFile(){
    classesInfo = [];
    const fileContent = bayesClassesFile.split('\n');

    for(var i=0; i < fileContent.length; i++){
        splitContent= fileContent[i].split(',');
        for(var j=0; j < splitContent.length; j++){
            splitContent[j] = splitContent[j].split('\r')[0];
        }
        const className = splitContent[splitContent.length-1];

        splitContent = splitContent.splice(0,splitContent.length-1);
        for(var z = 0; z < splitContent.length; z++){
            splitContent[z] = [splitContent[z]];
        }

        const idx = bayesClassesInfo.findIndex((elem)=>{return elem.classBName === className});
        if(idx === -1){
            bayesClassesInfo.push({classBName: className, data: [splitContent]})
        }else{
            bayesClassesInfo[idx].data.push(splitContent);
        }
    }
    console.log(bayesClassesInfo);
}

function readBayesFile() {
    if (document.querySelector("#dataFile-input").files.length == 0) {
        alert('Error : No file selected');
        return;
    }

    let file = document.querySelector("#dataFile-input").files[0];
    let reader = new FileReader();

    reader.addEventListener('load', function (e) {
        bayesClassesFile = e.target.result;
        processFile();
    });

    reader.addEventListener('error', function () {
        alert('Error : Failed to read attributes file');
    });

    reader.readAsText(file);
}


window.onload = function(){
    document.getElementById('read-data-button').addEventListener('click',readBayesFile);
};