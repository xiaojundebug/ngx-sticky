import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'ngx-sticky-app'

  getNumbers(length) {
    const ret = []

    for (let i = 0; i < length; i++) {
      ret.push(i)
    }

    return ret
  }
}
