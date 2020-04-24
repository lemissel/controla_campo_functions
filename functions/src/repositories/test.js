const {format} = require('util');
const {Storage} = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');

const visionClient = new vision.ImageAnnotatorClient();

const storage = new Storage({
    projectId: "controlacampo-868f2",
    keyFilename: "../../controlacampo.json"
});

// const bucket = storage.bucket("gs://controlacampo-868f2.appspot.com");

// // const file = bucket.file('0aLYIWW894aGoNC8iQaHxWmPsG83_1585952147546.jpg');
// const file = bucket.file('boas_condicoes.jpg');

// // eslint-disable-next-line promise/catch-or-return
// // eslint-disable-next-line promise/always-return
// file.get().then((data) => {
//     const f = data[0];
//     const apiResponse = data[1];

//     visionClient.documentTextDetection(apiResponse.mediaLink).then(textRequest => {
//       const fullText = textRequest[0].textAnnotations[0];
//       const text = fullText ? fullText.description : null;
//       console.log('tt')
//       console.log(text);
//     })
//     .catch(console.error);
    

//   })
//   .catch(console.error);

// const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();

  async function test() {
    // Performs text detection on the gcs file
    const [result] = await client.textDetection('gs://controlacampo-868f2.appspot.com/boas_condicoes.jpg');
    const detections = result.textAnnotations;
    console.log('Text:');
    detections.forEach(text => console.log(text));
  }

  test();

//module.exports = uploadImageToStorage;
