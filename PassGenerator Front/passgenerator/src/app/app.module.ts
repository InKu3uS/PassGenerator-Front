import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { PasswordsComponent } from './components/passwords/passwords.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { GeneratePasswordComponent } from './components/generate-password/generate-password.component';
import { SavePasswordComponent } from './components/save-password/save-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FaqComponent } from './components/faq/faq.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateComparerPipe } from './pipes/date-comparer.pipe';
import { RegisterComponent } from './components/register/register.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    PasswordsComponent,
    LoginComponent,
    GeneratePasswordComponent,
    SavePasswordComponent,
    FaqComponent,
    DateComparerPipe,
    RegisterComponent,
    MyProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  exports: [
    HeaderComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
