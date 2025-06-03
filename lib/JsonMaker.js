const axios = require('axios');
const FormData = require('form-data');

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

// Retry and Timeout Configuration
const MAX_RETRIES = 5;
const TIMEOUT_DURATION = 30000; // 30 seconds
const RETRY_DELAY = 2000; // 2 seconds between retries

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createTimeoutPromise = (timeoutMs) => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Request timeout after ${timeoutMs}ms`));
        }, timeoutMs);
    });
};

const uploadAttempt = async (jsonBuffer, fileName) => {
    const formData = new FormData();
    formData.append('file', jsonBuffer, {
        filename: fileName,
        contentType: 'application/json'
    });

    const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
            description: "License Egyptian Plate NFT metadata",
            type: "nft_metadata",
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

// Function to upload JSON to Pinata with retry mechanism
const uploadToPinata = async (jsonBuffer, fileName) => {
    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await uploadAttempt(jsonBuffer, fileName);            
            return {
                success: true,
                ipfsHash: response.data.IpfsHash,
                pinataUrl: `https://jade-electrical-earwig-826.mypinata.cloud/ipfs/${response.data.IpfsHash}`,
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

const uploadPicURI = async (inputCode, uri) => {
    // Create the JSON data
    const jsonData = {
        "name": "License Egyption Plate NFT",
        "description": "A unique NFT representing ownership of a license Egyption plate",
        "image": uri,
        "plate_code": inputCode
    };
    
    // Convert JSON to buffer
    const jsonBuffer = Buffer.from(JSON.stringify(jsonData, null, 2));
    const fileName = `data_${Date.now()}.json`;
    
    const uploadResult = await uploadToPinata(jsonBuffer, fileName);
    
    return uploadResult.success ? uploadResult.pinataUrl : null;
};

module.exports = {
    uploadPicURI
};