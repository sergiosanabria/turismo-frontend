import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Transfer, Network} from "ionic-native";
import {Platform, AlertController} from "ionic-angular";
import {File} from '@ionic-native/file';
import {NativeStorage} from '@ionic-native/native-storage';

/*
 Generated class for the Sync provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
declare var cordova: any;
@Injectable()
export class Sync {

    storageDirectory: string = 'nodir';
    file = new File();
    store = new NativeStorage();


    constructor(public http: Http,
                public platform: Platform,
                public alertCtrl: AlertController) {
        console.log('Hello Sync Provider');
        this.platform.ready().then(() => {
            // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
            if (!this.platform.is('cordova')) {
                return false;
            }

            if (this.platform.is('ios')) {
                this.storageDirectory = cordova.file.documentsDirectory;
            }
            else if (this.platform.is('android')) {
                this.storageDirectory = cordova.file.externalDataDirectory;
            }
            else {
                // exit otherwise, but you could add further types here e.g. Windows
                return false;
            }

            console.log(this.storageDirectory);
        });
    }

    updateApp(array) {

        for (let data of array) {

            if (data.archivos.fotos.length) {
                for (let foto of data.archivos.fotos) {
                    this.updateFiles(foto.ruta, foto.id, '.jpg');
                }
            }

            if (data.archivos.audios.length) {
                for (let foto of data.archivos.audios) {
                    this.updateFiles(foto.ruta, foto.id, '.mp4');
                }
            }

        }
        return this.storeJson(array, 'atracciones');

    }

    getJson(key) {
        return this.store.getItem(key);
    }

    storeJson(data, key) {
        return this.store.setItem(key, data);
    }

    removeJson(key) {
        this.store.remove(key);
    }

    updateFiles(url, fileName, ext) {
        this.file.checkFile(this.storageDirectory, fileName + ext).then((exists) => {

            console.log(exists);
            if (!exists) {
                this.download(url, fileName, ext);
            }
        }).catch((err) => {
            this.download(url, fileName, ext);
        });
    }


    downloadImage(image) {

        this.platform.ready().then(() => {

            const fileTransfer = new Transfer();
            const imageLocation = `${cordova.file.applicationDirectory}www/assets/img/${image}`;

            fileTransfer.download(imageLocation, this.storageDirectory + image).then((entry) => {

                const alertSuccess = this.alertCtrl.create({
                    title: `Download Succeeded!`,
                    subTitle: `${image} was successfully downloaded to: ${entry.toURL()}`,
                    buttons: ['Ok']
                });

                alertSuccess.present();

            }, (error) => {

                const alertFailure = this.alertCtrl.create({
                    title: `Download Failed!`,
                    subTitle: `${image} was not successfully downloaded. Error code: ${error.code}`,
                    buttons: ['Ok']
                });

                alertFailure.present();

            });

        });

    }

    getLocalDir(name, ext) {

        return this.file.readAsDataURL(this.storageDirectory, name.toString() + ext);

    }


    download(url, name, ext) {

        this.platform.ready().then(() => {

            const fileTransfer = new Transfer();
            // const imageLocation = `${cordova.file.applicationDirectory}www/assets/img/${image}`;


            console.log(this.storageDirectory);
            fileTransfer.download(url, this.storageDirectory + name + ext).then((entry) => {

                const alertSuccess = this.alertCtrl.create({
                    title: `Download Succeeded!`,
                    subTitle: `${url} was successfully downloaded to: ${entry.toURL()}`,
                    buttons: ['Ok']
                });

                alertSuccess.present();

            }, (error) => {

                console.log(JSON.stringify(error));
                const alertFailure = this.alertCtrl.create({
                    title: `Download Failed!`,
                    subTitle: `${url} was not successfully downloaded. Error code: ${error.code}`,
                    buttons: ['Ok']
                });

                alertFailure.present();

            });

        });

    }

}