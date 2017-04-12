import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';


@Component({
    selector: 'page-lugar',
    templateUrl: 'lugar.html'
})
export class LugarPage {


    lugar: any;

    constructor(public navCtrl: NavController, params: NavParams, public viewCtrl: ViewController) {
        this.lugar = params.get('lugar');

    }


    ionViewDidLoad() {
        console.log('Hello LugarPage Page');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
