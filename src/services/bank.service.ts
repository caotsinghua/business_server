import { getRepository, getManager } from 'typeorm';
import { Bank } from '../entities/Bank';
import { User } from '../entities/User';

export async function getBanks() {
    const bankRepository = getRepository(Bank);
    const banks = await bankRepository.find();
    return banks;
}

export async function getBank(bankId: number) {
    const bankRepository = getRepository(Bank);
    const bank = await bankRepository.findOne(bankId);
    return bank;
}

export async function createBank({
    name,
    address,
    phone_number,
    abbr,
    created_time,
    isroot,
}: {
    name: string;
    address: string;
    phone_number: string;
    abbr: string;
    created_time: Date;
    isroot: boolean;
}) {
    const bankRepository = getRepository(Bank);
    const bank = await bankRepository.create({
        name,
        address,
        phone_number,
        abbr,
        created_time,
        isroot,
    });
    return bank;
}

export async function updateBank(
    bankId: number,
    {
        name,
        address,
        phone_number,
        abbr,
        created_time,
        isroot,
        leaderId,
    }: {
        name: string;
        address: string;
        phone_number: string;
        abbr: string;
        created_time: Date;
        isroot: boolean;
        leaderId: number;
    },
) {
    const bankRepository = getRepository(Bank);
    const userRepository = getRepository(User);
    const leader = await userRepository.findOne(leaderId);
    const bank = await bankRepository.update(bankId, {
        name,
        address,
        phone_number,
        abbr,
        created_time,
        isroot,
        leader,
    });
    return bank;
}

export async function deleteBank(bankId: number) {
    const bankRepository = getRepository(Bank);
    const bank = await bankRepository.delete(bankId);
    return bank;
}
