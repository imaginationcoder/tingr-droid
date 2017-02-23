import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";

import { TokenService } from "./services/token.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate() {

        if (TokenService.isLoggedIn()) {
            return true;
        }
        else {
            this.router.navigate(["/verify-email"]);
            return false;
        }
    }
}