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

  myPhoto:any ;

  constructor(public loadingCtrl: LoadingController,
    private toastController: ToastController,
    public imgpov: ClientService, 
    public nav: NavController,
    public file : File,

   )
     {
    this.myPhoto = this.imgpov.getImage();
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

 
      // this.imgpov.upload({'file':this.imgpov.getPhoto()}).subscribe(ok=>{
      //   this.presentToast("Successs");
      //   this.loading.dismiss();
      // },err=>{
      //   this.presentToast("Echec lors de la soumission");
      //   alert(JSON.stringify(err))
      //   this.loading.dismiss();
      // })

      window['resolveLocalFileSystemURL'](this.imgpov.getPhoto(),
        entry => {
          entry['file'](file => this.readFile(file));
        });
 };



    /*  this.file.resolveLocalFilesystemUrl(this.imgpov.getPhoto().filePath)
        .then(entry => {
            ( < FileEntry > entry).file(file => this.readFile(file))
        })
        .catch(err => {
            this.presentToast('Error while reading file.');
        });
        
        */

       private readFile(file: any) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const formData = new FormData();
          const imgBlob = new Blob([reader.result], {type: file.type});
          formData.append('file', imgBlob, file.name);
          this.imgpov.upload(formData).subscribe((rep)=>{
            console.log('Reponse',rep);
            this.presentToast("Successs");
            this.loading.dismiss();
          },(err)=>{
            console.log('Error',err);
            this.presentToast("Echec lors de la soumission");
            alert(JSON.stringify(err))
            this.loading.dismiss();
          });
        };
        reader.readAsArrayBuffer(file);
      }

  }
 







