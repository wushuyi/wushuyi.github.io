var elImgBox = document.getElementById('img-box');
var elCanvasBox = document.getElementById('canvas-box');

var urlAPI = (window.createObjectURL && window) ||
(window.URL && URL.revokeObjectURL && URL) ||
(window.webkitURL && webkitURL);

var createObjectURL = function (file) {
    return urlAPI ? urlAPI.createObjectURL(file) : false;
};

var revokeObjectURL = function (url) {
    return urlAPI ? urlAPI.revokeObjectURL(url) : false;
};

var readFile2B64 = function (file, callback, method) {
    if (window.FileReader) {
        var fileReader = new FileReader();
        fileReader.onload = fileReader.onerror = callback;
        method = method || 'readAsDataURL';
        if (fileReader[method]) {
            fileReader[method](file);
            return fileReader;
        }
    }
    return false;
};

var printBlobB64 = function(blob){
    var readFile = readFile2B64(blob);
    if(readFile){
        readFile.onload = function(){
            var b64 = window.blobB64 = readFile.result;
            var span = document.createElement('span');
            span.textContent = 'FileReader 转 base64 长度: ' + b64.length + ', b64存储于: window.blobB64';
            elImgBox.appendChild(span);
        }
    }
};

var printCanvasB64 = function(canvas){
    var b64 = window.canvasB64 = canvas.toDataURL();
    var span = document.createElement('span');
    span.textContent = 'Cnavas 转 base64 长度: ' + b64.length + ', b64存储于: window.canvasB64';
    elCanvasBox.appendChild(span);
};

var showImg = function(blob, callback){
    var blobUrl = createObjectURL(blob);
    var img = document.createElement('img');
    img.onload = function(){
        elImgBox.appendChild(img);
        callback(img);
        revokeObjectURL(blobUrl);
    };
    img.src = blobUrl;
};

var showCavnas = function(img){
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0);
    printCanvasB64(canvas);
    elCanvasBox.appendChild(canvas);
};

var xhr = new XMLHttpRequest();

var reqListener = function(){
    var blob = xhr.response;
    printBlobB64(blob);
    showImg(blob, showCavnas);
};

xhr.onload = reqListener;
xhr.responseType = "blob";
xhr.open("get", "../assets/images/beastie.png", true);
xhr.send();