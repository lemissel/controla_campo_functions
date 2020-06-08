const FirestoreRepository = require('../repositories/firebase-firestore.repository');

class UsersController {
    constructor() {
        this.db = new FirestoreRepository();
    }

    async newUser(user) {
        return this.db.insert('users', user);
    }

    async getUsers() {
        return this.db.getInstance().collection('users').get();
    }

    async getUserByUid(uid) {
        return this.db.getInstance()
            .collection('users')
            .where('uid', '==', uid)
            .get();
    }

    async updateUserById(id, newUserData) {
        return this.db.update('users', id, newUserData);
    }

    async removeUser(id) {
        return this.db.delete(id);
    }

    async addProviderToUser(id, newProviderData) {

        const fb = require('../firebase.config');


        return this.db.getInstance()
                .collection('users')
                .doc(id)
                .update({
                    providers: fb.firestore.FieldValue.arrayUnion(newProviderData)
                }, {merge: true});
                
    }

}

module.exports = UsersController;
