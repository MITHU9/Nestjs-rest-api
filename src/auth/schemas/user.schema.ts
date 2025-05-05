import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../enums/role.enum';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop({
    type: [
      {
        type: String,
        enum: Role,
      },
    ],
    default: [Role.User],
  })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
