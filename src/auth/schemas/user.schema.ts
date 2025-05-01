import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: [true, 'Duplicate email entered'] })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
