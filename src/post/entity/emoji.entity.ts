import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('emoji')
export class EmojiEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  image: string;
}
