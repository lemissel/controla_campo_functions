const storage = require('../repositories/firebase-store.repository');
const FirestoreRepository = require('../repositories/firebase-firestore.repository');
const vision = require('@google-cloud/vision');

require('dotenv').config();

class DocumentsController {
    constructor() {
        this.db = new FirestoreRepository();
    }

    async newDocument(documentBase64) {

        let sendImageToBucket;
        let OCRResult;
        let dataFiltered;
        let data;
        let uid = documentBase64.originalname;

        // TODO: identificar se é receita ou despesa.

        sendImageToBucket = this.storeDocument(documentBase64);
        // OCRResult = await this.getTextByOCR(documentBase64);
        // dataFiltered = await this.filterRelevantData(OCRResult);
        // data = await this.saveTextDocumentOnDatabase(dataFiltered, uid);
        data = await this.saveTextDocumentOnDatabase(Math.random() * 1000 * -1, uid);

        return data;
    }

    async getTextByOCR(imageBlob) {

        const client = new vision.ImageAnnotatorClient();
        const [result] = await client.textDetection(imageBlob.buffer);
        const detections = result.textAnnotations;

        if (result.textAnnotations.length <= 0) {
            return null;
        }

        return detections[0].description;
    }

    async filterRelevantData(text) {
        // let pattern = /(Total|REAIS|PAGAR):*.*R*\$* (\d*,.\d*)/gmi;
        let pattern = /(\d*\..\d*) Total|REAIS|PAGAR*/gmi;

        text = text.replace(/\n/gmi,' ');

        console.log(text)

        let extractTotalFLoat = pattern.exec(text);


        if(extractTotalFLoat.length >= 0 || extractTotalFLoat === null) return null;

        return extractTotalFLoat[1];
    }

    async saveTextDocumentOnDatabase(textProceced, uid) {

        if(textProceced !== null && uid !== null) {
            return this.db.insert('documents', {
                amount: textProceced,
                timestamp: Date.now(),
                uid: uid
            });
        }
        
        return null;
    }

    async storeDocument(documentBase64) {

        let result;

        await storage(documentBase64)
        // eslint-disable-next-line promise/always-return
        .then((success) => {
            result = { error: false, response: success };
        }).catch((error) => {
            result = { error: true, errorMessage: error };
        });

        return result;
    }

    getDocumentsByUid(uid) {
        return this.db.getInstance()
            .collection('documents')
            .where('uid', '==', uid)
            .get();
    }
}

module.exports = DocumentsController;
