class AuthService {
  async loginUser(_email: string, _password: string) {
    // find user
    // compare password
    // create tokens
    // save refresh token
    // return tokens
  }

  async refreshSession(_token: string) {
    // verify refresh token
    // issue new access token
  }
}

export const authService = new AuthService();
