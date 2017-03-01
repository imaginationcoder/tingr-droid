import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "./config";
import { TokenService } from "./token.service";
import { ParentInfo } from "../providers/data/parent_info";
@Injectable()
export class KidService {
    public headers;

    constructor(private http:Http, private parentInfo:ParentInfo) {
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
    }

    getSchoolsData(kid_id){
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "kid_organizations",
            body: {
                kid_klid: kid_id
            }
        });
        return this.http.post(
            Config.apiUrl + "organizations", data, {
                headers: this.headers
            }
        )
            .map(response => response.json())
            .catch(this.handleErrors);
    }


}