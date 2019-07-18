import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController,Platform  } from '@ionic/angular';

// Modals
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from './../modal/image/image.page';
// Call notifications test by Popover and Custom Component.
import { NotificationsComponent } from './../../components/notifications/notifications.component';
import { ClientService } from 'src/app/providers/client.service';

import {Camera,CameraOptions} from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-home-results',
  templateUrl: './home-results.page.html',
  styleUrls: ['./home-results.page.scss']
})
export class HomeResultsPage implements OnInit {
  listeClients : Array<any>;
  searchKey : string= '';
  listeClientsFilter : any = []; 
  allClient : any = [];
  themeCover = 'assets/img/ionic4-Start-Theme-cover.jpg';

  base64img:string='';

  descending: boolean = false;
  order: number;
  column: string = 'id';

  myPhoto : any;

  ngOnInit(){
    this.serviceClient.getAll().subscribe((list:any)=>{
      this.listeClients = list;
      this.listeClientsFilter = list;
    })
  }
  
  constructor(
    public navCtrl: NavController,
    public nav: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public serviceClient : ClientService,
    public platform: Platform,
    public camera:Camera,
  ) {

  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }
  operation(){
    console.log("Oui ")
  }
  ionViewDidEnter(){
    this.allClient = this.listeClients;
    this.listeClientsFilter = this.allClient;
  }

  settings() {
    this.navCtrl.navigateForward('settings');
  }

sort(){
  this.descending = !this.descending;
  this.order = this.descending ? 1 : -1;
}
  async retrait(lecompte) {
    const changeLocation = await this.alertCtrl.create({
      header: 'Retrait ...',
      message: 'Saisir le Montant du retrait.',
      inputs: [
        {
          name: 'montant',
          placeholder: 'Entrer le montant',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Retirer',
          handler: async (data) => {
            let message = " Echec ! ";
            // faisons dabord un prelevement
            if(data.montant<=0){
              message = " Montant invalide !";
            }
            if(lecompte.solde < data.montant){
              message = " Votre solde est insuffisant .";
            }
            if (data.montant > 0 && lecompte.solde >= data.montant ) {
            this.serviceClient.prelevement(lecompte.id).subscribe((e:any)=>{
              console.log(" Prelevement effectue", e);
              // Nous pouvons initier le retrait
              
                this.serviceClient.retrait(lecompte.id, data.montant).subscribe((e:any)=>{
                  message = " Retrait effectué avec succès! votre solde est de : "+ e.solde;
                  this.toastF(message);
                  this.ngOnInit();
                }, err=>{
                  message = " Echec, vérifier le réseau svp.";
                  this.toastF(message);
                  console.log(err);
                })
            }
            , err=>{
              console.log("Impossible de faire le prelevement de aucun retrait n'est possible.");
            })
          }else{
            this.toastF(message);
          }
          }
        }
      ]
    });
    changeLocation.present();
  }

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: SearchFilterPage
    });
    return await modal.present();
  }

  newClient(){
    this.navCtrl.navigateRoot("/about");
  }

 async seeHistory(compte){

  const modal = await this.modalCtrl.create({
    component: SearchFilterPage,
    componentProps: {
      'compte': compte,      
    }
  });
  return await modal.present();

  }

  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }

  async notifications(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

  async collecter(lecompte) {
    const changeLocation = await this.alertCtrl.create({
      header: 'Collecte',
      message: 'Saisir le Montant collecté.',
      inputs: [
        {
          name: 'montant',
          placeholder: 'Entrer le montant',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Cancel clicked',);
          }
        },
        {
          text: 'Encaisser',
          handler: async (data) => {
            console.log('Change clicked', data);

            if(data.montant > 0){

              let message : string;
                this.serviceClient.recharge(lecompte.id, data.montant).subscribe((e:any)=>{
                  message = "Recharge éffectuée, votre solde est de :" + e.solde + " FCFA";
                  this.toastF(message);
                  this.ngOnInit();
                },err=>{
                  console.log(err);
                  message = "Echec! l'opération a échouée:";
                  this.toastF(message);
                }
                );
          }else{
            this.toastF("Montant invalide!");
          }
        }
        }
      ]
    });
    changeLocation.present();
  }

  async toastF(message){
    const toast = await  this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      closeButtonText: 'OK',
      showCloseButton: true
    });
    toast.present();
  }

  fiterClientName(){
    /*
    this.listeClientsFilter = this.allClient.filter((compte)=>{
     return compte.client.nom.toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1;
      
    })
    */
  }

  imageCaptured(){
    const options:CameraOptions={
      quality:90,
      destinationType:this.camera.DestinationType.FILE_URI,
      encodingType:this.camera.EncodingType.JPEG,
      mediaType:this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((ImageData=>{
      //  this.base64img="data:image/jpeg;base64,"+ImageData;
       this.myPhoto = this.convertFileSrc(ImageData);
       this.serviceClient.setphoto(ImageData);

    }),error=>{
      console.log(error);
    })
  }

  imageCapturedGallery(){
    const options:CameraOptions={
      quality:70,
      destinationType:this.camera.DestinationType.DATA_URL,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }
    this.camera.getPicture(options).then((ImageData=>{
       this.base64img="data:image/jpeg;base64,"+ImageData;
       this.serviceClient.setphoto(this.base64img);
    }),error=>{
      console.log(error);
    })
  }

  nextPage(){
   this.serviceClient.setImage(this.myPhoto);
  //  this.serviceClient.setphoto(ImageData);
   this.nav.navigateRoot('/identifyphoto');
  }

  clear(){
    this.base64img='';
  }

  private convertFileSrc(url: string): string {
    if (!url) {
      return url;
    }
    if (url.startsWith('/')) {
      return window['WEBVIEW_SERVER_URL'] + '/_app_file_' + url;
    }
    if (url.startsWith('file://')) {
      return window['WEBVIEW_SERVER_URL'] + url.replace('file://', '/_app_file_');
    }
    if (url.startsWith('content://')) {
      return window['WEBVIEW_SERVER_URL'] + url.replace('content:/', '/_app_content_');
    }
    return url;
  }

  
}
