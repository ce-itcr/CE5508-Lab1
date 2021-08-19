const express = require('express');
const router = express.Router();
const Joi = require('joi');
const appDb = require('../shared/db');

/**
 * @swagger
 *  components:
 *      schemas:
 *          Space:
 *              type: object
 *              required:
 *                  - name
 *              properties:
 *                  id:
 *                      type: int
 *                      description: The auto-generated id of the space
 *                  name:
 *                      type: string
 *                      description: The space name or important information
 *                  state:      
 *                      type: string
 *                      description: Determines if a space is free or in-use
 *              example:
 *                  id: 6
 *                  name: Parking no.1
 *                  state: free                  
 */

/**
 * @swagger
 * tags:
 *  name: Spaces
 *  description: The spaces managing API
 */

/**
 * @swagger
 * /spaces:
 *   get:
 *     summary: Returns the list of all the spaces
 *     tags: [Spaces]
 *     responses:
 *       200:
 *         description: The list of the spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Space'
 */
router.get('/', (req, res) => {
    res.status(200).send(appDb.spaces);
});

/**
 * @swagger
 * /spaces/:id:
 *   get:
 *     summary: Get the space by id
 *     tags: [Spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The space id
 *     responses:
 *       200:
 *         description: The space description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Space'
 *       404:
 *         description: The space was not found
 */
router.get('/:id', (req, res) => {
    var space = appDb.spaces.find(s => s.id === parseInt(req.params.id));
    if(!space) return res.status(404).send('The space with the given ID was not found'); // 404 Not Found

    res.status(200).send(space)
});

/**
 * @swagger
 * /spaces/:offset:/:limit:
 *   get:
 *     summary: Get the page using cursor pagination method
 *     tags: [Spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The space id
 *     responses:
 *       200:
 *         description: The space description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Space'
 *       404:
 *         description: The space was not found
 */
router.get('/:offset/:limit', (req, res) => {
    var page = appDb.spaces.slice(parseInt(req.params.offset), parseInt(req.params.limit) + parseInt(req.params.offset));
    res.status(200).send(page)
});


/**
 * @swagger
 * /spaces:
 *   post:
 *     summary: Create a new space
 *     tags: [Spaces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Space'
 *     responses:
 *       200:
 *         description: The space was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Space'
 *       400:
 *         description: Name length must be at least 3 characters long || id is not allowed || state is not allowed
 *       500:
 *         description: Some server error
 */
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
    //res.send(space);
    res.status(200).send('The space was successfully created');
});

/**
 * @swagger
 * /spaces/:id:
 *  put:
 *    summary: Update the space by the id
 *    tags: [Spaces]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The space id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Space'
 *    responses:
 *      200:
 *        description: The space was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Space'
 *      400:
 *        description: Name length must be at least 3 characters long
 *      404:
 *        description: The space was not found
 *      500:
 *        description: Some error happened
 */
router.put('/:id', (req, res) => {
    var space = appDb.spaces.find(s => s.id === parseInt(req.params.id));
    if(!space) return res.status(404).send('The space with the given ID was not found'); // 404 Not Found

    const { error } = validateSpaceInfo(req.body); // result.error
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    space.name = req.body.name;
    space.state = req.body.state;
    //res.send(space);
    res.status(200).send('The space was updated')
});

/**
 * @swagger
 * /spaces/:id:
 *   delete:
 *     summary: Remove the space by id
 *     tags: [Spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The space id
 * 
 *     responses:
 *       200:
 *         description: The space was deleted
 *       404:
 *         description: The space was not found || The space was in-use
 *       500:
 *         description: Some error happened
 */
router.delete('/:id', (req, res) => {
    var space = appDb.spaces.find(s => s.id === parseInt(req.params.id));
    if(space.state == "free"){
        if(!space) return res.status(404).send('The space with the given ID was not found'); // 404 Not Found

        
        const index = appDb.spaces.indexOf(space);
        appDb.spaces.splice(index, 1);

        //res.send(space);
        res.status(200).send('The space was deleted');
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