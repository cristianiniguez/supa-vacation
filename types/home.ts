import { Home } from '@prisma/client';

export type HomeCreateData = Omit<Home, 'id' | 'createdAt' | 'updatedAt'>;
