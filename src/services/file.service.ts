import XLSX from 'xlsx';
import fs from 'fs';
import { getManager } from 'typeorm';
import { Customer } from '../entities/Customer';
import { createCustomer, createDepartmentCustomer } from './customers.service';
import { getActivityCustomers, getActivityStatistic } from './statistic.service';
import { getActivity } from './activities.service';
export async function exportCustomers(customers: Customer[]) {
    const workSheet = XLSX.utils.aoa_to_sheet([customers]);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'customers');
    const path = XLSX.writeFile(workBook, `files/${customers}-${Date.now()}.xlsb`);
    return path;
}

interface BatchCustomers {
    files: any;
}
class BatchCustomers {
    constructor() {
        this.files = {};
    }

    parseExcelToCustomers(filePath: string) {
        const workBook = XLSX.readFile(filePath);
        const key = `${filePath}-${Date.now()}`;
        let data: any[] = [];
        for (var sheet in workBook.Sheets) {
            if (workBook.Sheets.hasOwnProperty(sheet)) {
                let fromTo = workBook.Sheets[sheet]['!ref'];
                data = data.concat(XLSX.utils.sheet_to_json(workBook.Sheets[sheet]));
            }
        }
        this.files[key] = data;
        return { key, data };
    }

    async saveCustomers(key: string, job_number: number) {
        const data = this.files[key];
        const result = await Promise.all(
            data.map(async (item: any) => {
                return createCustomer(job_number, item);
            }),
        );
        const filePath = key.split('-')[0];
        delete this.files[key];
        fs.unlinkSync(filePath);
        return result;
    }
    async parseCustomersToExcel(activityId: number) {
        const [customers, statistic, activity] = await Promise.all([
            getActivityCustomers(activityId),
            getActivityStatistic(activityId),
            getActivity(activityId),
        ]);
        const customerMap = {
            id: '编号',
            name: '姓名',
            sex: '性别',
            certificate_type: '证件类型',
            certificate_number: '证件号码',
            address: '家庭住址',
            household: '户籍',
            email: '邮箱',
            birthday: '生日',
            phone_number: '手机号码',
            marry_status: '婚姻状况',
            education_degree: '文化程度',
        };
        const sexMap = {
            male: '男',
            female: '女',
        };
        const data = customers.map(({ customer }) => {
            const temp: any = {};
            Object.keys(customerMap).forEach((key: string) => {
                temp[customerMap[key]] = customer[key];
                if (key === 'sex') {
                    temp[customerMap[key]] = sexMap[customer[key]];
                }
            });
            return temp;
        });
        const workSheet = XLSX.utils.json_to_sheet(data);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet);
        const path = `files/${activity.name}-活动数据.xlsx`;
        await XLSX.writeFile(workBook, path);
        return path;
    }
    parseExcelToDepartmentCustomer() {}
}

export const batchCustomersService = new BatchCustomers();
