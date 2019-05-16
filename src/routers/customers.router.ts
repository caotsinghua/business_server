import { Router } from 'express';
import { Req, Res } from '../types';
import { authenticated, aclAuthenticated } from '../middlewares';
import {
    getCustomers,
    createCustomer,
    updateCustomer,
    getDepartmentCustomers,
    getCustomer,
    getDepartmentCustomer,
    createDepartmentCustomer,
    updateDepartmentCustomer,
    mockCustomers,
} from '../services/customers.service';
const customersRouter = Router();
customersRouter.get('/', async (req: Req, res: Res, next: any) => {
    try {
        const { page, pageSize } = req.query;
        const response = await getCustomers({ page, pageSize });
        res.apiSuccess(response);
    } catch (e) {
        next(e);
    }
});
customersRouter.get('/departmentCustomers', async (req: Req, res: Res, next: any) => {
    try {
        const { page, pageSize } = req.query;
        const response = await getDepartmentCustomers({ page, pageSize });
        res.apiSuccess(response);
    } catch (e) {
        next(e);
    }
});
customersRouter.get(
    '/departmentCustomers/:departmentCustomerId',
    async (req: Req, res: Res, next: any) => {
        try {
            const { departmentCustomerId } = req.params;
            const response = await getDepartmentCustomer(departmentCustomerId);
            res.apiSuccess(response);
        } catch (e) {
            next(e);
        }
    },
);
customersRouter.get('/:customerId', async (req: Req, res: Res, next: any) => {
    try {
        const { customerId } = req.params;
        const customer = await getCustomer(customerId);
        res.apiSuccess(customer);
    } catch (e) {
        next(e);
    }
});
customersRouter.post(
    '/',
    authenticated,
    aclAuthenticated,
    async (req: Req, res: Res, next: any) => {
        try {
            const job_number = req.session.passport.user;
            const customer = await createCustomer(job_number, req.body);
            res.apiSuccess(customer);
        } catch (e) {
            next(e);
        }
    },
);

customersRouter.post(
    '/departmentCustomers',
    authenticated,
    aclAuthenticated,
    async (req: Req, res: Res, next: any) => {
        try {
            const job_number = req.session.passport.user;
            const customer = await createDepartmentCustomer(job_number, req.body);
            res.apiSuccess(customer);
        } catch (e) {
            next(e);
        }
    },
);

customersRouter.put(
    '/departmentCustomers/:departmentCustomerId',
    authenticated,
    async (req: Req, res: Res, next: any) => {
        try {
            const { departmentCustomerId } = req.params;
            const job_number = req.session.passport.user;

            const customer = await updateDepartmentCustomer(
                job_number,
                departmentCustomerId,
                req.body,
            );
            res.apiSuccess(customer);
        } catch (e) {
            next(e);
        }
    },
);

customersRouter.put('/:customerId', authenticated, async (req: Req, res: Res, next: any) => {
    try {
        const { customerId } = req.params;
        const job_number = req.session.passport.user;
        const customer = await updateCustomer(job_number, customerId, req.body);
        res.apiSuccess(customer);
    } catch (e) {
        next(e);
    }
});

customersRouter.get('/mock', async (req: Req, res: Res, next: any) => {
    try {
        const { number = 10 } = req.query;
        await mockCustomers(number);
        res.apiSuccess();
    } catch (e) {
        next(e);
    }
});
export default customersRouter;
