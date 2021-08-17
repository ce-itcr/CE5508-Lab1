const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const spacesRouter = require('./routes/spaces');
const reservationsRouter = require('./routes/reservations');

const PORT = process.env.PORT || 5000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Parking API',
            version: '1.0.0',
            description: 'This project corresponds to laboratory # 1 of course CE5508. It is intended to serve as an API for a supposed parking lot.'
        },
        servers: [
            {
                url: 'http://localhost:5000'
            }
        ]
    },
    apis: ['./routes/*.js']
}
const specs = swaggerJsDoc(options);

const app = express();
app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use('/spaces', spacesRouter);
app.use('/reservations', reservationsRouter);

app.get('/', (req, res) => { return res.status(200).send('Hello World'); });
app.get('*', (req, res)  => { res.status(405).send('Method does not exist'); });
app.post('*', (req, res) => { res.status(405).send('Method does not exist'); });
app.put('*', (req, res)  => { res.status(405).send('Method does not exist'); });
app.delete('*', (req, res)  => { res.status(405).send('Method does not exist'); });


const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}, app)

sslServer.listen(PORT, () => console.log(`Listening on port ${PORT}...`));