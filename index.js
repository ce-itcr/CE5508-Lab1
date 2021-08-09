const Joi = require('joi');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));

const spaces = [
    { id: 1, name: 'space1', state: 'free'},
    { id: 2, name: 'space2', state: 'free'},
    { id: 3, name: 'space3', state: 'in-use'},
    { id: 4, name: 'space4', state: 'in-use'},
    { id: 5, name: 'space5', state: 'in-use'},
];

const reservations = [
    { id: 1, license: 'BJT001', checkIn: '08:30:00', spaceId: 3 },
    { id: 2, license: 'ASD004', checkIn: '09:30:10', spaceId: 4 },
    { id: 3, license: 'RTY005', checkIn: '10:30:20', spaceId: 5 },
];

spacesLength = 5;
reservationsLength = 3;

app.get('/', (req, res) => {
    return res.status(200).send('Hello World');
});

app.get('/spaces', (req, res) => {
    res.status(200).send(spaces);
});

app.get('/spaces/:id', (req, res) => {
    var space = spaces.find(s => s.id === parseInt(req.params.id));
    if(!space) return res.status(404).send('The space with the given ID was not found'); // 404 Not Found

    res.status(200).send(space)
});

app.post('/spaces', (req, res) => {
    const { error } = validateSpaceName(req.body); // result.error
    if (error) {
        return res.status(400).send(error.details[0].message);
    } 
    spacesLength = spacesLength + 1;
    const space = {
        id: spacesLength,
        name: req.body.name,
        state: 'free'
    }
    spaces.push(space);
    res.send(space);
});

app.put('/spaces/:id', (req, res) => {
    var space = spaces.find(s => s.id === parseInt(req.params.id));
    if(!space) return res.status(404).send('The space with the given ID was not found'); // 404 Not Found

    const { error } = validateSpaceInfo(req.body); // result.error
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    space.name = req.body.name;
    space.state = req.body.state;
    res.send(space);

});

app.delete('/spaces/:id', (req, res) => {
    var space = spaces.find(s => s.id === parseInt(req.params.id));
    if(space.state == "free"){
        if(!space) return res.status(404).send('The space with the given ID was not found'); // 404 Not Found

        const index = spaces.indexOf(space);
        spaces.splice(index, 1);

        res.send(space);
    }else{
        return res.status(404).send('The space with the given ID is currently in use'); // 404 Not Found
    }
});

app.get('/reservations', (req, res) => {
    res.send(reservations);
});

app.post('/reservations', (req, res) => {
    const { error } = validateReservationLicense(req.body); // result.error
    if (error) {
        return res.status(400).send(error.details[0].message);
    } 

    currentTime = getCurrentTime();
    reservationsLength = reservationsLength + 1;
    const reservation = {
        //{ id: 1, license: 'BJT001', checkIn: '08:30:00', spaceId: 3 },
        id: reservationsLength,
        license: req.body.license,
        checkIn: currentTime,
        spaceId: 1
    }
    reservations.push(reservation);
    res.send(reservation);
});

app.delete('/reservations/:id', (req, res) => {
    var reservation = reservations.find(r => r.id === parseInt(req.params.id));
    if(!reservation) return res.status(404).send('The reservation with the given ID was not found'); // 404 Not Found

    const index = reservations.indexOf(reservation);
    reservations.splice(index, 1);

    res.send(reservation);
});

function validateSpaceName(space){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return result = Joi.validate(space, schema);
}

function validateSpaceInfo(space){
    const schema = {
        name: Joi.string().min(3).required(),
        state: Joi.string().required()
    };

    return result = Joi.validate(space, schema);
}

function validateReservationLicense(license){
    const schema = {
        license: Joi.string().min(6).required(),
    };

    return result = Joi.validate(license, schema);
}

function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}
  
function getCurrentTime(){
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    var finalDate =  h + ":" + m + ":" + s;
    return finalDate;
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));