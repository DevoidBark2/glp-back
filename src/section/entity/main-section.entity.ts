import { User } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('main-sections')
export class MainSection {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar' })
  title: string;
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;
  @Column({ type: 'numeric', nullable: true })
  sort: number;
}
