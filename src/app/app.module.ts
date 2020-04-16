import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule, MatDrawerContainer,} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { TeacherModule } from './teacher/teacher.module';
import {AngularFireModule, FirebaseAppConfig} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { DatabaseService } from './database.service';
import { TeacherService } from './teacher.service';
import { PercentagePipe } from './percentage.pipe';

const firebaseConfig:FirebaseAppConfig = {
  apiKey: "AIzaSyCOI_ADergL8vTGejoQ7FSSRFs0-5OaaLo",
  authDomain: "college-erp-668a1.firebaseapp.com",
  databaseURL: "https://college-erp-668a1.firebaseio.com",
  projectId: "college-erp-668a1",
  storageBucket: "college-erp-668a1.appspot.com",
  messagingSenderId: "213936368738",
  appId: "1:213936368738:web:5d5aa5f2c7ebe273cb353b",
  measurementId: "G-Y6856SNJCK"
};

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    LayoutModule,
    TeacherModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [DatabaseService,TeacherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
