import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import * as config from 'config';

const googleConfig = config.get('google');
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: AuthService) {
    super({
      clientID: googleConfig.CLIENT_ID,
      clientSecret: googleConfig.CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails } = profile;
    const email = emails[0].value;
    const userName = name.familyName;
    console.log(email,userName,id);
    let user = await this.userService.findById(id);
    if(!user){
      user = await this.userService.googleUserSignup(id,email);
    }
    return user;
  }
}