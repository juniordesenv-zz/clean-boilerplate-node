import { v4 as uuidv4 } from 'uuid';
import { UuidV4 } from '@/data/protocols/uuid/uuid-v4';

export class UuidAdapter implements UuidV4 {
  v4(): string {
    return uuidv4();
  }
}
