import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';

@Injectable()
export class IonicProvider {


  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  presentToast(message?: string, duration?: string) {
    let durationTime = 0;
    if (duration === 'long') {
      durationTime = 5000;
    } else if (duration === 'short') {
      durationTime = 2500;
    } else {
      durationTime = 3500;
    }
    let toast = this.toastCtrl.create({
      message: message,
      duration: durationTime
    });
    toast.present();
  }

  showAlert(title: string, subTitle: string, buttons?: string) {
    !buttons ? buttons = "OK" : null;
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [buttons]
    });
    alert.present();
  }

  // formular extracted from http://www.movable-type.co.uk/scripts/latlong.html

  calculateDistance(currentCoords, destinationCoords) {
    var R = 6371; // kilometres
    var φ1 = this.toRadians(currentCoords[0]);
    var φ2 = this.toRadians(destinationCoords[0]);
    var Δφ = this.toRadians((destinationCoords[0] - currentCoords[0]));
    var Δλ = this.toRadians((destinationCoords[1] - currentCoords[1]));

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private toRadians(angle) {
    return angle * (Math.PI / 180);
  }
}

import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
 
declare var Connection;
 
@Injectable()
export class Connectivity {
 
  onDevice: boolean;
 
  constructor(public platform: Platform, public network: Network){
    this.onDevice = this.platform.is('cordova');
  }
 
  isOnline(): boolean {
    if(this.onDevice && this.network.type){
      return this.network.type != 'none';
    } else {
      return navigator.onLine; 
    }
  }
 
  isOffline(): boolean {
    if(this.onDevice && this.network.type){
      return this.network.type == 'none';
    } else {
      return !navigator.onLine;   
    }
  }
 
  watchOnline(): any {
    return this.network.onConnect();
  }
 
  watchOffline(): any {
    return this.network.onDisconnect();
  }
 
}