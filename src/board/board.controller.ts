import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardStatus } from './board.board-status';
import { CreateBoardDto } from './dto/create-board-dto';
import { BoardStatusValidationPipe } from './pipe/board-status-validation';
import { Board } from './board.entitiy';

@Controller('/board')
export class BoardController {
    constructor(
        private boardService:BoardService,
    ){}

    @Get('/')
    getAllBoard(): Promise<Board[]> {
        return this.boardService.getAllBoards();
    }

    @Post('/')
    createBoard(
        @Body() createBoardDto:CreateBoardDto
    ): Promise<void> {
        return this.boardService.createBoard(createBoardDto);
    }

    @Get('/:id')
    getBoardById(
        @Param('id') id:number
    ):Promise<Board> {
        return this.boardService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoard(
        @Param('id') id:number
    ): Promise<void> {
        return this.boardService.deleteBoard(id);
    }

    @Patch('/:id')
    updateBoardStatus(
        @Param('id') id:number,
        @Body('status',BoardStatusValidationPipe) status:BoardStatus,
    ) {
        return this.boardService.updateBoardStatus(id,status);
    }
}
