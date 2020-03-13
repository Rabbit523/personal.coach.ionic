import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider, ErrorHandlerProvider, IonicProvider } from '../../shared/index';
import { AddBlog } from '../index';
import { BlogModel, UserModel } from '../../models/index';
import { Search } from '../../components/index';

@Component({
  selector: 'page-blogs',
  templateUrl: 'blogs.html',
})
export class Blogs implements OnInit {

  mi: UserModel;
  blog_type: string = 'food';
  segments: Array<{ title: string; click?: (e: any) => void }>
  blogs: BlogModel[];
  blogsBackUp: BlogModel[];
  isLoading: boolean;

  constructor(
    private modalCtrl: ModalController,
    private data$: AngularFireDatabase,
    private auth$: AuthProvider,
  ) { }

  ngOnInit() {
    this.segments = [
      {
        title: 'food',
        click: () => {
          this.getData('food');
        }
      },
      {
        title: 'fitness',
        click: () => {
          this.getData('fitness');
        }
      },
      {
        title: 'lifestyle',
        click: () => {
          this.getData('lifestyle');
        }
      },
    ];
    this.mi = this.auth$.currentUser;
    this.getData(this.blog_type);
  }

  getData(type: string) {
    this.blog_type = type;
    this.isLoading = true;
    this.data$.list('/blogs/',
    ref => ref.orderByChild('type').equalTo(this.blog_type)).valueChanges()
      .subscribe((blogs: BlogModel[]) => {
        this.isLoading = false;
        this.blogs = this.blogsBackUp = blogs;
      })

  }

  add() {
    let modal = this.modalCtrl.create(AddBlog);
    modal.present();
  }

  search() {
    let modal = this.modalCtrl.create(Search, { searchable: ['title', 'type','content'] });
    modal.onDidDismiss((search) => {
       this.blogs = this.blogsBackUp;
      if (search) {
        this.blogs = this.blogs.filter(blog => {
          return search.title ? blog.title.toLowerCase().indexOf(search.title.toLowerCase()) > -1 : null
            || search.type ? blog.type.toLowerCase().indexOf(search.type.toLowerCase()) > -1 : null
            || search.content ? blog.content.toLowerCase().indexOf(search.content.toLowerCase()) > -1 : null
        })
      }
    })
    modal.present();
  }

}
