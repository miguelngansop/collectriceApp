import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ClientService } from 'src/app/providers/client.service';


@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.page.html',
  styleUrls: ['./search-filter.page.scss'],
})
export class SearchFilterPage implements OnInit {
   // Data passed in by componentProps
   @Input() compte: any;
  public cpt : any;
  history : Array<any>= [];
  allData :any = [];
  filterData : any = [];
   searchbar = document.querySelector('ion-searchbar');
   items = Array.from(document.querySelector('ion-list').children);
   searchTerm: string = '';


  constructor(
    private modalCtrl: ModalController, 
    private clientService : ClientService,
    private navParams: NavParams,
    ) { 
      this.cpt = this.navParams.get('compte');
      console.log("cpt",this.cpt);
      this.clientService.getHistory(this.cpt.id).subscribe((e: any)=>{
        console.log(e.operations);
        this.history = e.operations;
      },err=>{
         console.log("Erreur ", err);
      })
    }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.allData = this.history;
    this.filterData = this.allData;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  setFilteredHistory(ev: any){
    this.filterData = this.allData.filter((hist) => {
      return hist.type.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });

  }

}
