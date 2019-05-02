import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { ActivityWithCustomer } from './ActivityWithCustomer';

@Entity()
export class ContactRecord {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    type: string; //营销方式
    @CreateDateColumn()
    created_time: Date; // 营销时间
    @Column({
        default: 0,
    })
    times: number; //次数
    @Column({
        nullable: true,
    })
    subject: string;
    @Column({
        nullable: true,
    })
    text: string;
    @Column({
        nullable: true,
    })
    html: string;
    @Column({
        nullable: true,
    })
    to: string; //接收者
    @Column({
        default: false,
    })
    success: boolean; //营销是否成功
    @ManyToOne(type => ActivityWithCustomer, relation => relation.records)
    relation: ActivityWithCustomer;
}
