import { Entity, PrimaryGeneratedColumn, ManyToMany, Column } from 'typeorm';
import { Customer } from './Customer';
import { DepartmentCustomer } from './DepartmentCustomer';

// 客户群
@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        unique: true,
    })
    name: string; //客户群名称
    @ManyToMany(type => Customer, customer => customer.groups)
    customers: Customer[];
    @ManyToMany(type => DepartmentCustomer, dc => dc.groups)
    department_customers: DepartmentCustomer[];
}
