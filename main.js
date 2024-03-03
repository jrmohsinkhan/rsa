function enableSubmit() {
    const button = document.querySelector('button[type="submit"]');
    button.removeAttribute('disabled');
}

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const publick = urlParams.get('Public key');
    const privatek = urlParams.get('Private key');
    document.getElementById('Public key').value=publick;
    document.getElementById('Private key').value=privatek;
});

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ciphert = urlParams.get('cipher-text');
    const privatek = urlParams.get('Private key');
    document.getElementById('cipher-text').value=ciphert;
    document.getElementById('Private key').value=privatek;
});

function generateKeys() {
    const keys = eccryptoJS.generateKeyPair();
    const publicKey = toHexString(keys.publicKey);
    const privateKey = toHexString(keys.privateKey);

    document.getElementById('Public key').value = publicKey;
    document.getElementById('Private key').value = privateKey;
    enableSubmit();
}

async function encryptText() {
    const key = document.getElementById('Public key').value;
    const text = document.getElementById('plain-text').value;

    const msg = eccryptoJS.utf8ToBuffer(text);
    const encrypted = await eccryptoJS.encrypt(toBytesBuffer(key), msg);

    const cipherText = toHexString(encrypted.ciphertext);
    document.getElementById('cipher-text').value = cipherText;

    document.getElementById('encrypted').value = JSON.stringify(encrypted);

    enableSubmit();
}

async function decryptText() {
    const key = document.getElementById('Private key').value;
    const urlParams = new URLSearchParams(window.location.search);
    const ciphert = decode(urlParams.get('encrypted'));

    const decrypted = await eccryptoJS.decrypt(toBytesBuffer((key)), ciphert);
    document.getElementById('plain-text').value = decrypted.toString();
}

function toHexString(bytes) {
    var source = '';
    for (const byte of bytes) source += ('0' + (byte & 0xFF).toString(16)).slice(-2);
    return source;
}

function toBytesBuffer(hex) {
    const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    return eccryptoJS.utf8ToBuffer(bytes);
}

function decode(jsonData) {
    const data = JSON.parse(jsonData);
    const entries = Object.entries(data);
    for (const entry of entries) {
        const key = entry[0];
        const value = entry[1];
        data[key] = eccryptoJS.utf8ToBuffer(value['data']);
    }
    return data;
}
