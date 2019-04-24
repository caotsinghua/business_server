import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity()
export class ActivityWithCustomer {
    @PrimaryColumn()
    customerId: number;
    @PrimaryColumn()
    activitiId: number;
    @Column()
    contacted: boolean; //是否联系过
    @Column()
    joined: boolean; //是否参加
}
