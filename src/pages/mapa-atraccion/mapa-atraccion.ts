import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoadingController, NavController, NavParams, Select} from 'ionic-angular';
import {MapService} from '../../directives/map/map.service';
import {GeocodingService} from "../../directives/map/geocode.service";
import {MainService} from "../../app/main.service";
import {BrowserDomAdapter} from "@angular/platform-browser/src/browser/browser_adapter";
import {Geolocation} from 'ionic-native';
import {AtraccionPage} from "../atraccion/atraccion";
var utils = require('util');

/*
 Generated class for the MapaAtraccion page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-mapa-atraccion',
    templateUrl: 'mapa-atraccion.html'
})
export class MapaAtraccionPage {

    @ViewChild('contenedorMapaAtracciones') contenedorMapa: ElementRef;
    @ViewChild('searchKm') searchKm: Select;

    domAdapter: BrowserDomAdapter = new BrowserDomAdapter();
    atracciones = [];
    kms = {
        km: 5,
        zoom: 13,
    };
    map: any;

    distancias = [
        {
            km: 5,
            zoom: 13,
            descripcion: 'Menos de 5 kms.',
        },
        {
            km: 10,
            zoom: 11,
            descripcion: 'Menos de 10 kms.',
        },
        {
            km: 50,
            zoom: 9,
            descripcion: 'Menos de 50 kms.',
        },
        {
            km: 100,
            zoom: 8,
            descripcion: 'Menos de 100 kms.',
        },
        {
            km: 300,
            zoom: 7,
            descripcion: 'Menos de 300 kms.',
        },
        {
            km: -1,
            zoom: 6,
            descripcion: 'Más de kms.',
        }

    ]

    constructor(public params: NavParams,
                public navCtrl: NavController,
                public loadCtrl: LoadingController,
                public mapService: MapService,
                public elementRef: ElementRef,
                public geocoder: GeocodingService) {
        this.atracciones = this.params.get('atracciones');
    }


    ionViewDidEnter() {

        console.log('MapaEmpresaComponent');

        this.rangeChange();
    }

    opensearchKm() {
        this.searchKm.open();
    }

    rangeChange() {

        var loader = this.loadCtrl.create({
            content: "Espere, por favor"
        });

        loader.present();

        Geolocation.getCurrentPosition().then((resp) => {

            console.log(resp);

            this.createMakers(resp.coords.latitude, resp.coords.longitude, loader);

            this.mapService.setPosition(resp.coords.latitude, resp.coords.longitude);
            this.mapService.setBound(resp.coords.latitude - 0.02, resp.coords.longitude - 0.02, resp.coords.latitude + 0.02, resp.coords.longitude + 0.02);
        }).catch((error) => {
            console.log('Error getting location', error);
            console.log(error);


        });
    }

    createMakers(latD, lonD, loader) {

        let mapId = 'mapa-atracciones-id';
        let zoom = this.kms.zoom;

        // if (!utils.isUndefined(this.map)) {
        //     zoom = this.map.getZoom();
        //
        // }

        this.contenedorMapa.nativeElement.innerHTML = '<div class="angular-leaflet-map" id="' + mapId + '"></div>';

        this.map = this.mapService.createMap(mapId, latD, lonD);

        this.map.setZoom(zoom);

        console.log(this.kms);
        this.mapService.createCircle(latD, lonD, this.kms.km);

        for (let e of this.atracciones) {

            if (this.atracciones[this.atracciones.length - 1] == e) {
                loader.dismissAll();
            }

            if (e.direccion_mapa) {


                let location = this.geocoder.geocode(e.direccion_mapa);

                location.subscribe(location => {
                    console.log(location);
                    if (!location.valid) {

                        return;
                    }
                    // let address = location.address;

                    var newBounds = location.viewBounds;
                    //this.mapService.changeBounds(newBounds);


                    let latlng = new Array();
                    let lat = (newBounds._northEast.lat + newBounds._southWest.lat) / 2;
                    let lng = (newBounds._northEast.lng + newBounds._southWest.lng) / 2;
                    latlng.push(lat);
                    latlng.push(lng);

                    let kms = this.mapService.getDistanceFromLatLonInKm(latD, lonD, lat, lng);

                    if (this.kms.km > 0 && kms > this.kms.km) {
                        return;
                    }


                    let newDiv: HTMLDivElement;
                    newDiv = document.createElement("div");
                    let newContent = document.createTextNode(e.titulo.toUpperCase());


                    let img: HTMLImageElement;
                    img = document.createElement('img');
                    newDiv.style.color = e.color;
                    newDiv.appendChild(newContent);
                    newDiv.appendChild(img);

                    console.log(e.image_name)
                    // img.src = e.image_name ? e.image_name : 'assets/img/icono_empresa.png';
                    //img.src = "http://www.goleamos.com/post/boca.png";
                    this.domAdapter.on(newDiv, 'click', this.open.bind(this, e));
                    this.domAdapter.appendChild(this.elementRef.nativeElement, newDiv);

                    this.mapService.addMarker(latlng, newDiv);

                    //this.mapService.addText(e.nombre);
                }, error => {
                    console.error(error);
                });
            }

        }
    }

    open(atraccion) {
        this.navCtrl.push(AtraccionPage, {
            atraccion: atraccion,
            icono: 'pizza'
        });
    }

}
