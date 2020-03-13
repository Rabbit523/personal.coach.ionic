import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider, StorageProvider, ErrorHandlerProvider, IonicProvider } from '../../../shared/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { BlogModel, UserModel } from '../../../models/index';

@Component({
  selector: 'add-blog',
  templateUrl: 'add-blog.html'
})
export class AddBlog implements OnInit {

  mi: UserModel;
  blog_form: FormGroup;
  blog: BlogModel | any;
  images: any[] = [];
  types: string[] = ['food', 'lifestyle', 'fitness']
  key: any;
  imageURLS: string[] = []

  cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.CAMERA
  };

  constructor(
    private viewCtrl: ViewController,
    private fb: FormBuilder,
    private camera: Camera,
    private navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private data$: AngularFireDatabase,
    private auth$: AuthProvider,
    private storage$: StorageProvider,
    private ionic$: IonicProvider,
    private error$: ErrorHandlerProvider
  ) { }

  ngOnInit() {
      this.mi = this.auth$.currentUser;
      this.blog = this.navParams.get('blog');
      this.key = this.blog ? this.blog.$key : null;
      this.blog_form = this.fb.group({
        type: [this.blog ? this.blog.type : '', Validators.required],
        title: [this.blog ? this.blog.title : ''],
        images: [[]],
        content: [this.blog ? this.blog.content : '', Validators.required],
        created_at: this.blog ? this.blog.created_at : new Date().toISOString(),
        user: this.fb.group({
          uid: this.blog ? this.blog.user ? this.blog.user.uid : this.mi.uid : this.mi.uid,
          fullname: this.blog ? this.blog.user.fullname : this.mi.fullname,
          picture: this.blog ? this.blog.user.picture : this.mi.picture,
        })
      });
      this.images = this.blog ? this.blog.images : []

  }

  blogType(value) {
    this.blog_form.patchValue({ type: value });
  }

  addImages() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Send Image from',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.cameraOptions.sourceType = this.camera.PictureSourceType.CAMERA
            this.getPicture(this.cameraOptions);
          }
        },
        {
          text: 'Photo Library',
          handler: () => {
            this.cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY
            this.getPicture(this.cameraOptions);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  private getPicture(cameraOptions: CameraOptions) {
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.images.push('data:image/jpeg;base64,' + imageData)
      this.blog_form.patchValue({ images: ['data:image/jpeg;base64,' + imageData] });
    }, (error) => this.ionic$.presentToast(error));
  }

  save({ value, valid }: { value: BlogModel | any, valid: boolean }) {
    if (valid) {
      if (value.images.length > 0) {
        this.storage$.uploadFile(value.title.replace(' ', '_'), value.images[0]).then(
          (res) => this.blog_form.patchValue({ images: [res] })
          , (error) => this.error$.handleError(error));
      }
      this.data$.list('/blogs').push(value).then(
        appt => this.ionic$.presentToast('Blog Created'),
        error => this.error$.handleError(error));
      this.viewCtrl.dismiss();
    } else {
      this.ionic$.presentToast('Form Validation Error')
    }
  }
}
