import moment from 'moment';

// mock data

export function getVisitData() {
    const beginDay = new Date().getTime();
    const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
    const visitData = [];
    for (let i = 0; i < fakeY.length; i += 1) {
        visitData.push({
            x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
            y: fakeY[i],
        });
    }
    return visitData;
}

export function getSalesData() {
    const salesData = [];
    for (let i = 0; i < 12; i += 1) {
        salesData.push({
            x: `${i + 1}月`,
            y: Math.floor(Math.random() * 1000) + 200,
        });
    }
    return salesData;
}
