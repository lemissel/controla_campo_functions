const express = require('express');
const router = express.Router();

const uploadMiddleware = require('../middlewares/upload.middleware');
const DocumentsController = require('../controllers/documents.controller');

const documentsController = new DocumentsController();

router.get('/', (request, response) => response.send('Route Documents is done!'));

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
            data: value.data()
        }));

        return response.status(200).json(documentsList)
    })
    .catch(error => response.status(500).json({ error: true, message: error}));
});

module.exports = router;