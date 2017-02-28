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
    public headers;
    constructor(private http: Http, private parentInfo: ParentInfo) {
        this.headers =  new Headers();
        this.headers.append("Content-Type", "application/json");
    }


    verifyCode(code){
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "verify_account",
            body: {
                code: code
            }
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: this.headers
            }
        )
            .map(response => response.json())
            .catch(this.handleErrors);
    }


    resendCode(){
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "resend_code",
            body: {
            }
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: this.headers
            }
        )
            .map(response => response.json())
            .catch(this.handleErrors);
    }

    logOff() {
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "revoke_authentication",
            body: {}
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: this.headers
            }
        )
            .map(response => response.json())
            .catch(this.handleErrors);
    }

    uploadPicture(imageBase64Data, parent_klid=''){
        let imageBase64DataWithFormat = "data:image/jpeg;base64," + imageBase64Data;
        let imageFileName = new Date().getTime() + '.jpeg';
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: 'upload_multimedia',
            body: {
                profile_id: parent_klid,
                name: imageFileName,
                content_type: "image/jpeg",
                content: imageBase64DataWithFormat
            }
        });

        return this.http.post(
            Config.apiUrl + "document-vault", data, {
                headers: this.headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors)
    }

    forgotPassword(email) {
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            command: "forgot_password",
            body: {
                email: email
            }
        });
        return this.http.post(
            Config.apiUrl + "users", data, {
                headers: this.headers
            }
        )
            .map((res: Response) => res.json())
            .catch(this.handleErrors);
    }

    schoolInfo(orgId){
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "school_info",
            body: {
                organization_id: orgId
            }
        });
        return this.http.post(
            Config.apiUrl + "organizations", data, {
                headers: this.headers
            }
        )
            .map((res: Response) => res.json())
            .catch(this.handleErrors);
    }

    myFamily(){
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "family_info",
            body: { }
        });
        return this.http.post(
            Config.apiUrl + "/v2/profiles", data, {
                headers: this.headers
            }
        )
            .map((res: Response) => res.json())
            .catch(this.handleErrors);
    }

    handleErrors(error: Response) {
        return Observable.throw(error.json() || {error: 'Server error'})
    }


}