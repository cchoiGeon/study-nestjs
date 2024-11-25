import { Body, Controller, Get, Post, Redirect, Req, Request, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
  
    @Get('/google')
    @UseGuards(AuthGuard('google'))
    @Redirect('/board/')
    googleAuthRedirect(@Req() req,@Res() res) {
        
        // res.cookie('accessToken', accessToken, { httpOnly: true });
        return res.send('Cookie has been set');
    }

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
}
