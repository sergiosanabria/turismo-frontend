import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Api} from "../../app/api/api";
import {AgendaPage} from "../agenda/agenda";

/*
 Generated class for the Agendas page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-agendas',
    templateUrl: 'agendas.html'
})
export class AgendasPage {

    hoy = new Date();
    fecha = new Date();
    endPonit = 'agendas';
    agendas: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {

    }

    ngOnInit() {
        this.api.get(this.endPonit).subscribe((data) => {
            this.agendas = data.json();
        });
    }

    setDate(date) {
        this.fecha = date;
    }

    open(agenda) {
        this.navCtrl.push(AgendaPage, {agenda: agenda});
    }

    upDownDate(op) {
        if (op == '+') {
            this.fecha = new Date(this.fecha.getTime() + 24 * 60 * 60 * 1000);

        } else {
            this.fecha = new Date(Date.now() - 24 * 60 * 60 * 1000);
        }
    }

}
