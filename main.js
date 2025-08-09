const express = require('express');
const https = require('https');
const secreteTurnstileKey = '0x4AAAAAABpqccGUgDhMZrqPHziIp4lgHr0';
const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const fs = require('fs');
const app = express();
const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/pacsviz.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/pacsviz.xyz/cert.pem')
}
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/', (req, res) => {
    res.send('Hello from John');
});
app.get('/verifykey/:key', async (req, res) => {
    console.log(`key: ${req.params.key}`);
    console.log(`remote ip: ${req.hostname}`);
    console.log(`remote header: ${JSON.stringify(req.header, null, 2)}`);
    let verifyForm = new FormData();
    verifyForm.append("secret", secreteTurnstileKey);
    verifyForm.append("response", req.params.key);
    verifyForm.append("remoteip", req.hostname);

    const verifyRequest = {
        secret: secreteTurnstileKey,
        response: req.params.key,
        remoteip: '18.223.94.171'
    };
    console.log(`verify ${JSON.stringify(verifyRequest, null, 2)}`);
    try {
        const verifyResult = await fetch(verifyUrl, {
            body: verifyForm,
            method: 'POST'
        });
        const outcome = await verifyResult.json();
        console.log(`verify result returned ${JSON.stringify(outcome, null, 2)}`);
        res.send('OK');
    } catch (err) {
        console.log(`Error on fetch verify: ${err}`);
    }


});
app.post('/login', async (req, res) => {

    console.log(`remote ip: ${req.hostname}`);
    console.log(`body: ${JSON.stringify(req.body)}`);


})
https.createServer(httpsOptions, app).listen(443, () => {
    console.log(`Listening on port ${443}`);
})
