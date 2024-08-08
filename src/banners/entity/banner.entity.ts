import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('banners')
export class BannerEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
  name: string;
  @Column({ type: 'varchar', length: 255 })
  image: string;
  @Column({ type: 'varchar', length: 255 })
  description: string;
  @Column({ type: 'text' })
  content: string;
}
