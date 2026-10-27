import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('organizations')
@UseGuards(AuthGuard)
export class OrganizationsController {
  constructor(private orgsService: OrganizationsService) {}

  @Get()
  async list(@CurrentUser() user: any) {
    return this.orgsService.listForUser(user.id, user.isPlatformAdmin);
  }

  @Post()
  async create(@Body() body: any, @CurrentUser() user: any) {
    return this.orgsService.create(body, user.id, user.email);
  }

  @Get(':organizationId')
  @UseGuards(TenantGuard)
  async getOne(@Param('organizationId') id: string) {
    return this.orgsService.getById(id);
  }

  @Patch(':organizationId')
  @UseGuards(TenantGuard)
  async update(
    @Param('organizationId') id: string,
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    return this.orgsService.update(id, body, user.id, user.email);
  }
}
