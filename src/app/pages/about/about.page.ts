import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ClientService } from 'src/app/providers/client.service';
import { HomeResultsPage } from '../home-results/home-results.page';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  public onRegisterForm: FormGroup;
  montant_initial_de_creation : number = 0;
  constructor(
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private navCtrl : NavController,
    public toastCtrl : ToastController,
    private serviceClient : ClientService) { }

  ngOnInit() {
    
    this.onRegisterForm = this.formBuilder.group({
      'nom': [null, Validators.compose([
        Validators.required
      ])],
      'prenom':[null, Validators.compose([
        Validators.required
      ])],
      'dateDeNaissance':[null, Validators],
      'telephone':[null, Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])],
      'email':[null, Validators],
      'numcni':[null, Validators.compose([Validators.required,Validators.minLength(6)])],
      'profession': [null,Validators],
      'nomDeLaMere':[null, Validators],
      'nomDuPere':[null, Validators],
      'residence':[null, Validators.required],
      'passport':[null],
      'cartedesejour':[null]
    });
  }
  async createAccount(){
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });
    this.serviceClient.save(this.onRegisterForm.value).subscribe((e:any)=>{
      console.log("SUCESS :", e);
      this.presentToast("Le client a été crée avec succès!");
      this.serviceClient.createAccount(e.id,  this.montant_initial_de_creation == null ? 0 :this.montant_initial_de_creation).subscribe(
        (e:any)=>{
          this.presentToast("Le compte également a été crée avec succès!");
        },err=>{
          this.presentToast("Le compte n'a pas été crée! vérifier le réseau svp.");
          //supprimer le client ici
        }
      );
    }, err=>{
      console.log("Erreur :", err)
      this.presentToast("Impossible! vérifier votre réseau svp.");
    })
    loader.onWillDismiss().then(() => {
      //this.navCtrl.navigateRoot('/home-results');
    });
  }
  async presentToast( le_message : string) {
    const toast = await this.toastCtrl.create({
      message: le_message,
      duration: 2000
    });
    toast.present();
    
  }
   

}
