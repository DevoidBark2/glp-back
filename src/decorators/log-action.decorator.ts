import { SetMetadata } from '@nestjs/common';

export const LogAction = (action: string, description: string = '') =>
  SetMetadata('logAction', { action, description });
