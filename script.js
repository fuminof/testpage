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