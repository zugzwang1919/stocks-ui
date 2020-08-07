import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { YesNoPipe } from './yes-no.pipe';




@NgModule({
  declarations: [ YesNoPipe ],
  exports: [
    YesNoPipe
  ],
  imports: [
    HttpClientModule
  ]
})
export class WolfeCommonModule { }
