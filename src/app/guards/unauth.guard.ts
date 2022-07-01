import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CognitoService } from '../services/cognito.service';
import { Log } from '../utils/log';

@Injectable({
  providedIn: 'root'
})
export class UnauthGuard implements CanActivate {
  constructor(
    private cognitoService: CognitoService, 
    private router: Router,
    private log: Log) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    let [err, res] = await this.cognitoService.isSessionValid().
      then(v => [null, v], err => [err, null]);

    if (res) {
      this.log.debug("session exists");
      this.router.navigate(['home']);
    }

    return true;
  }

}
