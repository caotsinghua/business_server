import Mock from 'mockjs';

export function mockCustomer() {
    const data = Mock.mock({
        work: '@string(3,5)',
        job: '@string(3,5)',
        'certificate_type|1': ['护照', '身份证'],
        certificate_number: "@string('number',11)",
        title: '@string(3,5)',
        name: '@string(3,5)',
        'sex|1': ['male', 'female'],
        'education_degree|1': ['本科', '硕士', '博士'],
        'marry_status|1': ['已婚', '未婚'],
        household: '@city(true)',
        work_time: '@natural(0,10)',
        birthday: '@date()',
        description: '@string(5,10)',
        email: "@email('tssword')",
        address: '@city(true)',
        phone_number: '@string("number",11)',
    });
    return data;
}

export function mockDepartment() {
    const data = Mock.mock({
        name: '@string(3,5)',
        'type|1': ['私营企业', '国营企业', '外资企业'],
        contact_person: '@string(3,4)',
        owner: '@string(3,4)',
        phone_number: '@string("number",11)',
        description: '@string(5,10)',
    });
    return data;
}
