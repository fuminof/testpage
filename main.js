console.log("main.js!!");

$(document).ready(() => {
    console.log("Ready!!");
});

$("#my_start").click(() => {
    console.log("Start!!");

    // Quagga
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById("my_quagga")
        },
        decoder: {
            readers: ["ean_reader"]
        }
    }, err => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Initialization finished!!");
        Quagga.start();
    });

    Quagga.onProcessed(result => {
        if (result == null) return;
        if (typeof (result) != "object") return;
        if (result.boxes == undefined) return;
        const ctx = Quagga.canvas.ctx.overlay;
        const canvas = Quagga.canvas.dom.overlay;
        ctx.clearRect(0, 0, parseInt(canvas.width), parseInt(canvas.height));
        Quagga.ImageDebug.drawPath(result.box,
            { x: 0, y: 1 }, ctx, { color: "blue", lineWidth: 5 });
    });

    Quagga.onDetected(result => {
        console.log(result.codeResult.code);
        $("#my_result").text(result.codeResult.code);
        $("#my_barcode div").barcode(result.codeResult.code, "ean13");
    });
});

$("#my_stop").click(() => {
    console.log("Stop!!");
    Quagga.stop();
});


const postingUrl = 'http://219.94.250.153:5000/post';
let scanData = { post_text: 'bigUnko' };

const requestPosting = (postingUrl, scanData) => {
    return axios.post(postingUrl, scanData);
};

const logReset = () => {
    readLog.textContent = "";
    readLog2.textContent = "";
}

document.getElementsByTagName('button')[3].addEventListener('click', () => {
    logReset()
    readLog.textContent = "だみーだよ";
    requestPosting(postingUrl, scanData)
        .then(response => {
            console.log('response', response)
            readLog2.textContent = JSON.stringify(response.data);
        });

});

document.getElementsByTagName('button')[2].addEventListener('click', () => {
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
const readLog3 = document.getElementById("readLog3");

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
            const idNumber = message;
            const { data, encoding, recordType } = record;
            readLog2.textContent = (`>Serial Number: ${serialNumber}`);
            readLog3.textContent = (`ID, ${idNumber.id}`);
            if (recordType === "text") {
                const textDecoder = new TextDecoder(encoding);
                const text = textDecoder.decode(data);
                readLog3.textContent = "text=", text;
                let scanData = { post_text: text };
            }
        });
    } catch (error) {
        readLog.textContent = error;
    }
});


const timelog = document.getElementById("rialtime");
const timelog2 = document.getElementById("rialtime_x")
const showClock = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    timelog.textContent = `${hour} : ${minute} : ${second}`;
    timelog2.textContent = `${hour} : ${minute}`;
}
setInterval(showClock, 1000);



const ondo = () => {
    let goukei = eval(document.fm.kion.value) + eval(document.fm.suion.value);
    console.log(goukei);
};
