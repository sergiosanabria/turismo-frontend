import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import {AtraccionPage} from "../atraccion/atraccion";
import {BarcodeScanner} from 'ionic-native';
import {Api} from "../../app/api/api";
import {Sync} from "../../app/api/sync";
import {MapaAtraccionPage} from "../mapa-atraccion/mapa-atraccion";

/*
 Generated class for the Atracciones page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-atracciones',
    templateUrl: 'atracciones.html'
})
export class AtraccionesPage {

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

            for (let atraccion of this.atracciones) {
                if (atraccion.archivos.fotos.length) {
                    for (let foto of atraccion.archivos.fotos) {
                        this.getLocalFile(foto, '.jpg');
                    }
                }

                if (atraccion.archivos.audios.length) {
                    for (let audio of atraccion.archivos.audios) {
                        this.getLocalFile(audio, '.mp4');
                    }
                }
            }

        }).catch((err) => {

            this.updateApp();

        });
    }

    presentAtraccionModal(atraccion) {
        this.navCtrl.push(AtraccionPage, {atraccion: atraccion});

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

    getAtraccion(id) {
        for (let atraccion of this.atracciones) {
            console.log(atraccion.id);
            if (id == atraccion.id) {
                this.presentAtraccionModal(atraccion);
            }
        }
    }

    scan() {
        BarcodeScanner.scan({
            resultDisplayDuration: 0
        }).then(
            (barcodeData) => {


                //alert(JSON.stringify(barcodeData));

                if (!barcodeData.cancelled) {

                    this.getAtraccion(barcodeData.text);
                }
            }
        );
    }

    openMap() {
        this.navCtrl.push(MapaAtraccionPage, {
            atracciones: this.atracciones
        })
    }


}
