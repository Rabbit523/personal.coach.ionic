import { Component, OnInit } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthProvider, IonicProvider, ErrorHandlerProvider } from '../../shared/index';
import { CustomValidators } from 'ng2-validation';
import { AngularFireDatabase } from 'angularfire2/database';
import { Login } from '../index';

@Component({
  selector: 'signup',
  templateUrl: 'signup.html'
})
export class Signup implements OnInit {

  signup_form: FormGroup;

  constructor(
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private data$: AngularFireDatabase,
    private auth$: AuthProvider,
    private ionic$: IonicProvider,
    private error$: ErrorHandlerProvider
  ) { }

  ngOnInit() {
    this.signup_form = this.formBuilder.group({
      displayName: ['', Validators.required],
      email: ['dummy@ionicity.com', [Validators.required, CustomValidators.email]],
      password: ['password', [Validators.required]]
    });
  }

  signUp({ value, valid }: { value: { displayName: string; email: string; password: string; }, valid: boolean }) {
    if (valid) {
      // sign up user
      this.auth$.signUp(value).then(
        (res) => {
          // update user name
          this.auth$.updateUser(value)
            .then((user) =>
              // create a user entry in database that will hold other information about user
              this.data$.object('/users/' + res.uid).set({ uid: res.uid, fullname: value.displayName }).then(
                (user) => {
                  this.viewCtrl.dismiss();
                  this.ionic$.presentToast('You have successfully signed up to the app')
                }, (error) => this.error$.handleError(error)),
            (error) => this.error$.handleError(error));
        })
    }
  }

  login() {
    this.viewCtrl.dismiss();
    let modal = this.modalCtrl.create(Login);
    modal.present();
  }

  googleSignIn() {
    this.auth$.logInWithGoogle().then(
      (res) => {
        // create a user entry in database that will hold other information about user
        this.data$.object('/users/' + res.user.uid).set(
          {
            uid: res.user.uid,
            picture: res.user.photoURL,
            fullname: res.user.displayName
          }).then(
          (user) => {
            this.viewCtrl.dismiss();
            this.ionic$.presentToast('You have successfully signed up to the app')
          }, (error) => this.error$.handleError(error))
      },
      (error) => this.error$.handleError(error));
  }

}
