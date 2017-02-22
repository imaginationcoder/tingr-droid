import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "./config";
import { TokenService } from "./token.service";
import { ParentInfo } from "../providers/data/parent_info";
@Injectable()
export class ParentService {
    constructor(private http: Http, private parentInfo: ParentInfo) {
    }

    logOff() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "revoke_authentication",
            body: {}
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: headers
            }
        )
            .map(response => response.json())
            .catch(this.handleErrors);
    }

    forgotPassword(email) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            command: "forgot_password",
            body: {
                email: email
            }
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: headers
            }
        )
            .map((res: Response) => res.json())
            .catch(this.handleErrors);
    }

    handleErrors(error: Response) {
        return Observable.throw(error.json() || {error: 'Server error'})
    }


}