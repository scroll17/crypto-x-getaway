/*external modules*/
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
/*services*/
import { AuthService } from '../auth.service';
/*@interfaces*/
import { ICurrentUserData } from '@common/types/auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<Omit<ICurrentUserData, 'token'>> {
    const data = await this.authService.validateUser(email, password);
    return data;
  }
}
