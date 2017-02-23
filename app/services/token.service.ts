import { getString, setString , setNumber, getNumber} from "application-settings";
import {getBoolean} from "application-settings";
import {setBoolean} from "application-settings";
export class TokenService {

    static isLoggedIn(): boolean {
        return !!getString("authToken");
    }

    static isVerified(): boolean {
        return getBoolean("userVerified");
    }

    static get accessToken(): string {
        return getString("accessToken");
    }

    static set accessToken(str: string) {
        setString("accessToken", str);
    }

    static get userVerified(): boolean {
        return getBoolean("userVerified");
    }

    static set userVerified(val: boolean) {
        setBoolean("userVerified", val);
    }


    static get accessTokenExpiry(): number {
        return getNumber("accessTokenExpiry");
    }

    static set accessTokenExpiry(num: number) {
        setNumber("accessTokenExpiry", num);
    }

    static get authToken(): string {
        return getString("authToken");
    }

    static set authToken(str: string) {
        setString("authToken", str);
    }
}