// Interface del payload JWT con sub, email y rol tipado.
import { UserRole } from '../../users/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
