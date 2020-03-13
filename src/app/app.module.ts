import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MomentModule } from 'angular2-moment';

import { APP_CONFIG, FIREBASE_CONFIG } from './base.url';
import { MyApp } from './app.component';

import { Search, Login, Signup, Calendar, Chat, Map, Notifications, NotificationForm } from '../components/index';
import { GoogleMaps, Connectivity, AuthProvider, IonicProvider, ErrorHandlerProvider } from '../shared/index';
import {
  Walkthrough,
  Gyms,
  Trainers,
  Me,
  Intro,
  AddBlog,
  Blog,
  BlogComments,
  Blogs,
  FitnessBlog,
  FoodBlog,
  LifestyleBlog,
  MiProfile,
  MiProfileForm,
  MiSchedule,
  MiReads,
  MiGoals,
  MiHealth,
  Gym,
  Trainer,
  Appointment
} from '../pages/index';
import { SharedModule } from '../shared/shared.module';
import { StorageProvider } from '../shared/providers/storage.provider';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';
import { Geolocation } from '@ionic-native/geolocation';
import { CallNumber } from '@ionic-native/call-number';
import { Network } from '@ionic-native/network';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PhotoLibrary } from '@ionic-native/photo-library';

@NgModule({
  declarations: [
    MyApp,
    Search,
    Login,
    Signup,
    Calendar,
    Chat,
    Map,
    Notifications,
    NotificationForm,
    Walkthrough,
    Gyms,
    Trainers,
    Me,
    Intro,
    AddBlog,
    Blog,
    BlogComments,
    Blogs,
    FitnessBlog,
    FoodBlog,
    LifestyleBlog,
    MiProfileForm,
    MiProfile,
    MiSchedule,
    MiReads,
    MiGoals,
    MiHealth,
    Gym,
    Trainer,
    Appointment
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    MomentModule,
    SharedModule,
    IonicModule.forRoot(MyApp, APP_CONFIG),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Search,
    Login,
    Signup,
    Calendar,
    Chat,
    Map,
    Notifications,
    NotificationForm,
    Walkthrough,
    Gyms,
    Trainers,
    Me,
    Intro,
    AddBlog,
    Blog,
    BlogComments,
    Blogs,
    FitnessBlog,
    FoodBlog,
    LifestyleBlog,
    MiProfile,
    MiProfileForm,
    MiSchedule,
    MiReads,
    MiGoals,
    MiHealth,
    Gym,
    Trainer,
    Appointment
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Keyboard,
    Geolocation,
    Connectivity,
    CallNumber,
    Network,
    InAppBrowser,
    SocialSharing,
    PhotoLibrary,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    GoogleMaps,
    StorageProvider,
    IonicProvider,
    ErrorHandlerProvider
  ]
})
export class AppModule { }
