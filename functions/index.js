const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve(__dirname, '.', '/uploads/');
const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // error first callback
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {

        // error first callback
        cb(null, file.fieldname + '-' + Date.now())
    }
});

// utiliza a storage para configurar a instância do multer
//const upload = multer({ storage });
const upload = multer({ storage: multer.memoryStorage({}) })

app.use(express.static(uploadDir));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

app.get('/', (request, response) => response.json('Root'));

app.get('/teste', (request, response) => {
    response.json('teste is OK');
});

app.post('/file/upload', upload.single('file'), (request, response) => {
    let bla = request.body.file;
    
    let teste = bla.replace(/^data:image\/\w+;base64,/, "");

    fs.writeFile('./uploads/teste.png', teste, {encoding: 'base64'}, (err, data) => {
        if (err) {
            return response.json({"Error": true, "Message": "Erro ao fazer upload de imagem", "errorMessage": err})   
        }
        else {
            return response.json({"Error": false, "Message": "Foi porra"})
        }
    })
});


exports.api = functions.https.onRequest(app);
