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
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Hello from John');
});
app.post('/verifykey', async (req, res) => {

    let verifyForm = new FormData();
    verifyForm.append("secret", secreteTurnstileKey);
    verifyForm.append("response", req.body.response);
    verifyForm.append("remoteip", req.hostname);

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
    res.sendFile('public/newPage.html',{root: __dirname});


})
https.createServer(httpsOptions, app).listen(443, () => {
    console.log(`Listening on port ${443}`);
})
