import { AuthIntereceptor } from './services/auth.intereseptor';
import {BrowserModule} from '@angular/platform-browser'
import {NgModule, Provider} from '@angular/core'

import {AppComponent} from './app.component'
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'

const INTERECEPTOR_PROVIDER: Provider ={
  provide: HTTP_INTERCEPTORS,
  useClass: AuthIntereceptor,
  multi: true 
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [INTERECEPTOR_PROVIDER],
  bootstrap: [AppComponent]
})
export class AppModule {
}
