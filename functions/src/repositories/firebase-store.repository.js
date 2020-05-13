const {format} = require('util');
const {Storage} = require('@google-cloud/storage');

const storage = new Storage({
    projectId: "controlacampo-868f2",
    keyFilename: "controlacampo.json"
});

const bucket = storage.bucket("gs://controlacampo-868f2.appspot.com");

/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
const uploadImageToStorage = (file) => {


    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No image file'));
        }

        let newFileName = `${file.originalname}_${Date.now()}.jpg`;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            gzip: true,
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            reject(new Error(error + 'Something is wrong! Unable to upload at the moment.'));
        });

        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const url = format(`gs://${bucket.name}/${fileUpload.name}`);
            resolve(url);
        });

        blobStream.end(file.buffer)

    });
}

const getFile = (filename) => {
    bucket.getFile((err, files) => {
        if(err) console.error(err);

        console.log(files);
    })
}

module.exports = uploadImageToStorage;
