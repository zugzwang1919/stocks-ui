export interface AuthenticationResponse {
    username: string;
    token: string;
    admin: boolean;
    refreshToken: string;
}
