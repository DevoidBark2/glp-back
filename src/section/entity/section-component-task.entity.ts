import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

import { ComponentTask } from '../../component-task/entity/component-task.entity';
import { SectionEntity } from './section.entity';

@Entity('section_component_task')
export class SectionComponentTask {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => SectionEntity, (section) => section.sectionComponents, { onDelete: 'CASCADE' })
    section: SectionEntity;

    @ManyToOne(() => ComponentTask, (componentTask) => componentTask.sectionComponents, { onDelete: 'CASCADE' })
    componentTask: ComponentTask;

    @Column({ type: 'numeric', default: 0 })
    sort: number; // Порядок компонента в разделе
}
