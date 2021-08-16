const express = require('express');
const router = express.Router();
const Joi = require('joi');
const appDb = require('../shared/db')

router.get('/', (req, res) => {
    res.send(appDb.reservations);
});

router.post('/', (req, res) => {
    const { error } = validateReservationLicense(req.body); // result.error
    if (error) {
        return res.status(400).send(error.details[0].message);
    } 

    currentTime = getCurrentTime();
    reservationsLength = appDb.reservationsLength + 1;
    var freespace = 0;
    var flag = false;
    appDb.spaces.forEach(element => {
        if(element.state == "free" && !flag){
            freespace = element.id;
            element.state = "in-use";
            flag = true;
        }
    });
    if(freespace != 0){
        const reservation = {
            id: reservationsLength,
            license: req.body.license,
            checkIn: currentTime,
            spaceId: freespace
        }
        appDb.reservations.push(reservation);
        res.send(reservation);
    }else{
        res.status(400).send('There are no available spaces for reservations');
    }
   
});

router.delete('/:id', (req, res) => {
    var reservation = appDb.reservations.find(r => r.id === parseInt(req.params.id));
    
    if(!reservation) return res.status(404).send('The reservation with the given ID was not found'); // 404 Not Found

    var space = appDb.spaces.find(s => s.id === reservation.spaceId);
    const index = appDb.reservations.indexOf(reservation);
    appDb.reservations.splice(index, 1);

    space.state = 'free'

    res.send(reservation);
});


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

module.exports = router;