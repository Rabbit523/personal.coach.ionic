import { Component, OnInit } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthProvider, IonicProvider, ErrorHandlerProvider } from '../../shared/index';
import { CustomValidators } from 'ng2-validation';
import { AngularFireDatabase } from 'angularfire2/database';
import { Signup } from '../index';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class Login implements OnInit {

  login_form: FormGroup;

  constructor(
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private auth$: AuthProvider,
    private data$: AngularFireDatabase,
    private ionic$: IonicProvider,
    private error$: ErrorHandlerProvider
  ) { }


  ngOnInit() {
    this.login_form = this.formBuilder.group({
      email: ['dummy@ionicity.com', [Validators.required, CustomValidators.email]],
      password: ['password', [Validators.required]]
    });
  }

  signIn({ value, valid }: { value: { email: string; password: string; }, valid: boolean }) {
    if (valid) {
      this.auth$.logIn(value).then(
        (res) => this.viewCtrl.dismiss(),
        (error) => this.error$.handleError(error));
    }
  }

  googleSignIn() {
    this.auth$.logInWithGoogle().then(
      (res) => {
        // if user already exists
        if (this.data$.object('/users/' + res.user.uid)) {
          this.viewCtrl.dismiss();
        }
        // if user does not exist in database, create and entry and populate data
        else {
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
        }
      }, (error) => this.error$.handleError(error));

  }

  signup() {
    this.viewCtrl.dismiss();
    let modal = this.modalCtrl.create(Signup);
    modal.present();
  }
}
