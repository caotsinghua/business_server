import Mock from 'mockjs';

export function mockCustomerAccount() {
    const data = Mock.mock({
        'register_time|1': '@datetime', //账户注册时间
        'type|1': ['基本户', '一般户', '临时户', '专用户'], // 类型
        'points|0-9999': 1, //积分
        'debt|0-9999999': 1, //欠款
        'deposit|0-9999999': 1, //存款
        'loan|0-9999999': 1, //贷款
        'income|0-9999999': 1, //年收入
        'back_ability|1': ['强', '中', '弱'], //偿债能力
        'creadit_level|1': ['高', '中', '低'], //信用级别
        'danger_level|1': ['安全可靠', '中规中矩', '有风险', '风险很大'], //风险级别
        'remain|0-9999999': 1, //余额
    });
    return data;
}

export function mockDepartmentAccount() {
    const data = Mock.mock({
        'register_time|1': '@datetime', //账户注册时间
        register_money: '@integer(1000000, 100000000)', //注册资金
        'points|100-99999': 1, //积分
        debt: '@integer(0, 999999999)', //欠款
        'deposit|0-9999999': 1, //存款,
        loan: '@integer(0, 999999999)', //贷款
        income: '@integer(0, 999999999)', //年收入
        profit: '@integer(0, 999999999)', //年利润
        'back_ability|1': ['强', '中', '弱'], //偿债能力
        'creadit_level|1': ['高', '中', '低'], //信用级别
        'danger_level|1': ['安全可靠', '中规中矩', '有风险', '风险很大'], //风险级别
        remain: '@integer(1000000, 100000000000)', //固定资产
    });
    return data;
}
