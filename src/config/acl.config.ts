const aclConfig: any[] = [
    {
        roles: ['root_bank_leader'], //总行leader
        allows: [
            {
                resources: ['/kids/:kidId/createCard'],
                permissions: '*',
            },
        ],
    },
    {
        roles: ['bank_leader'], // 分行leader
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
