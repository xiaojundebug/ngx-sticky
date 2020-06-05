import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StickyComponent } from './sticky.component'

@NgModule({
  declarations: [StickyComponent],
  imports: [CommonModule],
  exports: [StickyComponent]
})
export class StickyModule {}
