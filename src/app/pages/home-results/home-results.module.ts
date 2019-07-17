import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import {Camera} from '@ionic-native/camera/ngx';
import {File} from '@ionic-native/file/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';



import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { HomeResultsPage } from './home-results.page';
import { SortPipe } from 'src/app/sort.pipe';
import { SearchPipe } from 'src/app/search.pipe';
import { from } from 'rxjs';


const routes: Routes = [
  {
    path: '',
    component: HomeResultsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers:[ Camera,
    ]
  ,
  declarations: [HomeResultsPage, PopmenuComponent, SortPipe, SearchPipe ]
})
export class HomeResultsPageModule {}
