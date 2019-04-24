import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToOne } from 'typeorm';
import { Bank } from './Bank';
import { Group } from './Group';

@Entity()
export class GroupModel {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(type => Bank, bank => bank.group_models)
    bank: Bank; //所属机构
    @OneToOne(type => Group, group => group.model)
    group: Group;
    @Column({
        nullable: true,
    })
    batch: string; //营销批号
    @Column({
        unique: true,
    })
    name: string; //模版名称
    @Column({
        nullable: true,
    })
    description: string; //备注
    @Column({
        nullable: true,
    })
    income_min: number; //收入区间最低
    @Column({
        nullable: true,
    })
    income_max: number; // 收入区间最高
    @Column({
        nullable: true,
    })
    points_min: number; //积分区间
    @Column({
        nullable: true,
    })
    points_max: number;
    @Column({
        nullable: true,
    })
    debt_min: number; //欠款区间
    @Column({
        nullable: true,
    })
    debt_max: number;
    @Column({
        nullable: true,
    })
    deposit_min: number; //存款区间
    @Column({
        nullable: true,
    })
    deposit_max: number;
    @Column({
        nullable: true,
    })
    loan_min: number; //贷款区间
    @Column({
        nullable: true,
    })
    loan_max: number;
    @Column({
        nullable: true,
    })
    danger_level: string; // 风险级别
    @Column({
        nullable: true,
    })
    creadit_level: string; // 信用级别
    @Column({
        nullable: true,
    })
    back_ability: string; //还贷能力
    @Column({
        default: false,
    })
    is_department: boolean; //是否机构客户
}
