require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const moment = require('moment');
const fs = require('fs');
const chalk = require('chalk');


async function main() {
    await mongoose.connect(process.env.REMOTE_URL);
    console.log(chalk.blueBright('mongodb connection established on port 27017'));
}

main().catch(err => console.log(err));

const app = express();

app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.use((req, res, next) => {
    const fileName = `./logs/log_${moment().format("Y_M_D")}.txt`;
    let content = "";
    content += `Method:${req.method}\n`;
    content += `Route:${req.url}\n`;
    content += `Time:${new Date().toISOString()}\n`;
    content += `Status:${res.statusCode}\n\n`;
    fs.appendFileSync(fileName, content, (err) => { });
    next();
})

app.use((req, res, next) => {
    const fileName = `./error-logs/log_${moment().format("Y_M_D")}.txt`;
    let content = "";
    content += `Time: ${new Date().toISOString()}\n`;
    content += `Status: ${res.statusCode}\n`;
    content += `Error: ${res.statusMessage}\n\n`;

    if (res.statusCode >= 400) {

        fs.appendFile(fileName, content, (err) => { });
    }

    next();
});

app.listen(1999);
app.use(express.static("public"));

app.get('/', (req, res) => res.send("Welcome to my nodeJs project!"));



require('./handlers/user/loginAndUsers')(app);
require('./handlers/user/signup')(app);
require('./handlers/card/cards')(app);

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/public/error-page.html`);
});