export enum SEX {
    MALE = 'male',
    FEMALE = 'female',
}
// 审核状态
export enum VERIFY_STATUS {
    UNVERIFIED = 'unverified', //未审核
    PASS = 'pass', //通过
    NOPASS = 'nopass', //不通过
    VERIFYING = 'verifying', //审批中
}

// 活动状态
export enum ACTIVITY_STATUS {
    CREATED = 'created', //未开始
    ONLINE = 'online', //进行中，上线
    OFFLINE = 'offline', //下线，已结束
}
