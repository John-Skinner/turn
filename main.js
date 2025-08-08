const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/pacsviz.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/pacsviz.xyz/cert.pem')
}
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.send('Hello from John');
});
https.createServer(httpsOptions,app).listen(443,()=> {
    console.log(`Listening on port ${443}`);
})
