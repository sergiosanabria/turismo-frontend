import {Component, ElementRef, ViewChild} from '@angular/core';
import {
    ActionSheetController, AlertController, LoadingController, NavController, NavParams, Select, ToastController,
    ViewController
} from 'ionic-angular';
import {GeocodingService} from "../../directives/map/geocode.service";
import {MapService} from "../../directives/map/map.service";
import {Geolocation} from '@ionic-native/geolocation';
import {RutaPage} from "../ruta/ruta";
import {SocialSharing} from "@ionic-native/social-sharing";
import {TextToSpeech} from '@ionic-native/text-to-speech';
import {ApiTranslate} from "../../app/api/api-translate";

@Component({
    selector: 'page-atraccion',
    templateUrl: 'atraccion.html'
})
export class AtraccionPage {

    @ViewChild('contenedorMapaAtraccion') contenedorMapa: ElementRef;
    atraccion: any;
    map: any;
    played = false;
    playedTranslate = false;

    textToSpeak = '';

    constructor(public navCtrl: NavController,
                params: NavParams,
                public viewCtrl: ViewController,
                public alertCtrl:AlertController,
                public mapservice: MapService,
                private geolocation: Geolocation,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public actionSheetCtrl: ActionSheetController,
                private socialSharing: SocialSharing,
                private tts: TextToSpeech,
                private apiTranslate: ApiTranslate,
                public geocoder: GeocodingService) {
        this.atraccion = params.get('atraccion');
        this.textToSpeak = this.removeDiacritics(this.atraccion.cuerpo.replace(/(<([^>]+)>)/ig, ""));


    }


    ionViewDidEnter() {
        console.log('Hello AtraccionPage Page');
        if (!this.atraccion.direccion_mapa) {
            return false;
        }
        let location = this.geocoder.geocode(this.atraccion.direccion_mapa);

        location.subscribe(location => {
            console.log(location);
            if (!location.valid) {
                return;
            }

            let mapId = 'map-atraccion-id';
            this.contenedorMapa.nativeElement.innerHTML = '<div style="height:150px;" id="' + mapId + '"></div>';

            this.map = this.mapservice.createMap(mapId, location.latitude, location.longitude);
            let latlng = new Array();
            latlng.push(location.latitude);
            latlng.push(location.longitude);
            this.mapservice.addMarker(latlng, "Acá está!");


        }, error => console.error(error));
    }

    comoLlegar() {
        let actionSheet = this.actionSheetCtrl.create({
            title: "Abrir mapa con:",
            buttons: [
                {
                    color: 'danger',
                    icon: 'logo-google',
                    text: 'Google Maps',
                    role: 'gmaps',
                    cssClass: 'g-maps',
                    handler: () => {
                        this.gMaps();
                    }
                }, {
                    cssClass: 'leaflet',
                    icon: 'map',
                    text: 'Leaflet',
                    role: 'leaflet',
                    handler: () => {
                        this.leaflet();
                    }
                }
            ]
        });
        actionSheet.present();
    }

    speak() {
        if (!this.played) {
            this.played = true;
            this.tts.speak({
                text: this.textToSpeak,
                locale: 'es-AR'
            }).then((data) => {
                console.log(data)
            });
        } else {
            this.tts.speak({
                text: '',
                locale: 'es-AR'
            }).then((data) => {
                console.log(data)
            });
            this.played = false;
        }

    }

    speackTranslate() {

        this.apiTranslate.post(this.textToSpeak, 'es', 'it')
            .then((response) => {
                let text = response.json().text;
                let alert = this.alertCtrl.create({
                    title: 'Texto traducido',
                    subTitle: text,
                    buttons: ['OK']
                });
                alert.present();
                if (!this.playedTranslate) {
                    this.playedTranslate = true;
                    this.tts.speak({
                        text: text,
                        locale: 'it-IT'
                    }).then((data) => {
                        console.log(data)
                    });
                } else {
                    this.tts.speak({
                        text: '',
                        locale: 'en-US'
                    }).then((data) => {
                        console.log(data)
                    });
                    this.playedTranslate = false;
                }
            });


    }

    removeDiacritics(str) {

        var rp = String(str);
        //
        rp = rp.replace(/&aacute;/g, 'á');
        rp = rp.replace(/&eacute;/g, 'é');
        rp = rp.replace(/&iacute;/g, 'í');
        rp = rp.replace(/&oacute;/g, 'ó');
        rp = rp.replace(/&uacute;/g, 'ú');
        rp = rp.replace(/&ntilde;/g, 'ñ');
        rp = rp.replace(/&uuml;/g, 'ü');
        //
        rp = rp.replace(/&Aacute;/g, 'Á');
        rp = rp.replace(/&Eacute;/g, 'É');
        rp = rp.replace(/&Iacute;/g, 'Í');
        rp = rp.replace(/&Oacute;/g, 'Ó');
        rp = rp.replace(/&Uacute;/g, 'Ú');
        rp = rp.replace(/&Ntilde;/g, 'Ñ');
        rp = rp.replace(/&Uuml;/g, 'Ü');
        rp = rp.replace(/&nbsp;/g, '');
        //
        return rp;

    }

    share() {
        this.socialSharing.share(this.atraccion.titulo, this.atraccion.resumen, this.atraccion.archivos.fotos.length ? this.atraccion.archivos.fotos[0] : '').then(() => {
            let toast = this.toastCtrl.create({
                message: "Compartiendo...",
                duration: 1500,
                position: 'center'
            });

            toast.present(toast);

        }).catch(() => {
            // Error!
        });
    }

    gMaps() {

        if (!this.atraccion.direccion_mapa) {
            let toast = this.toastCtrl.create({
                message: "No tiene cargada la dirección.",
                duration: 1500,
                position: 'center'
            });

            toast.present(toast);

            return false;
        }

        let loader = this.loadingCtrl.create({
            content: "Abriendo mapa",
            // duration: 6000
        });
        loader.present();

        this.geolocation.getCurrentPosition({timeout: 8000}).then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude

            let actual = resp.coords.latitude + ", " + resp.coords.longitude;

            let location = this.geocoder.geocode(this.atraccion.direccion_mapa);

            location.subscribe(location => {

                loader.dismissAll();
                if (!location.valid) {
                    let toast = this.toastCtrl.create({
                        message: "No se ha encontrado la dirección en el mapa.",
                        duration: 1500,
                        position: 'center'
                    });

                    toast.present(toast);
                    return;
                }

                var newBounds = location.viewBounds;

                let destino = location.latitude + ", " + location.longitude;

                let toast = this.toastCtrl.create({
                    message: "Ruta encontrada!",
                    duration: 1500,
                    position: 'center'
                });

                toast.present(toast);

                let url = "https://www.google.com/maps/dir/" + actual + "/" + destino;


                window.open(url, "_system");

            }, error => {
                loader.dismissAll();
                let toast = this.toastCtrl.create({
                    message: "Considerá instalarte Google Maps! :)",
                    duration: 1500,
                    position: 'center'
                });

                toast.present(toast);
            });

        }).catch((error) => {
            loader.dismissAll();
            let toast = this.toastCtrl.create({
                message: "No se ha encontrado la dirección en el mapa.",
                duration: 1500,
                position: 'center'
            });

            toast.present(toast);
        });
    }

    leaflet() {

        if (!this.atraccion.direccion_mapa) {
            let toast = this.toastCtrl.create({
                message: "No tiene cargada la dirección.",
                duration: 1500,
                position: 'center'
            });

            toast.present(toast);

            return false;
        }

        let loader = this.loadingCtrl.create({
            content: "Abriendo mapa",
            // duration: 6000
        });
        loader.present();

        this.geolocation.getCurrentPosition({timeout: 8000}).then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude

            let actual = {
                lat: resp.coords.latitude,
                lng: resp.coords.longitude,
            };

            let location = this.geocoder.geocode(this.atraccion.direccion_mapa);

            location.subscribe(location => {

                loader.dismissAll();
                if (!location.valid) {
                    let toast = this.toastCtrl.create({
                        message: "No se ha encontrado la dirección en el mapa.",
                        duration: 1500,
                        position: 'center'
                    });

                    toast.present(toast);
                    return;
                }
                // let address = location.address;

                var newBounds = location.viewBounds;
                //this.mapService.changeBounds(newBounds);


                let lat = (newBounds._northEast.lat + newBounds._southWest.lat) / 2;
                let lng = (newBounds._northEast.lng + newBounds._southWest.lng) / 2;

                let destino = {
                    lat: lat,
                    lng: lng
                };

                let toast = this.toastCtrl.create({
                    message: "Ruta encontrada!",
                    duration: 2520,
                    position: 'center'
                });

                toast.present(toast);

                this.navCtrl.push(RutaPage,
                    {
                        ways: [actual, destino],
                        msgs: ["Partida: <strong>Tu ubicación</strong>", "Destino: <strong>" + this.atraccion.titulo + "</strong>"]
                    });


            }, error => {
                loader.dismissAll();
                let toast = this.toastCtrl.create({
                    message: "No se ha encontrado la dirección en el mapa.",
                    duration: 1500,
                    position: 'center'
                });

                toast.present(toast);
            });

        }).catch((error) => {
            loader.dismissAll();
            let toast = this.toastCtrl.create({
                message: "Error en la carga del mapa",
                duration: 1500,
                position: 'center'
            });

            toast.present(toast);
        });

    }


    dismiss() {
        this.viewCtrl.dismiss();
    }


}
