import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardStatus } from './board.board-status';
import { CreateBoardDto } from './dto/create-board-dto';
import { BoardStatusValidationPipe } from './pipe/board-status-validation';
import { Board } from './board.entitiy';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('/board')
@UseGuards(AuthGuard())
export class BoardController {
    constructor(
        private boardService:BoardService,
    ){}

    @Get('/')
    getAllBoard(
        @GetUser() user: User
    ): Promise<Board[]> {
        return this.boardService.getAllBoards(user);
    }
    @Post('/')
    createBoard(
        @Body() createBoardDto:CreateBoardDto,
        @GetUser() user: User,
    ): Promise<void> {
        return this.boardService.createBoard(createBoardDto,user);
    }

    @Get('/:id')
    getBoardById(
        @Param('id') id:number
    ):Promise<Board> {
        return this.boardService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoard(
        @Param('id') id:number,
        @GetUser() user:User
    ): Promise<void> {
        return this.boardService.deleteBoard(id,user);
    }

    @Patch('/:id')
    updateBoardStatus(
        @Param('id') id:number,
        @Body('status',BoardStatusValidationPipe) status:BoardStatus,
    ) {
        return this.boardService.updateBoardStatus(id,status);
    }
}
