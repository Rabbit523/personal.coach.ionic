import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'no-data',
  templateUrl: 'no-data.html',
})
export class NoData {

  @Input() options: NoDataOptions;
  @Input() button: { text: string; color: string; }
  @Output() event = new EventEmitter<any>();
  constructor() {

    let defaults: NoDataOptions = {
      image: 'box',
      text: 'No Data to display!'
    }

    this.options = Object.assign(defaults, this.options);
  }

  onClick() {
    this.event.next();
  }
}

export class NoDataOptions {
  image: string;
  text: string;
}