import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    register_time: Date; //注册时间
    @Column({
        nullable: true,
    })
    type: string; //自然人客户类型
    @Column()
    points: number; // 积分
    @Column()
    debt: number; //欠款
    @Column()
    deposit: number; //存款
    @Column()
    loan: number; //贷款
    @Column()
    income: number; //年收入
    @Column({
        nullable: true,
    })
    creadit_level: string; //信用级别
    @Column({
        nullable: true,
    })
    danger_level: string; //风险级别
    @Column()
    remain: string; //余额
    @Column({
        nullable: true,
    })
    register_money: number; //注册资金
    @Column({
        nullable: true,
    })
    back_ability: string; //偿还贷款能力
}
