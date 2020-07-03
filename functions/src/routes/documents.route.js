const express = require('express');
const router = express.Router();

const uploadMiddleware = require('../middlewares/upload.middleware');
const DocumentsController = require('../controllers/documents.controller');

const documentsController = new DocumentsController();

router.get('/', async (request, response) => {


    await documentsController.getAllDocuments()
    .then(documents => {

        let documentsList = [];

        documents.forEach(value => documentsList.push({
            id: value.id,
            amount: value.data().amount,
            documentPath: value.data().documentPath,
            timestamp: value.data().timestamp._seconds,
            status: value.data().status,
            uid: value.data().uid
        }));

        return response.status(200).json(documentsList)
    })
    .catch(error => response.status(500).json({ error: true, message: error}));
});

router.get('/documents_by_status/:status', async (request, response) => {

    console.log(request.params.status)


    await documentsController.getDocumentsByStatus(request.params.status)
    .then(documents => {

        let documentsList = [];

        documents.forEach(value => documentsList.push({
            id: value.id,
            amount: value.data().amount,
            documentPath: value.data().documentPath,
            timestamp: value.data().timestamp.toDate(),
            status: value.data().status,
            uid: value.data().uid
        }));

        return response.status(200).json(documentsList)
    })
    .catch(error => response.status(500).json({ error: true, message: error}));
});

router.post('/file/upload', uploadMiddleware.single('file'), async (request, response) => {

    let fileBase64 = request.body.file;

    fileBase64.originalname = request.body.uid;
    fileBase64.bufferr = fileBase64._imageAsDataUrl.replace(/^data:image\/\w+;base64,/, "");
    fileBase64.buffer = Buffer(fileBase64.bufferr, 'base64');
    fileBase64.mimetype = fileBase64._mimeType;

    let result = await documentsController.newDocument(fileBase64);

    response.json(result);
});

router.get('/:uid', async (request, response) => {

    await documentsController.getDocumentsByUid(request.params.uid)
    .then(documents => {

        let documentsList = [];

        documents.forEach(value => documentsList.push({
            id: value.id,
            data: {
                amount: value.data().amount,
                timestamp: value.data().timestamp.toDate(),
                uid: value.data().uid,
                status: value.data().status,
                documentPath: value.data().documentPath,
            }
        }));

        // let documentsList = documents.map(document => {
        //     return {
        //         id: document.id,
        //         data: document.data()
        //     }
        // });

        return response.status(200).json(documentsList);
    })
    .catch(error => response.status(500).json({ error: true, message: error}));
});

router.get('/:uid/:startdate/:enddate', async (request, response) => {

    await documentsController.getDocumentsByPeriod(
        request.params.uid,
        new Date(request.params.startdate),
        new Date(request.params.enddate)
    )
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

router.post('/set-value', async (request, response) => {

    await documentsController.setValueWhithoutDocument(
        request.body.id,
        request.body.amount,
        request.body.status
    )
    .then(controllerResponse => response.status(200).json(controllerResponse))
    .catch(error => response.status(500).json({ error: true, message: error}));

    // await documentsController.setValueOfDocument(request.body.id, request.body.value)
    //         .then(controllerResponse => response.status(200).json(controllerResponse))
    //         .catch(error => response.status(500).json({ error: true, message: error}));
});

router.get('/status/:status', async (request, response) => {


    await documentsController.getDocumentsByStatus(request.params.status)
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

router.put('/set_value', async (request, response) => {

    await documentsController.setValueAndStatusOfDocument(request.body.id, request.body.amount, request.body.status)
        
    response.status(200).json({
        error: false,
        message: 'The value of amout has added. '
    })
})

module.exports = router;