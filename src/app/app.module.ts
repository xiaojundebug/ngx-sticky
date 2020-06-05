import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StickyModule } from '@ciri/ngx-sticky';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StickyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
