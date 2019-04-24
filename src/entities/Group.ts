import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    Column,
    OneToOne,
    JoinColumn,
    JoinTable,
    OneToMany,
} from 'typeorm';
import { Customer } from './Customer';
import { DepartmentCustomer } from './DepartmentCustomer';
import { SaleActivity } from './SaleActivity';
import { GroupModel } from './GroupModel';

// 客户群
@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        unique: true,
    })
    name: string; //客户群名称
    @OneToOne(type => GroupModel, model => model.group)
    @JoinColumn()
    model: GroupModel; //模板
    @ManyToMany(type => Customer, customer => customer.groups)
    @JoinTable()
    customers: Customer[];
    @ManyToMany(type => DepartmentCustomer, dc => dc.groups)
    @JoinTable()
    department_customers: DepartmentCustomer[];
    @OneToMany(type => SaleActivity, activity => activity.group)
    activities: SaleActivity[];
}
