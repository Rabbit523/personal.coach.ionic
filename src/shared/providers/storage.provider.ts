import { Injectable, Inject } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import firebase from 'firebase';

@Injectable()
export class StorageProvider {

    storage: any;

    constructor(
        @Inject(FirebaseApp) firebaseApp: any
    ) {
        this.storage = firebase.storage();
    }

    uploadFile(filename, data) {
        let storageRef = firebase.storage().ref().child(filename);
        return storageRef
            .putString(data, 'data_url')
            .then(snapshot => { return snapshot.downloadURL })
            .catch(error => { return error });
    }
}