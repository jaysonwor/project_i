import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CognitoService } from './services/cognito.service';
import { Capacitor } from '@capacitor/core';
import { Log } from './utils/log';
// import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AppConstants } from 'src/app/app.constants';
import { PhotoUtils } from './utils/photo';
import { ApiService } from './services/api.service';
import { EventService } from './services/event.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  showLogo: boolean = true;
  imgPreview: any = sessionStorage.getItem("PROJECTI.PROFILE_PIC");

  navigate: any =
    [
      {
        title: 'Home',
        url: '/home',
        icon: 'home'
      },
      {
        title: 'Studio',
        url: '/studio',
        icon: 'studio'
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
    public photo: PhotoUtils,
    public log: Log,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private event: EventService,
    public appConstants: AppConstants
    ) { }

  subscription: any;

  async ngOnInit() {    

    //resets the log after each navi action
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.log.reset();
      }
    });

    //infers the pic was saved in the session storage 
    this.subscription = this.event.formRefreshSource$.subscribe(data => {
      this.imgPreview = sessionStorage.getItem("PROJECTI.PROFILE_PIC");
    });

    //on devices make sure directory exists
    if (Capacitor.isNativePlatform()) {
      await this.photo.createDirectory();
    } 
  }

  get session(): Boolean {
    return new Boolean(JSON.parse(sessionStorage.getItem(this.appConstants.SESSION_ACTIVE)));
  }

}
