import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';


import { IonicModule } from '@ionic/angular';

import { IdentifyphotoPage } from './identifyphoto.page';
import { from } from 'rxjs';

const routes: Routes = [
  {
    path: '',
    component: IdentifyphotoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  providers:[
    FileTransfer,
    WebView,
    FilePath,
    File,],
  declarations: [IdentifyphotoPage]
})
export class IdentifyphotoPageModule {}
