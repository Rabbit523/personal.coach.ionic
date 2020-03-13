import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'rating',
  templateUrl: 'rating.html',
})
export class Rating {
 private range: Array<number>;
    @Input() rate: number;
    @Input() color: string = 'favorite';
    @Input() align: string = 'center';
    @Output() updateRate = new EventEmitter();

    constructor() {
        this.range = [1, 2, 3, 4, 5];
    }

    update(value) {
        this.rate = value;
        this.updateRate.emit(value);
    }
}
