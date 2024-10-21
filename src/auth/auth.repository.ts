import { Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

export class UserRepository extends Repository<User>{
    async createUser(authCredentialsDto:AuthCredentialsDto): Promise<void> {
        const {username,password} = authCredentialsDto;

        const hashPassword = await bcrypt.hash(password,10);

        const user = this.create({username,password: hashPassword});
        
        try{
            await this.save(user);   
        }catch(e){
            if(e.code === '23505') {
                throw new ConflictException('Existing username');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}