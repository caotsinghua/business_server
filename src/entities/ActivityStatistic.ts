import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { SaleActivity } from './SaleActivity';
@Entity()
export class ActivityStatistic {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        default: 0,
    })
    target_customers_count: number; // 目标客户数
    @Column({
        default: 0,
    })
    contacted_count: number; // 接触客户数
    @Column({
        default: 0,
    })
    contacted_back_count: number; // 接触响应数
    @Column({
        default: 0,
    })
    joined_count: number; //参与活动数
    @Column({
        default: 0,
    })
    money_total: number; //资金转入总数
    @OneToOne(type => SaleActivity, activity => activity.statistic)
    @JoinColumn()
    activity: SaleActivity;
}
