import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { BlogModel, UserModel } from '../../../models/index';
import { BlogComments } from '../../index';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../../shared/index';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as _ from 'lodash';

@Component({
  selector: 'blog',
  templateUrl: 'blog.html'
})
export class Blog implements OnInit {

  blog: BlogModel;
  mi:UserModel;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private socialshare: SocialSharing,
    private data$: AngularFireDatabase,
    private auth$: AuthProvider,
    private ionic$: IonicProvider,
    private error$: ErrorHandlerProvider
  ) { }

  ngOnInit() {
    this.mi = this.auth$.currentUser;
    this.blog = this.navParams.data;
  }

  likedByUser(blog) {
      blog.likes_count = _.size(blog.likes);
      blog.comments_count = _.size(blog.comments);
      return blog.likes && this.mi ? blog.likes[this.mi.uid] : undefined;
  }

  like(blog) {
    let likedbyUser = blog.likes && this.mi ? blog.likes[this.mi.uid] : undefined;
    if (!likedbyUser) {
      this.data$.object('/blogs/' + blog.$key + '/likes/' + this.mi.uid)
        .set({
          name: this.mi.fullname,
          picture: this.mi.picture,
          date: new Date()
        })
        .then(() => this.ionic$.presentToast('You Liked this post'),
        error => this.error$.handleError(error));
    } else {
      this.data$.object('/blogs/' + blog.$key + '/likes/' + this.mi.uid)
        .remove().then(() => this.ionic$.presentToast('You Unliked this post'),
        error => this.error$.handleError(error));
    }
  }

  comment(blog) {
    let modal = this.modalCtrl.create(BlogComments, blog);
    modal.present();
  }

  share(blog) {
    this.socialshare.share();
  }

  bookmark(blog) {
    let bookmarked = blog.bookmarks && this.mi ? blog.bookmarks[this.mi.uid]: undefined;
    if (!bookmarked) {
      this.data$.object('/blogs/' + blog.$key + '/bookmarks/' + this.mi.uid)
        .set(this.mi.uid)
        .then(() => this.ionic$.presentToast('You have saved this post'),
        error => this.error$.handleError(error));
    } else {
      this.data$.list('/blogs/' + blog.$key + '/bookmarks/' +this.mi.uid)
        .remove()
        .then(() => this.ionic$.presentToast('You have saved this post'),
        error => this.error$.handleError(error));
    }
  }
}
