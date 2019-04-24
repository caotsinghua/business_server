import { getRepository } from 'typeorm';
import { Verify } from '../entities/Verify';

export async function findVerify(verifyId: number) {
    return getRepository(Verify).findOne({
        relations: ['verifyer'],
        where: {
            id: verifyId,
        },
    });
}
