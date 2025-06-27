const postingUrl = 'http://127.0.0.1:5000/post';
let scanData = { post_text: 'bigUnko' };

const requestPosting = (postingUrl, scanData) => {
    return axios.post(postingUrl, scanData);
};

const logReset = () => {
    readLog.textContent = "";
    readLog2.textContent = "";
}

document.getElementsByTagName('button')[0].addEventListener('click', () => {
    logReset()
    requestPosting(postingUrl, scanData)
        .then(response => {
            console.log('response', response)
            readLog2.textContent = JSON.stringify(response.data);
        });

});

document.getElementsByTagName('button')[1].addEventListener('click', () => {
    logReset()
    readStart()
    requestPosting(postingUrl, scanData)
        .then(response => {
            console.log('response', response)
            readLog2.textContent = JSON.stringify(response.data);
        });
});



const readLog = document.getElementById("readLog");
const readLog2 = document.getElementById("readLog2");

const readStart = (async () => {
    readLog.textContent = await "clicked read button";
    try {
        const reader = new NDEFReader();
        await reader.scan();
        readLog.textContent = "scan started";

        reader.addEventListener("error", () => {
            console.log("Error");
        });

        reader.addEventListener("reading", ({ message, serialNumber }) => {
            console.log(`> Serial Number: ${serialNumber}`);
            console.log(message);
            const record = message.records[0];
            const { data, encoding, recordType } = record;
            if (recordType === "text") {
                const textDecoder = new TextDecoder(encoding);
                const text = textDecoder.decode(data);
                readLog.textContent = text;
                let scanData = { post_text: text };
            }
        });
    } catch (error) {
        readLog.textContent = error;
    }
});

window.onload = function () {
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: document.querySelector('#container')
        },
        constraints: {
            facingMode: "environment",
        },
        decoder: {
            readers: ["ean_reader"]
        }
    },
        function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
        });

    Quagga.onProcessed(function (result) {
        var ctx = Quagga.canvas.ctx.overlay;
        var canvas = Quagga.canvas.dom.overlay;

        ctx.clearRect(0, 0, parseInt(canvas.width), parseInt(canvas.height));

        if (result) {
            if (result.box) {
                console.log(JSON.stringify(result.box));
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, ctx, { color: 'blue', lineWidth: 2 });
            }
        }
    });

    Quagga.onDetected(function (result) {
        document.querySelector('#result').textContent = result.codeResult.code;
    });
};

var video = document.createElement('video');
var canvas = document.querySelector('#canvas');
navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: 'environment'
    },
    audio: false
})
    .then(function (stream) {
        video.srcObject = stream;
        video.play();
        setInterval(function () {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);
        }, 200);
    })
    .catch(function (e) {
        document.querySelector('#result').textContent = JSON.stringify(e);
    });
