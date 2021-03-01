import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';

import { AccessProviders } from '../../providers/access-providers';
import { HAMMER_LOADER } from '@angular/platform-browser';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  email: string="";
  password: string="";
  confirmpassword: string="";

  disabledbutton;

  constructor(
    private router: Router,
    private toastctrl: ToastController,
    private alertctrl: AlertController,
    private loadingctrl: LoadingController,
    private accessproviders: AccessProviders
  ) { }
  

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.disabledbutton = false;
  }

  async tryRegistration(){
    if (this.email == ''){
      this.presentToast('Provide Email');
    } else if (this.password == '') {
      this.presentToast('Enter Password');
    } else if (this.password != this.confirmpassword){
      this.presentToast('Please confirm password')
    } else {
      this.disabledbutton = true;
      const loading = await this.loadingctrl.create({
        message: 'Wait'
      });

      await loading.present();

      return new Promise(resolve => {
        let body = {
          action: 'registration_progress',
          email: this.email,
          password: this.password
        }
        this.accessproviders.postData(body, 'api.php').subscribe((res: any) => {
          if (res.success == true) {
            loading.dismiss();
            this.disabledbutton = false;
            this.presentToast(res.msg);
            this.router.navigate(['/login']);
          } else {
            loading.dismiss();
            this.disabledbutton = false;
            this.presentToast(res.msg);
          }
        }, (err) => {
          loading.dismiss();
          this.disabledbutton = false;
          this.presentAlertConfirm('Timeout'); 
        });
      })
    }
  }

  async presentToast(a) {
    const toast = await this.toastctrl.create({
      message: a,
      duration: 1500
    })
    toast.present();
  }

  async presentAlertConfirm(a){
    const alert = await this.alertctrl.create({
      header: a,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel'
        }, {
          text: 'Try Again'
        }
      ]
    });
    await alert.present();
  }

}
