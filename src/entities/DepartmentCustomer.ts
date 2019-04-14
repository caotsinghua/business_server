import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    ManyToMany,
} from 'typeorm';
import { User } from './User';
import { Group } from './Group';
// 机构客户
@Entity()
export class DepartmentCustomer {
    @PrimaryGeneratedColumn()
    id: number; //机构编号
    @Column()
    name: string; //机构名字
    @Column()
    type: string; //机构类型
    @Column()
    contact_person: string; //联系人
    @Column()
    phone_number: string; //联系电话
    @ManyToMany(type => Group, group => group.department_customers)
    groups: Group[]; //客户群id
    @Column()
    owner: string; //法人
    @Column()
    description: string; //备注
    @ManyToOne(type => User, manager => manager.department_customers)
    manager: User;
}
