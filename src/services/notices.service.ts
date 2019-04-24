import { getRepository, getManager } from 'typeorm';
import { User } from '../entities/User';
import { Notice } from '../entities/Notice';

export async function getUserNotices(job_number: string) {
    const { received_notices } = await getRepository(User).findOne({
        relations: ['received_notices'],
        where: {
            job_number,
        },
    });
    return received_notices;
}

export async function sendNotice(
    job_number: string,
    toId: number,
    {
        title,
        content,
    }: {
        title: string;
        content: string;
    },
) {
    const userRepo = getRepository(User);
    const from = await userRepo.findOne({ job_number });
    const to = await userRepo.findOne(toId);
    const notice = getManager().create(Notice, {
        title,
        content,
        from,
        to,
    });
    return getManager().save(notice);
}

export async function readOneNotice(noticeId: number) {
    return getManager().delete(Notice, noticeId);
}

export async function readAllNotices(job_number: number) {
    const { received_notices } = await getRepository(User).findOne({
        relations: ['received_notices'],
        where: {
            job_number,
        },
    });
    return getRepository(Notice).remove(received_notices);
}
