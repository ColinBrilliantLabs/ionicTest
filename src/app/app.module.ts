import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import {SidebarComponent} from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';

// for AngularFireDatabase
import { AngularFireDatabaseModule } from 'angularfire2/database';
// for AngularFireAuth
import { AngularFireAuthModule } from 'angularfire2/auth';

@NgModule({
  declarations: [AppComponent, SidebarComponent],
  entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,FormsModule, AngularFireAuthModule, AngularFireDatabaseModule,
    ],
  providers: [
    StatusBar,
    SplashScreen,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
