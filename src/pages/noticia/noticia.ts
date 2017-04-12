import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/*
 Generated class for the Noticia page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-noticia',
    templateUrl: 'noticia.html'
})
export class NoticiaPage {

    noticia: any;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.noticia = navParams.get('noticia');
    }

    ionViewDidLoad() {

    }

}
