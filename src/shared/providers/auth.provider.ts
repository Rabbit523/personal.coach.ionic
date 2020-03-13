import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { StorageProvider } from './storage.provider';
import { Observable } from 'rxjs';
import { UserModel } from '../../models';

@Injectable()
export class AuthProvider {

    authState: boolean;
    public currentUser: UserModel;

    constructor(
        private fireauth: AngularFireAuth,
        private storage$: StorageProvider,
        private data$: AngularFireDatabase,
    ) { }

    isAuthenticated(): Observable<any> {
        return this.fireauth.authState;
    }

    signUp({ email, password }: { email: string; password: string }) {
        return this.fireauth.auth
            .createUserWithEmailAndPassword(email, password)
            .then(res => { return res })
            .catch(error => { return error });
    }

    logIn({ email, password }: { email: string; password: string }) {
        return this.fireauth.auth
            .signInWithEmailAndPassword(email, password)
            .then(res => { return res })
            .catch(error => { return error });
    }

    logInWithFacebook() {
        return this.fireauth.auth
            .signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then(res => { return res })
            .catch(error => { return error });
    }

    logInWithGoogle() {
        return this.fireauth.auth
            .signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then(res => { return res })
            .catch(error => { return error });
    }

    getUser() {
        return this.data$.object('/users/' + this.fireauth.auth.currentUser.uid).valueChanges().map((user: UserModel) => {
            this.currentUser = user;
            return user;
        });
    }

    /* Check if image has been changed,
     save image and user profile,
     return user profile
    */
    updateUser(user) {
        if (user.photoURL) {
            return this.storage$
                .uploadFile(user.uid+'-image', user.photoURL)
                .then((file) => {
                    user.photoURL = file;
                    return this.fireauth.auth.currentUser.updateProfile(user).then(
                        () => { return user },
                        (error) => { return error });
                });
        } else {
            return this.fireauth.auth.currentUser.updateProfile(user).then(
                () => { return user },
                (error) => { return error });
        }
    }

    sendPasswordReset(email: string) {
        this.fireauth.auth
            .sendPasswordResetEmail(email)
            .then(() => {
                // Email sent.
            }, (error) => {
                // An error happened.
            });
    }

    logout() {
        return this.fireauth.auth.signOut();
    }

}

export class User {
    displayName: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean
    phoneNumber: string;
    photoURL: string;
    providerData: Array<UserProvider>;
}

export class UserProvider {
    displayName: string;
    email: string;
    uid: boolean;
    providerId: string;
    photoURL: string;
}
