import {Geolocation} from '@ionic-native/geolocation';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {
    ActionSheetController, LoadingController, NavController, NavParams, ToastController,
    ViewController
} from 'ionic-angular';
import {GeocodingService} from "../../directives/map/geocode.service";
import {MapService} from "../../directives/map/map.service";
import {RutaPage} from "../ruta/ruta";
import {Calendar} from '@ionic-native/calendar';


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
    @ViewChild('contenedorMapaAgenda') contenedorMapa: ElementRef;
    map: any;
    latlong: any;

    existeEvento = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl: ViewController,
                public mapservice: MapService,
                private geolocation: Geolocation,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public actionSheetCtrl: ActionSheetController,
                private calendar: Calendar,
                public geocoder: GeocodingService) {
        this.agenda = navParams.get('agenda');

        this.calendar.findEvent(this.agenda.titulo, this.latlong, this.agenda.resumen, new Date(this.agenda.fecha_evento_rango.desde), new Date(this.agenda.fecha_evento_rango.hasta))
            .then((ev) => {
                if (ev.length > 0){
                    this.existeEvento = true;
                }

            }).catch(() => {
            console.log("no existe el evento");

        });
    }

    ionViewDidEnter() {

        if (!this.agenda.direccion_mapa) {
            return false;
        }
        console.log('Hello AtraccionPage Page');
        let location = this.geocoder.geocode(this.agenda.direccion_mapa);

        location.subscribe(location => {
            console.log(location);
            if (!location.valid) {
                return;
            }

            let mapId = 'map-agenda-id';
            this.contenedorMapa.nativeElement.innerHTML = '<div style="height:150px;" id="' + mapId + '"></div>';

            this.map = this.mapservice.createMap(mapId, location.latitude, location.longitude);
            let latlng = new Array();
            latlng.push(location.latitude);
            latlng.push(location.longitude);
            this.latlong = latlng;
            this.mapservice.addMarker(latlng, "Acá está!");


        }, error => console.error(error));
    }

    crearEvento() {


        this.calendar.createEvent(this.agenda.titulo, this.latlong, this.agenda.resumen, new Date(this.agenda.fecha_evento_rango.desde), new Date(this.agenda.fechaEventoFin))
            .then((ev) => {
                let toast = this.toastCtrl.create({
                    message: "Evento creado",
                    duration: 2520,
                    position: 'center'
                });

                toast.present(toast);
                this.existeEvento = true;
            }).catch(() => {
            let toast = this.toastCtrl.create({
                message: "Error al crear el evento",
                duration: 2520,
                position: 'center'
            });

            toast.present(toast);
        });
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

    gMaps() {

        if (!this.agenda.direccion_mapa) {
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

            let location = this.geocoder.geocode(this.agenda.direccion_mapa);

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

        console.log("leaflet");

        if (!this.agenda.direccion_mapa) {
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

            let location = this.geocoder.geocode(this.agenda.direccion_mapa);

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
                        msgs: ["Partida: <strong>Tu ubicación</strong>", "Destino: <strong>" + this.agenda.titulo + "</strong>"]
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
