import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewController, NavParams, Content } from 'ionic-angular';
import { BlogModel, UserModel } from '../../../models/index';
import { FormControl } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../../shared/index';

@Component({
  selector: 'blog-comments',
  templateUrl: 'blog-comments.html'
})
export class BlogComments implements OnInit {

  blog: BlogModel | any;
  comments: BlogComments[];
  mi: UserModel;
  message = new FormControl();
  @ViewChild(Content) content: Content;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private data$: AngularFireDatabase,
    private auth$: AuthProvider,
    private ionic$: IonicProvider,
    private error$: ErrorHandlerProvider
  ) { }

  ngOnInit() {
    this.mi = this.auth$.currentUser;
    this.blog = this.navParams.data;
    this.data$.list('/blogs/' + this.blog.$key + '/comments/').valueChanges()
    .subscribe((comments: any)=>
    this.comments = comments
    )
  }

  ionViewDidEnter() {
    this.content.scrollToBottom(0)
  }

  delete(comment) {
    this.data$.list('/blogs/' + this.blog.$key + '/comments/')
      .remove(comment.$key).then(
      () => this.content.resize(),
      (error) => this.error$.handleError(error));
  }

  send(message) {
    this.data$.list('/blogs/' + this.blog.$key + '/comments')
      .push({
        uid: this.mi.uid,
        fullname: this.mi.fullname ? this.mi.fullname : '',
        picture: this.mi.picture ? this.mi.picture : '',
        text: message,
        date: new Date().toISOString()
      }).then(
      () => {
        this.message.reset();
        this.content.scrollToBottom();
      },
      (error) => this.error$.handleError(error));
  }

}
