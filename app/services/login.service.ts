import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import {Config} from "./config";
import {TokenService} from "./token.service";
import {ParentInfo} from "../providers/data/parent_info";
@Injectable()
export class LoginService {
    constructor(private http: Http) {
    }

    evaluteUser(email) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            command: "evaluate_user",
            body: {
                email: email
            }
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: headers
            }
        ).map((res: Response) => res.json()).catch(this.handleErrors);
    }

    signInUser(email, password){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            command: "authentication",
            body: {
                user_email: email,
                password: password
            }
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: headers
            }
        )
            .map(response => response.json())
            .catch(this.handleErrors);
    }

    signUpUser(email,pass,fname,lname,photoId){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            command: "signup_parent",
            body: {
                 email : email,
                 password : pass,
                 password_confirmation : pass,
                 fname : fname,
                 lname : lname,
                 photo_id : photoId
            }
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
            .map((res:Response) => res.json())
            .catch(this.handleErrors);
    }


    handleErrors(error: Response) {
        return Observable.throw(error.json() || {error: 'Server error'})
    }


}