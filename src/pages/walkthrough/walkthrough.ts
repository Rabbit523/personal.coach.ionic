import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Slides, ModalController, Events } from 'ionic-angular';
import { Intro } from '../../pages/index';
import { Login } from '../../components/index';
import { AuthProvider } from '../../shared/index';

@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html'
})
export class Walkthrough implements OnInit {

  @ViewChild(Slides) slider: Slides;
  slides: Array<{ title: string; paragraph: string; image: string; button?: { text: string; show: boolean; click?: (e: any) => void } }> = [];
  currentSlideIndex: number = 0;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private events: Events,
    private auth$: AuthProvider
  ) { }

  ngOnInit() {
    this.start();
  }

  ionViewDidLoad() {
    this.slides = [
      {
        title: 'Trainers',
        paragraph: 'Find trainers around you and suiting to your goals',
        image: './assets/walkthrough/trainer.png',
      },
      {
        title: 'Gyms',
        paragraph: 'Find the best and affordable gyms around you and suiting to your goals',
        image: './assets/walkthrough/gym.png',
      },
      {
        title: 'Nutrition',
        paragraph: 'Information about nutrition, track your calories, find out suitable suppliments',
        image: './assets/walkthrough/nutrition.png'
      },
      {
        title: 'News & Blogs',
        paragraph: 'Fitness new and blogs from curators and other Personal Coach users',
        image: './assets/walkthrough/news.png'
      },
      {
        title: 'You',
        paragraph: 'List your goals, Achieve & Be the best You!',
        image: './assets/walkthrough/you.png',
        button: {
          text: 'Get Started',
          show: false,
          click: () => { this.getStarted() }
        }
      },
    ]
  }

  slideChanged() {
    this.currentSlideIndex = this.slider.getActiveIndex();
  }

  previous() {
    if (this.currentSlideIndex !== 0) this.slider.slidePrev();
  }

  next() {
    if (this.currentSlideIndex !== this.slides.length - 1) this.slider.slideNext();
  }

  getStarted() {
    let modal = this.modalCtrl.create(Login);
    modal.onDidDismiss(() => {
      this.start()
    });
    modal.present();
  }

  isAuthenticated() {
    return this.auth$.isAuthenticated();
  }

  start() {
    this.auth$.isAuthenticated().subscribe((authResp) => {
      if (authResp) {
        this.events.publish('loggedIn', authResp);
        this.navCtrl.setRoot(Intro)
      }
    });
  }

}
