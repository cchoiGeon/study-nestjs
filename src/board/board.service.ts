import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board.board-status';
import { CreateBoardDto } from './dto/create-board-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entitiy';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';


@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) {}

    async getAllBoards(
        user: User
    ): Promise<Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');

        query.where('board.userId = :userId', { userId: user.userId});

        const boards = await query.getMany();
        console.log(boards);
        return boards;
    }

    async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<void> {
        const {title,description} = createBoardDto;
        
        await this.boardRepository.save({
            title,
            description,
            status:BoardStatus.PUBLIC,
            user,
        })

    }

    async getBoardById(id: number): Promise<Board> {
        const find = await this.boardRepository.findOne({ where: { id } });
        if (!find) {
            throw new NotFoundException(`Board with ID ${id} not found`);
        }
        return find;
    }

    async deleteBoard(id: number, user: User): Promise<void> {
        const result = await this.boardRepository.delete({id,user});
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
