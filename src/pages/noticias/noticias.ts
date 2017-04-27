import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Api} from "../../app/api/api";
import {NoticiaPage} from "../noticia/noticia";

@Component({
    selector: 'page-noticias',
    templateUrl: 'noticias.html'
})
export class NoticiasPage {

    noticias: any;
    endPonit = "noticias";

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    }

    ngOnInit() {
        this.api.get(this.endPonit).subscribe((data) => {
            this.noticias = data.json();
        });
    }

    openNoticia(noticia) {
        this.navCtrl.push(NoticiaPage, {noticia: noticia});
    }

}
