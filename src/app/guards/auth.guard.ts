import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpUtilsService } from '../commons/http-base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: HttpUtilsService, private router:Router) {
  }

  canActivate():  boolean  {
    if ( this.auth.isAuthenticate() ) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

}
