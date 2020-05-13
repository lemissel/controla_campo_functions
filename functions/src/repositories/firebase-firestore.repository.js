require('dotenv').config();

const admin = require('firebase-admin');

module.exports = class FirestoreRepository {
    
    constructor(){
        admin.initializeApp({
            credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS)
        });

        this.db = admin.firestore();
    }

    async insert(collection, values) {
        return this.db
            .collection(collection)
            .doc()
            .set(values);
    }

    async selectAll(collection) {
        return this.db
            .collection(collection)
            .get();
    }

    async select(collection, leftSentence, comparsion, rightSentence) {
        return this.db
            .collection(collection)
            .where(leftSentence, comparsion, rightSentence)
            .get();
    }

    async delete(collection, doc) {
        return this.db
            .collection(collection)
            .doc(doc)
            .delete();
    }

    async update(collection, doc, values) {
        return this.db
            .collection(collection)
            .doc(doc)
            .update(values);
    }

    getInstance() {
        return this.db;
    }
}
