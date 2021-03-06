import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  SetMetadata,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { LoggingInterceptor } from 'src/logging.interceptor';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { ValidationPipe } from 'src/validation.pipe';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interface/cat.interface';

@Controller('cats')
@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor)
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  @Roles('admin')
  async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }
  // @Post()
  // @UseFilters(HttpExceptionFilter)
  // async create(@Body() createCatDto: CreateCatDto) {
  //   console.log(createCatDto.name);
  //   console.log(createCatDto.age);
  //   console.log(createCatDto.breed);
  //   throw new ForbiddenException();
  // }

  @Get()
  async findAll(): Promise<Cat[]> {
    // throw new HttpException(
    //   {
    //     status: HttpStatus.FORBIDDEN,
    //     error: 'This is a custom message',
    //   },
    //   HttpStatus.FORBIDDEN,
    // );
    return this.catsService.findAll();
  }

  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    console.log(version);
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }

  @Get(':id')
  findOne(@Param() params): string {
    console.log(params.id);
    return `This action returns a #${params.id} cat`;
  }
}
