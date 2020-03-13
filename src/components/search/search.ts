import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'search',
  templateUrl: 'search.html'
})

/*
  Dynamically generate a form based on specified fields to search from.
  send form data as an array of string like ['title', 'content', 'rating'] as a navigation parameter with key 'searchable'.
  example from trainers page, oepn search modal and send the following as its nav parameters {searchable: ['fullname', 'gym', 'rating']}
  the search_form will create an array of fields based on the titles specified in the searchable array.

  when search button is clicked, the resulting form object will be sent back to the trainers page and each value will be used to filter the array of trianers and return results that match
 */
export class Search implements OnInit {

  data: any;
  search_form: FormGroup;
  searchTitles: any[] = [];
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.searchTitles = this.navParams.get('searchable');

    this.search_form = this.fb.group({
      search: this.fb.array([])
    });
    const objArray = [];
    this.searchTitles.map((title, index) => {
      let obj = {};
      obj[title] = [];
      objArray.push(obj)
    });


    for (let index = 0; index < this.searchTitles.length; index++) {
      const control = <FormArray>this.search_form.controls['search'];
      control.push(this.fb.group(objArray[index]));
    }
  }

/*
if search_form is empty, return nothing, else return results from the search_form
*/
  search({ value, valid }: { value: any, valid: boolean }) {
    let search = [];
    value.search.map((element, index) => {
      if (element[this.searchTitles[index]] !== null)
        search.push(element);
    });
    if (search.length !== 0) {
      let result = _.reduce(search,
        function (memo, current) {
          return _.extend(memo, current)
        }, {})
      this.viewCtrl.dismiss(result)
    } else {
      this.viewCtrl.dismiss()
    }
  }

  reset(){
     this.viewCtrl.dismiss();
  }

}
