
import { VerifyEmailComponent } from "./pages/authentication/verify-email.component";

export const APP_ROUTES = [

    { path: "", redirectTo: "/verify-email", pathMatch: 'full'},
    { path: "verify-email", component: VerifyEmailComponent}
];

export const navigatableComponents = [
    VerifyEmailComponent
];

/*export const authProviders = [
    AuthGuard
];*/
