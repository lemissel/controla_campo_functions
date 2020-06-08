const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller');

const usersController = new UsersController();

router.get('/', async (request, response) => {

    await usersController.getUsers()
    .then(users => {

        let usersList = [];

        users.forEach(value => usersList.push({
            id: value.id,
            data: value.data()
        }));

        return response.status(200).json(usersList)
    })
    .catch(error => response.status(500).json({ error: true, message: error}));

});

router.post('/', async (request, response) => {

    await usersController.newUser(request.body)
            .then(newUserResponse => response.status(201).json({ error: false, message: 'user is created' }))
            .catch(error => response.status(500).json({ error: true, message: error }));

});

router.get('/:uid', async (request, response) => {

    await usersController.getUserByUid(request.params.uid)
    .then(documents => {

        let documentsList = [];

        documents.forEach(value => documentsList.push({
            id: value.id,
            data: value.data()
        }));

        return response.status(200).json(documentsList)
    })
    .catch(error => response.status(500).json({ error: true, message: error}));
});

router.post('/set-provider', async (request, response) => {
    await usersController.addProviderToUser(request.body.id, request.body.provider)
            .then(controllerResponse => response.status(200).json(controllerResponse))
            .catch(error => response.status(500).json({ error: true, message: error}));
});

module.exports = router;