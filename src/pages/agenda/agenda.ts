import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/*
 Generated class for the Agenda page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-agenda',
    templateUrl: 'agenda.html'
})
export class AgendaPage {

    agenda: any;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.agenda = navParams.get('agenda');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AgendaPage');
    }

}
