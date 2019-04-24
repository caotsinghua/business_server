import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToOne, JoinColumn } from 'typeorm';
import { VERIFY_STATUS } from '../types/enum';
import { User } from './User';
import { SaleActivity } from './SaleActivity';

@Entity()
export class Verify {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(type => User, verifyer => verifyer.verify_items)
    verifyer: User; //审核人
    @Column({
        type: 'enum',
        enum: VERIFY_STATUS,
        default: VERIFY_STATUS.UNVERIFIED,
    })
    verify_status: VERIFY_STATUS; //审核状态
    @Column({
        nullable: true,
    })
    nopass_reason: string; //审核不过原因
    @OneToOne(type => SaleActivity, activity => activity.verify_data)
    @JoinColumn()
    sale_activity: SaleActivity; //对应的营销活动
}
