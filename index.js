const express = require('express');
const cors = require('cors');
const spacesRouter = require('./routes/spaces');
const reservationsRouter = require('./routes/reservations');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));

app.use('/spaces', spacesRouter);
app.use('/reservations', reservationsRouter);

app.get('/', (res) => { return res.status(200).send('Hello World'); });
app.get('*', (res) => { res.status(405).send('Method does not exist'); });
app.post('*', (res) => { res.status(405).send('Method does not exist'); });
app.put('*', (res) => { res.status(405).send('Method does not exist'); });
app.delete('*', (res) => { res.status(405).send('Method does not exist'); });

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));