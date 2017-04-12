import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {LugarPage} from "../lugar/lugar";
import {BarcodeScanner} from 'ionic-native';
import {Api} from "../../app/api/api";
import {Sync} from "../../app/api/sync";

/*
 Generated class for the Lugares page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-lugares',
    templateUrl: 'lugares.html'
})
export class LugaresPage {

    atracciones: any;
    endPonit = "atraccion";
    search = '';

    offline = false;

    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public api: Api, public sync: Sync) {


    }

    ionViewDidEnter() {

        this.sync.getJson('offline').then((modo) => {
            this.offline = modo.data;
            console.log('modo', modo);
            if (!this.offline) {
                this.getAtraccionesOnline();
            } else {

                this.getAtraccionesStored();

            }
        }).catch((err) => {
            console.log('modoerr', err);

            this.sync.storeJson({data: false}, 'offline').then((ok) => {
                console.log("OKguardo", ok);
            }).catch((err) => {
                console.log("erroguyardo", err);
            });
            this.api.get(this.endPonit).subscribe((data) => {
                this.atracciones = data.json();
            });
        });


    }

    getAtraccionesOnline() {
        this.api.get(this.endPonit).subscribe((data) => {
            this.atracciones = data.json();
        });
    }

    getAtraccionesStored() {
        this.sync.getJson('atracciones').then((datas) => {
            this.atracciones = datas;

            for (let lugar of this.atracciones) {
                if (lugar.archivos.fotos.length) {
                    for (let foto of lugar.archivos.fotos) {
                        this.getLocalFile(foto, '.jpg');
                    }
                }

                if (lugar.archivos.audios.length) {
                    for (let audio of lugar.archivos.audios) {
                        this.getLocalFile(audio, '.mp4');
                    }
                }
            }

        }).catch((err) => {

            this.updateApp();

        });
    }

    presentLugarModal(lugar) {
        this.navCtrl.push(LugarPage, {lugar: lugar});

    }

    updateApp() {

        this.api.get(this.endPonit).subscribe((data) => {
            this.atracciones = data.json();
            this.sync.updateApp(this.atracciones).then((d) => {
                alert('ya almaceno todo');
            });
        });

    }

    setOffline() {
        this.sync.storeJson({data: this.offline}, 'offline');
        if (this.offline) {
            this.getAtraccionesStored();
        } else {
            this.getAtraccionesOnline();
        }
    }


    removeJson() {
        this.sync.removeJson('atracciones');
    }

    getLocalFile(foto, ext) {

        this.sync.getLocalDir(foto.id, ext).then((url) => {
            foto.ruta = url;
        }).catch((er) => {

        });
    }

    getLugar(id) {
        for (let lugar of this.atracciones) {
            console.log(lugar.id);
            if (id == lugar.id) {
                this.presentLugarModal(lugar);
            }
        }
    }

    scan() {
        BarcodeScanner.scan().then(
            (barcodeData) => {


                //alert(JSON.stringify(barcodeData));

                if (!barcodeData.cancelled) {

                    this.getLugar(barcodeData.text);
                }
            }
        );
    }


}
