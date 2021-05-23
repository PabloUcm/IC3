const NAttr = 3;

var bayesClassesFile = null;
var bayesClassesInfo = [];

function init(){
    const X1 = [[[1],[2],[3]],[[3],[2],[1]]];
    const X2 = [[[4],[4],[6]],[[6],[4],[4]]];
    // const X1 = [[[3],[5]],[[5],[5]],[[4],[5]]];
    // const X2 = [[[3],[1]],[[1],[3]],[[2],[2]]];
    // const X3 = [[[1],[1]],[[2],[3]],[[0],[2]]];

    console.log('Medias');
    // for(var i=0; i < bayesClassesInfo.length; i++){
        
    // }
    const m1 = calculateMedia(X1);
    const m2 = calculateMedia(X2);
    // const m3 = calculateMedia(X3);

    console.log('Covariances');
    const C1 = calculateCovariance(X1,m1);
    const C2 = calculateCovariance(X2,m2);
    // const C3 = calculateCovariance(X3,m3);

    console.log('Distances');
    const distances = calculateDistance([[3],[4],[2]],[C1,C2],[m1,m2]);
    // const distances = calculateDistance([[5],[2]],[C1,C2,C3],[m1,m2,m3]);

    const minorDistance = getMinorD(distances);
    console.log(`La menor distancia es ${minorDistance.n} `);
    console.log(`La muestra [3,4,2] pertenece a ${minorDistance.c}`);
}

// m = 1/n * Sum(1,n) xi
// m = 1/bClass.length * Sum(1,NAttr) xi
function calculateMedia(bClass){
    let m = [];

    for(var i=0; i < NAttr; i++){
        let sum = 0;
        for(var j = 0; j < bClass.length; j++){
            sum += bClass[j][i][0];
        }
        m.push([sum]);
    }

    for(var i=0; i < m.length; i++){
        m[i][0] = (1/bClass.length) * m[i][0];
    }

    console.log(m);
    return m;
}

// C = 1/n * Sum(1,n)(xi - m)*(xi - m)t
function calculateCovariance(bClass, media){
    let C = [];
    const XM = [];

    // for(var i=0; i < bClass.length; i++){
    //     const xSubM =[];
    //     for(var j=0; j < NAttr; j++){
    //         xSubM.push(bClass[i][j] - media[j]);
    //     }
    //     XM.push(xSubM);
    // }
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


    // for(var i=0; i < XM.length; i++){
    //     const matrix = [];
    //     for(var j=0; j < XM[i].length; j++){
    //         const row = [];
    //         for(var x=0; x < XM[i].length; x++){
    //             let n = XM[i][j] * XM[i][x];
    //             if(n == -0) n = 0;
    //             row.push(n);
    //         }
    //         matrix.push(row);
    //     }
    //     C.push(matrix);
    // }

    // const matrixAux = [];
    // for(var i=0; i < NAttr; i++){ 
    //     const row = [];
    //     for(var j=0; j < NAttr; j++){ 
    //         let sum = 0;
    //         for(var x=0; x < C.length; x++){ 
    //             sum += C[x][i][j];
    //         }
    //         row.push(sum);
    //     }
    //     matrixAux.push(row);
    //     // console.log(matrixAux);
    // }

    // C = [];
    // for(var i=0; i < matrixAux.length; i++){
    //     C.push([]);
    //     for(var j=0; j < matrixAux[i].length; j++){
    //         C[i].push(matrixAux[i][j] * 1/bClass.length);
    //     }
    // }

    console.log(C);
    return C;
}

//C^-1 = Identity
function calculateDistance(x,covariances, medias){
    distances = [];
    const xSubMList = [];

    for(var i=0; i < medias.length; i++){
        xSubMList.push(math.subtract(x,medias[i]))
    }

    // for(var i=0; i < medias.length; i++){
    //     const row = [];
    //     for(var j=0; j < medias[i].length; j++){
    //         row.push(x[j] - medias[i][j]);
    //     }
    //     xSubMList.push(row);
    // }
    // console.log(xSubMList);

    for(var i=0; i < xSubMList.length; i++){
        const matrixResult = math.multiply(xSubMList[i],math.transpose(xSubMList[i]));
        // const matrixResult = math.multiply(xSubMList[i],math.transpose(xSubMList[i]), math.inv(covariances[i]));
        let sum = 0;
        for(var j=0; j < matrixResult.length; j++){
            sum += matrixResult[j][j];
        }
        distances.push(sum);
    }

    // let multi = math.multiply(xSubMList[0],math.transpose(xSubMList[0]));
    // console.log('multi', multi);

    // for(var i=0; i < xSubMList.length; i++){
    //     let sum = 0;
    //     for(var j=0; j < xSubMList[i].length; j++){
    //         sum += xSubMList[i][j] * xSubMList[i][j];
    //     }
    //     distances.push(sum);
    // }
    // console.log(distances);
    console.log(distances);
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

    return {n: minor, c: `Class${idx+1}`};
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
        console.log(className);

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