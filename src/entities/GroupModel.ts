import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Bank } from './Bank';

@Entity()
export class GroupModel {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(type => Bank, bank => bank.group_models)
    department: Bank; //所属机构
    @Column()
    batch: string; //营销批号
    @Column()
    query: string; //查询字段
    @Column({
        unique: true,
    })
    name: string; //模版名称
    @Column({
        nullable: true,
    })
    description: string; //备注
}
