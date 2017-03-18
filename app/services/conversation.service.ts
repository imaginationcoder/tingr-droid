import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "./config";
import { TokenService } from "./token.service";
import { ParentInfo } from "../providers/data/parent_info";
@Injectable()
export class ConversationService {
    public headers;


    constructor(private http: Http, private parentInfo: ParentInfo) {
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
    }

    getList(){
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "conversation_list",
            body: {
            }
        });
        return this.http.post(
            Config.apiUrl + "conversations", data, {
                headers: this.headers
            }
        )
            .map(response => response.json())
            .catch(this.handleErrors);
    }


    sendMessage(msg_text, organization_id, conversation_klid , kid_klid) {
        let parent = ParentInfo.profile;
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "send_message",
            body: {
                text: msg_text,
                kid_klid: kid_klid, // reciver
                sender_klid: parent.kl_id, //sender
                conversation_klid: conversation_klid,
                organization_id: organization_id
            }
        });

        return this.http.post(
            Config.apiUrl + "conversations", data, {
                headers: headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors);
    }

    // get messages kid associated for
    getMessages(organization_id,conversation_klid,kid_klid, last_message_time = ''){
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "messages",
            body: {
                conversation_klid : conversation_klid,
                kid_klid: kid_klid,
                organization_id: organization_id,
                last_message_time: last_message_time
            }
        });
        return this.http.post(
            Config.apiUrl + "conversations", data, {
                headers: headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors);
    }

    makeMessagesRead(conversationId, unreadMessageIds){
        let headers = new Headers();
        let parent = ParentInfo.profile;
        headers.append("Content-Type", "application/json");
        let data = JSON.stringify({
            access_token: TokenService.accessToken,
            auth_token: TokenService.authToken,
            command: "read_message",
            body: {
                conversation_klid : conversationId,
                profile_klid: parent.kl_id,
                messages_klid: unreadMessageIds
            }
        });
        return this.http.post(
            Config.apiUrl + "conversations", data, {
                headers: headers
            }
        ).map((res: Response) => res.json())
            .catch(this.handleErrors);
    }

    handleErrors(error: Response) {
        return Observable.throw(error.json() || {error: 'Server error'})
    }
}