import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CognitoService } from '../services/cognito.service';
import { Log } from '../utils/log';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private cognitoService: CognitoService, 
    private router: Router,
    private log: Log){}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      
      let [err, res] = await this.cognitoService.isSessionValid().
        then(v => [null, v], err => [err, null]);
      
      if (err) {
        this.log.debug("session is invalid");
        this.router.navigate(['login']);
      } 
  
      return true;
  }
  
}
