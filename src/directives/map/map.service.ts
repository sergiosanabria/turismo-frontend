import {Injectable} from '@angular/core';
//import {Map, TileLayer} from 'leaflet';

let L = require('leaflet');

import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class MapService {
    public map;
    public baseMaps: any;

    //Observable bounds source
    private _geosearchBoundsSource = new ReplaySubject<any>();
    geosearchBounds$ = this._geosearchBoundsSource.asObservable();

    constructor() {
        this.baseMaps = {
            MapBox: new L.TileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2VyZ2lvc2FuYWJyaWEiLCJhIjoiY2oyMXVrOGZvMDAwMjMycGNrODltb2J3ciJ9.VMWOMgix8djMTesRJMDHVg")
        };
    }

    // load a web map and return response
    createMap(domId: any, lat?, lng?) {
        this.remove();

        lat = "undefined" === typeof lat ? -25.59751 : lat;
        lng = "undefined" === typeof lng ? -54.57 : lng;
        this.map = new L.Map(domId, {
            zoomControl: false,
            fullscreenControl: true,
            center: new L.LatLng(lat, lng),
            zoom: 14,
            minZoom: 4,
            maxZoom: 18,
            layers: [this.baseMaps.MapBox]
        });
        L.control.zoom({position: 'topright'}).addTo(this.map);
        // L.control.layers(this.baseMaps).addTo(this.map);
        return this.map;
    };

    // getURLParameter(name) {
    //     return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    // }

    // service command
    changeBounds(newBounds: any) {
        this._geosearchBoundsSource.next(newBounds);
    }

    addMarker(newBounds: any, text) {

        let maker = L.marker(newBounds).addTo(this.map);

        console.log(maker);

        if (text) {
            maker.bindPopup(text);
        }
    }

    setPosition(lat, lng) {
        var newLatLng = new L.LatLng(lat, lng);

        this.map.panTo(newLatLng);

    }

    setBound(sLat, sLng, nLat, nLng) {
        var southWest = L.latLng(sLat, sLng),
            northEast = L.latLng(nLat, nLng),
            bounds = L.latLngBounds(southWest, northEast);

        this.changeBounds(bounds);

    }

    createWayPoints(wayPoints) {

        let r: any[] = new Array();
        for (let p of wayPoints) {
            r.push(L.latLng(p.lat, p.lng));
        }

        return r;

    }

    createCircle(lat, lng, km) {
        L.circle([lat, lng], km * 1000).addTo(this.map);
    }

    createRoute(waypoints, message) {
        // L.Routing.control({
        //     waypoints: [
        //         L.latLng(-27.360626, -55.888359),
        //         L.latLng(-27.385646, -55.892561)
        //     ],
        // }).addTo(this.map);

        // let message = ["Custom <strong>mesage1</strong>","Custom <strong>message2</strong>","Custom <strong>mesasge3</strong>"];

        // let waypoints = [
        //     L.latLng(-27.360626, -55.888359),
        //     L.latLng(-27.385658, -55.892561)
        // ];

        L.Routing.control({
            plan: L.Routing.plan(waypoints, {
                createMarker: function (i, wp) {
                    if (waypoints[0]) {
                        return L.marker(wp.latLng, {
                            draggable: false
                        }).bindPopup(message[i]).openPopup();

                    }

                },
                routeWhileDragging: false
            })
        }).addTo(this.map);

    }

    remove() {
        if (this.map != undefined || this.map != null) {
            this.map.remove();
        }

    }

    disableMouseEvent(tag: string) {
        var html = L.DomUtil.get(tag);

        L.DomEvent.disableClickPropagation(html);
        L.DomEvent.on(html, 'mousewheel', L.DomEvent.stopPropagation);

    };

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km

        console.log(d);
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
}