const express = require('express');
const router = express.Router();
const Joi = require('joi');
const appDb = require('../shared/db');

/**
 * @swagger
 *  components:
 *      schemas:
 *          Reservation:
 *              type: object
 *              required:
 *                  - license
 *              properties:
 *                  id:
 *                      type: int
 *                      description: The auto-generated id of the reservation
 *                  license:
 *                      type: string
 *                      description: License plate of vehicle
 *                  checkIn:      
 *                      type: string
 *                      description: Check-in time
 *                  spaceId:
 *                      type: int
 *                      description: The auto-assigned id of the space
 *              example:
 *                  id: 7
 *                  license: AAA-111
 *                  checkIn: 08:30:00
 *                  spaceId: 1                  
 */

/**
 * @swagger
 * tags:
 *  name: Reservations
 *  description: The reservations managing API
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Returns the list of all the reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: The list of the reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */

router.get('/', (req, res) => {
    res.send(appDb.reservations);
});

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: The reservation was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: License length must be at least 6 characters long || There are no available spaces for reservations
 *       500:
 *         description: Some server error
 */
router.post('/', (req, res) => {
    const { error } = validateReservationLicense(req.body); // result.error
    if (error) {
        return res.status(400).send(error.details[0].message);
    } 

    currentTime = getCurrentTime();
    reservationsLength = appDb.reservationsLength + 1;
    var freeSpace = 0;
    var flag = false;
    appDb.spaces.forEach(element => {
        if(element.state == "free" && !flag){
            freeSpace = element.id;
            element.state = "in-use";
            flag = true;
        }
    });
    if(freeSpace != 0){
        const reservation = {
            id: reservationsLength,
            license: req.body.license,
            checkIn: currentTime,
            spaceId: freeSpace
        }
        appDb.reservations.push(reservation);
        res.send(reservation);
    }else{
        res.status(400).send('There are no available spaces for reservations');
    }
   
});

/**
 * @swagger
 * /reservations/:id:
 *   delete:
 *     summary: Remove the reservation by id
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The reservation id
 * 
 *     responses:
 *       200:
 *         description: The reservation was deleted
 *       404:
 *         description: The reservation was not found 
 *       500:
 *         description: Some error happened
 */
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