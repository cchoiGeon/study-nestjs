import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}
    
    async signup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {userId,password} = authCredentialsDto;

        const hashPassword = await bcrypt.hash(password,10);

        const user = this.userRepository.create({userId,password: hashPassword});
        
        try{
            await this.userRepository.save(user);   
        }catch(e){
            if(e.code === '23505') {
                throw new ConflictException('Existing username');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const { userId, password } = authCredentialsDto;
        const user = await this.userRepository.findOne({ where:{userId} });
        if(user && (await bcrypt.compare(password, user.password))) {
            // 유저 토큰 생성 ( Secret + Payload )
            const payload = { userId };
            const accessToken = await this.jwtService.sign(payload);

            return { accessToken };
        }  else {
            throw new UnauthorizedException('login failed')
        }
    }

    async findById(id: string){
        try{
            const user = await this.userRepository.findOne({ where:{uuid:id} });
            console.log("user : ",user);
            return user;
        }catch(err){
            throw new InternalServerErrorException();
        }
    }
    async googleUserSignup(id: string, email: string) {
        try {
            const user = this.userRepository.create({
                uuid: id,
                userId: email,
            });

            const result = await this.userRepository.save(user); 
            
            return result;
        } catch (err) {
            console.error("Error saving user:", err); // 에러 로그 추가
            throw new InternalServerErrorException('User signup failed');
        }
    }
}
