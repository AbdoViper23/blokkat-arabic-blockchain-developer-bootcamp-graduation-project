
const { layersOrder, format } = require("./config.js");
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

let layersDir = path.join(process.cwd(), 'public');

const fs = require("fs");
// canvas
const { createCanvas, loadImage } = require("canvas");
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

// Pinata Configuration
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

// Retry and Timeout Configuration
const MAX_RETRIES = 5;
const TIMEOUT_DURATION = 30000; // 30 seconds
const RETRY_DELAY = 2000; // 2 seconds between retries

const cleanName = (str, itr) => {
    return str.slice(0, itr);
}

const getElements = (layerPath) => {
    return fs
        .readdirSync(layerPath)
        .sort()
        .map((i, index) => {
            return {
                id: index + 1,
                name: cleanName(i, -4),
                fileName: i
            }
        }) 
}

const layersSetup = (layersOrder) => {
    const layers = layersOrder.map((layer, index) => ({
        id: index + 1,
        name: layer.name,
        location : `${layersDir}/${layer.name}`,
        position: { x: layer.x , y: layer.y },
        size: {width:layer.width, height:layer.height },
        elements : getElements(`${layersDir}/${layer.name}`)
    }));
    return layers;
}

let lettersArray = [0,1,2]; // input
let lettersPtr = 0;
let numArray = [1,2,3]; // input
let numPtr = 0;

const drawLayer = async (_layer) => {
    let element;
    if (_layer.name === 'letters') {
        if(lettersPtr>=lettersArray.length)
            return;
        element = _layer.elements[lettersArray[lettersPtr++]];
    } else if (_layer.name === 'numbers') {
        if (numPtr >= numArray.length) 
            return;
        element = _layer.elements[numArray[numPtr++]];
    } else {
        element = _layer.elements[0];
    }
    let elementPath = `${_layer.location}/${element.fileName}`;
    const image = await loadImage(elementPath);
    ctx.drawImage(
        image,
        _layer.position.x,
        _layer.position.y,
        _layer.size.width,
        _layer.size.height
      );    
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createTimeoutPromise = (timeoutMs) => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Request timeout after ${timeoutMs}ms`));
        }, timeoutMs);
    });
};

const uploadAttempt = async (imageBuffer, fileName) => {
    const formData = new FormData();
    formData.append('file', imageBuffer, {
        filename: fileName,
        contentType: 'image/png'
    });

    const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
            description: "Generated composite image",
            type: "plate",
            timestamp: Date.now()
        }
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    const uploadPromise = axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_API_KEY,
            }
        }
    );

    const timeoutPromise = createTimeoutPromise(TIMEOUT_DURATION);

    return Promise.race([uploadPromise, timeoutPromise]);
};

// Function to upload image to Pinata with retry mechanism
const uploadToPinata = async (imageBuffer, fileName) => {
    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await uploadAttempt(imageBuffer, fileName);            
            return {
                success: true,
                ipfsHash: response.data.IpfsHash,
                pinataUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
                timestamp: response.data.Timestamp,
                size: response.data.PinSize,
                attempts: attempt
            };
            
        } catch (error) {
            lastError = error;            
            if (attempt < MAX_RETRIES) {
                await delay(RETRY_DELAY);
            }
        }
    }
    return {
        success: false,
        error: lastError?.response?.data || lastError?.message || 'Unknown error',
        attempts: MAX_RETRIES,
        lastErrorType: lastError?.message?.includes('timeout') ? 'timeout' : 
                      lastError?.response ? 'http_error' : 
                      lastError?.request ? 'network_error' : 'unknown_error'
    };
};



const stackImagesLayers = async () => {
    const layers = layersSetup(layersOrder);
    for (const layer of layers) {
        await drawLayer(layer);
    }
    
    const imageBuffer = canvas.toBuffer("image/jpeg", { 
        quality: 0.8,       
        progressive: true,   
        chromaSubsampling: true 
    });    
    const fileName = `plate_${Date.now()}.jpg`;
    const uploadResult = await uploadToPinata(imageBuffer, fileName);
    
    return uploadResult.success ? uploadResult.pinataUrl : null;
};

const run = async (ltrArr, nmArr) => {
    lettersPtr = 0;
    numPtr = 0;
    lettersArray = ltrArr;
    numArray = nmArr;
    
    const uri = await stackImagesLayers();
    console.log(uri);
    return uri;
};
module.exports = {
    run
};
