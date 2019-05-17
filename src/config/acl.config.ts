const aclConfig: any[] = [
    {
        roles: ['leader'], //银行leader
        allows: [
            {
                resources: ['/banks/:bankId', '/groupModels', '/activities'],
                permissions: ['post', 'get', 'delete', 'put'],
            },
        ],
    },
    {
        roles: ['verifyer'], // 审核员
        allows: [
            {
                resources: '/kids/byParent',
                permissions: ['get'],
            },
        ],
    },
    {
        roles: ['manager'], // 客户经理
        allows: [
            {
                resources: [
                    '/upload/uploadCustomers',
                    '/upload/saveUploadedCustomers',
                    '/upload/saveUploadedDepartmentCustomers',
                ],
                permissions: ['post'],
            },
        ],
    },
];
export default aclConfig;
