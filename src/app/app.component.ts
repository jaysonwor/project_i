import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CognitoService } from './services/cognito.service';
import { Log } from './utils/log';
// import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ToastUtil } from './utils/toast';
import { AppConstants } from 'src/app/app.constants';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  showLogo: boolean = true;
  imgPreview: any = "/assets/dummy-profile.png";

  navigate: any =
    [
      {
        title: 'Home',
        url: '/home',
        icon: 'home'
      },
      {
        title: 'Profile',
        url: '/profile',
        icon: 'person'
      },
      {
        title: 'Security Settings',
        url: '/security-settings',
        icon: 'key'
      },
      {
        title: 'About Us',
        url: '/about',
        icon: 'information'
      },
      // {
      //   title: 'Settings',
      //   url: '/settings',
      //   icon: 'settings'
      // }
    ];

  constructor(
    public cognitoService: CognitoService,
    private router: Router,
    // private screenOrientation: ScreenOrientation,
    // private toast: ToastUtil,
    public log: Log,
    private cdr: ChangeDetectorRef,
    public appConstants: AppConstants) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.log.reset();
      }
    });

    // this.orient();
  }

  // orient() {
  //   this.screenOrientation.onChange().subscribe(
  //     () => {
  //       if (
  //         this.screenOrientation.type == this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY ||
  //         this.screenOrientation.type == this.screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY) {
  //         this.showLogo = false;
  //       } else {
  //         this.showLogo = true;
  //       }
  //       this.cdr.detectChanges();
  //     }
  //   );
  // }


  get session(): Boolean {
    return new Boolean(JSON.parse(sessionStorage.getItem(this.appConstants.SESSION_ACTIVE)));
  }

}
