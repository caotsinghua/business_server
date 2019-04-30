import XLSX from 'xlsx';
import fs from 'fs';
import { getManager } from 'typeorm';
import { Customer } from '../entities/Customer';
import { createCustomer, createDepartmentCustomer } from './customers.service';
export async function getExcelAndParseToCustomers(filePath: string) {
    const workBook = XLSX.readFile(filePath);
    let data: any[] = [];
    for (var sheet in workBook.Sheets) {
        if (workBook.Sheets.hasOwnProperty(sheet)) {
            let fromTo = workBook.Sheets[sheet]['!ref'];
            data = data.concat(XLSX.utils.sheet_to_json(workBook.Sheets[sheet]));
        }
    }
    return data;
}

export async function saveCustomers(job_number: number, customers: any[]) {
    const result = await Promise.all(
        customers.map(async item => {
            return createCustomer(job_number, item);
        }),
    );
    return result;
}

export async function getExcelAndParseToDepartmentCustomers() {}
