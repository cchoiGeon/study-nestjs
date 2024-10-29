import { Body, Controller, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    signup(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signup(authCredentialsDto);
    }
    
    @Post('/signin')
    
    async signIn(
        @Res() res: Response,
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
        ) {
        const { accessToken } = await this.authService.signIn(authCredentialsDto);
        res.cookie('accessToken', accessToken, { httpOnly: true });
        return res.send('Cookie has been set');
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        console.log('user', user);
    } 
}
