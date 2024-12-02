import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { ComponentTask } from './component-task.entity';
  import { User } from '../../user/entity/user.entity';
  
  @Entity('answers_component_user')
  export class AnswersComponentUser {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    user: User;
  
    @ManyToOne(() => ComponentTask, (task) => task.id, { onDelete: 'CASCADE' })
    task: ComponentTask;
  
    @Column({ type: 'json', nullable: false })
    answer: any; // Содержит ответ пользователя (можно использовать объект для хранения данных)
  
    @Column({ type: 'boolean', nullable: false, default: false })
    isCorrect: boolean; // Показывает, правильный ли ответ
  
    @CreateDateColumn()
    created_at: Date;
  }
  