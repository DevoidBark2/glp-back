import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ComplexityPasswordEnum } from '../enum/complexity-password.enum';
import { UserRole } from '../../constants/contants';

@Entity('general-settings')
export class GeneralSettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'numeric' })
  min_password_length: number;
  @Column({ type: 'enum', enum: ComplexityPasswordEnum })
  password_complexity: ComplexityPasswordEnum;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  default_user_role: UserRole;
}
