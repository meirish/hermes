// @ts-nocheck
// TODO: Type this file. - really just the ESA session

import ESASession from 'ember-simple-auth/services/session';
import { inject as service } from "@ember/service";
import RouterService from "@ember/routing/router-service";

export default class SessionService extends ESASession {
  
  @service declare router: RouterService;
  readonly SESSION_STORAGE_KEY: string = 'hermes.redirectTarget';

   // ember-simple-auth's only uses a cookie to track redirect target if you're using fastboot, otherwise it keeps track of the redirect target as a parameter on the session service. See the source here: https://github.com/mainmatter/ember-simple-auth/blob/a7e583cf4d04d6ebc96b198a8fa6dde7445abf0e/packages/ember-simple-auth/addon/-internals/routing.js#L33-L50
  //
  // Because we redirect as part of the authentication flow, the parameter storing the transtion gets reset. Instead, we keep track of the redirectTarget in browser sessionStorage and override the handleAuthentication method as recommended by ember-simple-auth.
  handleAuthentication(routeAfterAuthentication: string) {
    let redirectTarget = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
    let transition;

    if (redirectTarget) {
      transition = this.router.transitionTo(redirectTarget);
    } else {
      transition = this.router.transitionTo(routeAfterAuthentication);
    }
    transition.followRedirects().then(() => {
      sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
    });
  }
}