const express = require('express');
const router = express.Router();
const Joi = require('joi');
const appDb = require('../shared/db')

router.get('/', (req, res) => {
    res.status(200).send(appDb.spaces);
});

router.get('/:id', (req, res) => {
    var space = appDb.spaces.find(s => s.id === parseInt(req.params.id));
    if(!space) return res.status(404).send('The space with the given ID was not found'); // 404 Not Found

    res.status(200).send(space)
});

router.post('/', (req, res) => {
    const { error } = validateSpaceName(req.body); // result.error
    if (error) {
        return res.status(400).send(error.details[0].message);
    } 
    spacesLength = appDb.spacesLength + 1;
    const space = {
        id: spacesLength,
        name: req.body.name,
        state: 'free'
    }
    appDb.spaces.push(space);
    res.send(space);
});

router.put('/:id', (req, res) => {
    var space = appDb.spaces.find(s => s.id === parseInt(req.params.id));
    if(!space) return res.status(404).send('The space with the given ID was not found'); // 404 Not Found

    const { error } = validateSpaceInfo(req.body); // result.error
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    space.name = req.body.name;
    space.state = req.body.state;
    res.send(space);

});

router.delete('/:id', (req, res) => {
    var space = appDb.spaces.find(s => s.id === parseInt(req.params.id));
    if(space.state == "free"){
        if(!space) return res.status(404).send('The space with the given ID was not found'); // 404 Not Found

        const index = appDb.spaces.indexOf(space);
        appDb.spaces.splice(index, 1);

        res.send(space);
    }else{
        return res.status(404).send('The space with the given ID is currently in use'); // 404 Not Found
    }
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

module.exports = router;