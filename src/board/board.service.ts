import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board.board-status';
import { CreateBoardDto } from './dto/create-board-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entitiy';
import { Repository } from 'typeorm';


@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) {}

    async getAllBoards(): Promise<Board[]> {
        return await this.boardRepository.find();
    }

    async createBoard(createBoardDto: CreateBoardDto): Promise<void> {
        const {title,description} = createBoardDto;
        
        await this.boardRepository.save({
            title,
            description,
            status:BoardStatus.PUBLIC,
        })

    }

    async getBoardById(id: number): Promise<Board> {
        const find = await this.boardRepository.findOne({ where: { id } });
        if (!find) {
            throw new NotFoundException(`Board with ID ${id} not found`);
        }
        return find;
    }

    async deleteBoard(id: number): Promise<void> {
        const result = await this.boardRepository.delete({id});
        if(result.affected == 0){
            throw new NotFoundException(`Can't find Board with id ${id}`)
        }

    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<void> {
        const board = await this.getBoardById(id);

        board.status = status;

        await this.boardRepository.save(board);

    }
}