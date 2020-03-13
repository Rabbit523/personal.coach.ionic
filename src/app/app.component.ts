import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../shared/index';
import { Intro, Walkthrough, Trainers, Gyms, Me, Blogs, MiSchedule } from '../pages/index';
import { Notifications } from '../components/index';
import { UserModel } from '../models/index';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;
  mi: UserModel;
  rootPage: any = Walkthrough;

  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private auth$: AuthProvider,
    private events: Events
  ) {
  }

  public ngOnInit(): void {

    this.initializeApp();
    this.events.subscribe('loggedIn', (user) => {
      this.mi = user;
    })

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Intro', component: Intro },
      { title: 'Blogs', component: Blogs },
      { title: 'Schedule', component: MiSchedule },
      { title: 'Notifications', component: Notifications },
      { title: 'Trainers', component: Trainers },
      { title: 'Gyms', component: Gyms },
      { title: 'Logout', component: Walkthrough },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
    });
  }

  openMe() {
    this.nav.setRoot(Me);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title === 'Logout') {
      this.auth$.logout();
    }
    this.nav.setRoot(page.component);
  }
}
