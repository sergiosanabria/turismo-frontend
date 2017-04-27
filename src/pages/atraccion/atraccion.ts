import {Component, ElementRef, ViewChild} from '@angular/core';
import {
    ActionSheetController, LoadingController, NavController, NavParams, Select, ToastController,
    ViewController
} from 'ionic-angular';
import {GeocodingService} from "../../directives/map/geocode.service";
import {MapService} from "../../directives/map/map.service";
import {Geolocation} from '@ionic-native/geolocation';
import {RutaPage} from "../ruta/ruta";


@Component({
    selector: 'page-atraccion',
    templateUrl: 'atraccion.html'
})
export class AtraccionPage {

    @ViewChild('contenedorMapaAtraccion') contenedorMapa: ElementRef;
    atraccion: any;
    map: any;

    constructor(public navCtrl: NavController,
                params: NavParams,
                public viewCtrl: ViewController,
                public mapservice: MapService,
                private geolocation: Geolocation,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public actionSheetCtrl: ActionSheetController,
                public geocoder: GeocodingService) {
        this.atraccion = params.get('atraccion');

    }


    ngOnInit() {
        console.log('Hello AtraccionPage Page');
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

        console.log("leaflet");

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
