import { Component, OnInit } from '@angular/core';
import {  NavController, LoadingController, ToastController} from '@ionic/angular';
import { ClientService } from 'src/app/providers/client.service';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { FilePath } from '@ionic-native/file-path/ngx';

@Component({
  selector: 'app-identifyphoto',
  templateUrl: './identifyphoto.page.html',
  styleUrls: ['./identifyphoto.page.scss'],
})
export class IdentifyphotoPage implements OnInit {
  base64img: string = '';
  error :any = null;
  loading : any = null

  constructor(public loadingCtrl: LoadingController,
    private toastController: ToastController,
    public imgpov: ClientService, 
    public nav: NavController,
    public file : File,

   )
     {
    this.base64img = this.imgpov.getImage();
  }

  ngOnInit() {
    this.base64img = this.imgpov.getImage();

  }


  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 9000
    });
    toast.present();
  }

   async uploadPhoto() {
    this.error = null;
    this.loading = await this.loadingCtrl.create({
      message: 'Uploading...'
  });

    this.loading.present();
    this.loading.dismiss();
    this.presentToast("en cours ...");

 
      this.imgpov.upload({'file':this.imgpov.getPhoto()}).subscribe(ok=>{
        this.presentToast("Successs");
        this.loading.dismiss();
      },err=>{
        this.presentToast("Echec lors de la soumission");
        alert(JSON.stringify(err))
        this.loading.dismiss();
      })
    };



    /*  this.file.resolveLocalFilesystemUrl(this.imgpov.getPhoto().filePath)
        .then(entry => {
            ( < FileEntry > entry).file(file => this.readFile(file))
        })
        .catch(err => {
            this.presentToast('Error while reading file.');
        });
        
        */
  }
 







