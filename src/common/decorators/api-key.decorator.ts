// Decorador para marcar endpoints protegidos por x-api-key (legado).
import { SetMetadata } from '@nestjs/common';

export const IS_API_KEY = 'isApiKeyProtected';
export const ApiKeyProtected = () => SetMetadata(IS_API_KEY, true);
