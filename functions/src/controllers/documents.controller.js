const storage = require('../repositories/firebase-store.repository');
const FirestoreRepository = require('../repositories/firebase-firestore.repository');
const vision = require('@google-cloud/vision');
const firebase = require('../firebase.config');

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

        sendImageToBucket = await this.storeDocument(documentBase64);
        // console.log(sendImageToBucket);
        // OCRResult = await this.getTextByOCR(documentBase64);
        // dataFiltered = await this.filterRelevantData(OCRResult);
        // data = await this.saveTextDocumentOnDatabase(dataFiltered, uid);
        //data = await this.saveTextDocumentOnDatabase(Math.random() * 1000 * -1, uid);
        data = await this.saveTextDocumentOnDatabase({
            amount: null,
            timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
            uid: uid,
            status: 'in_progress',
            documentPath: sendImageToBucket
        });

        return data;
    }

    getDocumentsByPeriod(uid, startDate, endDate) {
        return this.db.getInstance()
                    .collection('documents')
                    .where('uid', '==', uid)
                    .where('timestamp', '>=', startDate)
                    .where('timestamp', '<', endDate)
                    .get();
    }

    getDocumentsByUid(uid) {
        return this.db.getInstance()
            .collection('documents')
            .where('uid', '==', uid)
            .get();
    }

    getOneDocumentById(id) {
        return this.db.getInstance()
            .collection('documents')
            .doc(id)
            .get();
    }

    getDocumentsByStatus(status) {
        return this.db.getInstance()
            .collection('documents')
            .where('status', '==', status)
            .get();
    }

    getAllDocuments() {
        return this.db.getInstance()
            .collection('documents')
            .get();
    }

    setValueAndStatusOfDocument(id, newValue, newStatus) {
        return this.db.update('documents', id, { amount: newValue, status: newStatus });
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

    async saveTextDocumentOnDatabase(data) {

        return this.db.insert('documents', data);
    }

    async storeDocument(documentBase64) {
        return await storage(documentBase64);
    }

}

module.exports = DocumentsController;