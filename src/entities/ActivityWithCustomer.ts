import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity()
export class ActivityWithCustomer {
    @PrimaryColumn()
    customerId: number;
    @PrimaryColumn()
    activityId: number;
    @Column({
        default: 0,
    })
    contacted_count: number; //联系次数
    @Column({
        default: false,
    })
    joined: boolean; //是否参加
    @Column({
        default: 0,
    })
    invest_money: number; // 投资钱
}
