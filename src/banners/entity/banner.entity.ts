import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('banners')
export class BannerEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
