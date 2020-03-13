import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ErrorHandlerProvider {

    constructor(
        public toastCtrl: ToastController
    ) { }
    
    handleError(err: any) {
        if (typeof err === 'string') {
            this.presentToast(err);
        } else if (err instanceof Response) {
            const res: Response = err;
            if (res.text() && res.text() !== res.statusText) {
                this.presentToast(res.text() + '\n' + res.statusText);
            } else {
                this.presentToast(res.statusText);
            }
        } else if (err && err.message) {
            this.presentToast(err.message);
        } else if (err) {
            this.presentToast(err.toString());
        } else {
            this.presentToast('An unknown error has occurred');
        }
    }

    private presentToast(message?: string, duration?: string) {
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
}