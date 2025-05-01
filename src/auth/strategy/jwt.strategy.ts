import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    const { id } = payload;

    //console.log('JWT payload:', payload);

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UnauthorizedException('Login first to access this resource');
    }
    return user;
  }
}
