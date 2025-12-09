// Decorador de roles: define roles permitidos para un handler.
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type Role = 'admin' | 'technician' | 'client';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
