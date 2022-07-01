import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from './services/api.service';
import { CognitoService } from './services/cognito.service';
import { Log } from './utils/log';
import { ToastUtil } from './utils/toast';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
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
    private toast: ToastUtil,
    public log: Log) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.log.reset();
      }
    });
  }

  get session(): Boolean {
    return new Boolean(JSON.parse(sessionStorage.getItem("SESSION.ACTIVE")));
  }

}
