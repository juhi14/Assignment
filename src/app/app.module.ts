import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { OperationServiceService } from './operation-service.service';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    AppComponent,
    PatientDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgSelectModule
  ],
  providers: [OperationServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
