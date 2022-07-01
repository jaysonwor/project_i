import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from './services/api.service';
import { CognitoService } from './services/cognito.service';
import { Log } from './utils/log';
import { Toast } from './utils/toast';

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
    private cognitoService: CognitoService,
    private router: Router,
    private toast: Toast,
    public log: Log) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        console.log("will enter")
        this.log.reset();
      }
    });
  }

  logout() {
    this.cognitoService.logOut();
    this.toast.success("Logout successful");
    this.router.navigate(['login']);
  }

  get session(): Boolean {
    return new Boolean(JSON.parse(sessionStorage.getItem("SESSION.ACTIVE")));
  }

}
