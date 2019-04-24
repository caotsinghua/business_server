const aclConfig: any[] = [
    {
        roles: ['leader'], //银行leader
        allows: [
            {
                resources: ['/banks/:bankId'],
                permissions: '*',
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
                resources: '*',
                permissions: '*',
            },
        ],
    },
];
export default aclConfig;
