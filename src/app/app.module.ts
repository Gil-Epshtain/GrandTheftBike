// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { HttpClientModule } from '@angular/common/http';

// Material
import { MatCardModule }from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// App
import { AppRoutingModule } from './app-routing.module';

import { DateTimePipe } from './pipes/date-time/date-time.pipe';
import { AppComponent } from './components/root/app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { IncidentsListComponent } from './components/incidents-list/incidents-list.component';
import { IncidentDetailsComponent } from './components/incident-details/incident-details.component';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [
    DateTimePipe,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    IncidentsListComponent,
    IncidentDetailsComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatProgressSpinnerModule,

    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }