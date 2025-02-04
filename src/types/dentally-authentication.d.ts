export interface RequestAuthorizationParams {
  clientId: string;
  redirectUri: string;
  scope: string;
  responseType: string;
  state: string | undefined;
}

export interface GetATokenParams {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  code: string;
  grantType: string;
}
