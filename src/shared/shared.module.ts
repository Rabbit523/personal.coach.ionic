import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {
    SanitizePipe, SanitizeImagePipe, Loading, Rating, NoData, 
    ElasticTextareaDirective, KeyboardAttachDirective, OrderByPipe
} from './index';

import { Keyboard } from '@ionic-native/keyboard';

@NgModule({

    imports: [
        IonicModule
    ],
    declarations: [
        SanitizePipe,
        SanitizeImagePipe,
        Loading,
        Rating,
        NoData,
        ElasticTextareaDirective,
        KeyboardAttachDirective,
        OrderByPipe
    ],
    exports: [
        SanitizePipe,
        SanitizeImagePipe,
        Loading,
        Rating,
        NoData,
        ElasticTextareaDirective,
        KeyboardAttachDirective,
        OrderByPipe
    ],
    providers: [
        Keyboard
    ]
})
export class SharedModule { }