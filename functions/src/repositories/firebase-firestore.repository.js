const firebase = require('../firebase.config');

module.exports = class FirestoreRepository {
    
    constructor(){
        this.db = firebase.firestore();
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
