const fs = require('fs');
const storage = require('../repositories/firebase-store.repository');

class DocumentsController {
    constructor() {}

    async newDocument(documentBase64) {

        let sendImageToBucket, ocrRecognizer;

        console.log('entrei')

        sendImageToBucket = await this.storeDocument(documentBase64);
        ocrRecognizer = await this.getTextByOCR(documentBase64);

        return sendImageToBucket;

    }

    async getTextByOCR(imageBlob) {

        console.log('strat')

        // // TODO: OBTER a imagem
        // let image = fs.createReadStream(imageBlob.buffer);
        // image.on('error', (error) => {
        //     return new Error(error + 'Something is wrong! Unable to upload at the moment.');
        // });

        // image.on('finish', () => {
        //     // The public URL can be used to directly access the file via HTTP.
        //     console.log('finished')
        // });

        // image.end(imageBlob.buffer);

        // console.log(image)

        // TODO: Obter imagem
        // TODO: executar o OCR
        // TODO: Limpar string (Remover \N e *)
        // TODO: Extrair o total


        let pattern = /(Total|REAIS|PAGAR):*.*R*\$* (\d*,.\d*)/gmi;

        const text = 'Total 90,99';
        
        let extractTotalFLoat = pattern.exec(text);
        // let totalFloatToStore = extractTotalFloat[1];
        
        console.log(extractTotalFLoat);
        return 'teste';

        //return text;
    }

    async saveTextDocumentOnDatabase(textProceced) {

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

}

module.exports = DocumentsController;
