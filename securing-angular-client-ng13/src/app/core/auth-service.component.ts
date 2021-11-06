import { Injectable } from '@angular/core';
import { User, UserManager } from 'oidc-client';
import { Subject } from 'rxjs';
import { Constants } from '../constants';
import { CoreModule } from './core.module';

@Injectable({ providedIn: CoreModule })
export class AuthService {
    private _userManager: UserManager;
    private _user: User;
    private _loginChangedSubject = new Subject<boolean>();

    loginChanged = this._loginChangedSubject.asObservable();

    constructor() {
        const stsSettings = {
            authority: Constants.stsAuthority,
            client_id: Constants.clientId,
            redirect_uri: `${Constants.clientRoot}signin-callback`,
            scope: 'openid profile projects-api',
            response_type: 'code',
            post_logout_redirect_uri: `${Constants.clientRoot}signout-callback`
        };

        this._userManager = new UserManager(stsSettings);

    }

    login() {
        this._userManager.signinRedirect();
    }

    isLoggedIn(): Promise<boolean> {
        return this._userManager.getUser().then(user => {
            const userCurrent = !!user && !user.expired;

            if (this._user !== user) {
                this._loginChangedSubject.next(userCurrent);
            }

            

            this._user = user;
            return userCurrent;
        });
    };

}