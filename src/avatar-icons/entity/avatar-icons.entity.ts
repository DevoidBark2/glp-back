import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { StatusAvatarIconsEnum } from '../enum/status-avatar-icons.enum';

@Entity('avatar_icons')
export class AvatarIconsEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;
  @Column({ type: 'varchar', length: 255 })
  image: string;
  @CreateDateColumn()
  created_at: Date;
  @Column({
    type: 'enum',
    enum: StatusAvatarIconsEnum,
    default: StatusAvatarIconsEnum.ACTIVE,
  })
  status: StatusAvatarIconsEnum;
}
