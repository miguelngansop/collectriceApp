import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  
  private host:string="http://192.168.1.94:8080/";
  private urlForSaveClient = this.host + "apiclient/client";
  private urlGetAll = this.host + "apiCompteCollecte/comptes";
  private urlForUpdate = this.host + "apiclient/client/";
  private urlForCreateAccount = this.host + "apiCompteCollecte/compteCollecte/";
  private urlRecharge = this.host + "apicompte/compte/";
  private urlRetrait = this.host + "apiCompteCollecte/compte/retrait/";
  private urlHistory = this.host + "apicompte/compte/";
  private urlForPrelevement = this.host + "apiCompteCollecte/compte/commission/";
  private urlForUpload = this.host + "uploadFile";

  base64img:string='';
  photo : any;



  constructor(private http:HttpClient) { }

  save( client ){
    console.log("service :", client);
   return this.http.post(this.urlForSaveClient, client);
  }

  createAccount(clientId, montant:number){
    return this.http.post(this.urlForCreateAccount+clientId, montant );
  }

  getAll(){
    return this.http.get(this.urlGetAll);
   }
  
   update(id, client){
     return this.http.put(this.urlForUpdate+id, client );
   }

   recharge(compteId, montant:string){
    return this.http.patch(this.urlRecharge+compteId, {"montant":montant,  "type": "versement"});
   }

   retrait(compteId, montant:string){
    return this.http.patch(this.urlRetrait+compteId, {"montant":montant,  "type": "retrait"});
   }

   getHistory(compteId){
    return this.http.get(this.urlHistory+compteId);
   }

   prelevement(compteId){
     return this.http.patch(this.urlForPrelevement + compteId, null);
   }

   setImage(img){
    this.base64img=img;
  }
  getImage(){
    return this.base64img;
  }

  
  setphoto(img){
    this.photo=img;
  }
  getPhoto(){
    return this.photo;
  }

  upload(form){
    let httpOptions = {
      headers: new HttpHeaders({
          'enctype': 'multipart/form-data; boundary=----WebKitFormBoundaryuL67FWkv1CA'
      })
  };
    return this.http.post(this.urlForUpload, form ,httpOptions);
  }
}
