import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage: Storage,
    public navctrl: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.storage.get('storage_session').then((res) => {
      if (res == null) {
        this.navctrl.navigateRoot('/login');
      } else {
        this.navctrl.navigateRoot('/home');
      }
    })
  }
}
