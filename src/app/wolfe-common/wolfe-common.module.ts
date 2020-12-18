import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { YesNoPipe } from './yes-no.pipe';
import { ActivityPipe } from './activity.pipe';




@NgModule({
  declarations: [
    ActivityPipe,
    YesNoPipe,
  ],
  exports: [
    ActivityPipe,
    YesNoPipe,
  ],
  imports: [
    HttpClientModule
  ]
})
export class WolfeCommonModule { }
