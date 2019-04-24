import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Notice {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column()
    content: string;
    @ManyToOne(type => User, user => user.sended_notices)
    from: User; //发送者
    @ManyToOne(type => User, user => user.received_notices)
    to: User; //接收者
    @CreateDateColumn()
    created_at: Date;
}
