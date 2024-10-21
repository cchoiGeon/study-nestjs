import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../board.board-status";

export class BoardStatusValidationPipe implements PipeTransform {
    readonly StatusOptions = [
        BoardStatus.PUBLIC,
        BoardStatus.PRIVATE,
    ]
    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();
        
        if(!this.isStatusValid(value)){
            throw new BadRequestException(`${value} is not in the status options`);
        }
        return value;
        // throw new Error("Method not implemented.");
    }

    private isStatusValid(value:any) {
        const index = this.StatusOptions.indexOf(value);
        return index !== -1;
    }
}