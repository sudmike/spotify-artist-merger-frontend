import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

/* Import Components */
import { AppComponent } from './app.component';
import { CreatePlaylistComponent } from './create-playlist/create-playlist.component';
import { ArtistInputComponent } from './create-playlist/artist-input/artist-input.component';
import { ArtistOutputComponent } from './create-playlist/artist-output/artist-output.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CallbackComponent } from './login/callback/callback.component';

/* Define Routes */
const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // temporary redirect
  { path: 'create-playlist', component: CreatePlaylistComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/callback', component: CallbackComponent},
  { path: 'page-not-found', component: PageNotFoundComponent},
  { path: '**', redirectTo: 'page-not-found', pathMatch: 'full' }
];

@NgModule({
  declarations: [ /* Register Components */
    AppComponent,
    CreatePlaylistComponent,
    ArtistInputComponent,
    ArtistOutputComponent,
    LoginComponent,
    PageNotFoundComponent,
    LandingPageComponent,
    CallbackComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  exports: [
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
