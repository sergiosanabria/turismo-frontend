import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
import {LugarPage} from "../lugar/lugar";

/*
  Generated class for the Scan page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    //this.scan ();
  }

  ionViewDidLoad() {
    //console.log('Hello ScanPage Page');
    //this.scan ();

  }

  scan (){
    BarcodeScanner.scan().then((barcodeData) => {


      alert(JSON.stringify(barcodeData));

      //window.open(barcodeData.text, '_system');

      // this.lugarService.getLugar(barcodeData.text).subscribe((lugar)=>{
      //   this.presentLugarModal(lugar);
      // });


    }, (err) => {
      // An error occurred
    });
  }

  presentLugarModal(lugar) {
    let profileModal = this.modalCtrl.create(LugarPage, { lugar: lugar });
    profileModal.present();
  }

}
