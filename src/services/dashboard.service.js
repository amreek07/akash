const { Response, Course, Partner } = require('../model');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TYPES = ['registration', 'enquiry', 'general'];
const TIMEZONE = 'Asia/Kolkata';

function currentYear() {
    const year = new Intl.DateTimeFormat('en', { timeZone: TIMEZONE, year: 'numeric' }).format(new Date());
    return Number(year);
}

function emptyMonths() {
    return MONTHS.map((label, index) => ({
        month: index + 1,
        label,
        registration: 0,
        enquiry: 0,
        general: 0,
        total: 0,
    }));
}

const getDashboard = async () => {
    const year = currentYear();
    const start = new Date(Date.UTC(year, 0, 1) - 24 * 60 * 60 * 1000);
    const end = new Date(Date.UTC(year + 1, 0, 2));

    const [registrationCount, courseTotal, courseActive, partnerTotal, partnerActive, grouped] = await Promise.all([
        Response.countDocuments({ responseType: 'registration' }),
        Course.countDocuments(),
        Course.countDocuments({ isActive: true }),
        Partner.countDocuments(),
        Partner.countDocuments({ status: 'active' }),
        Response.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lt: end },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $dateToString: { format: '%m', date: '$createdAt', timezone: TIMEZONE } },
                        year: { $dateToString: { format: '%Y', date: '$createdAt', timezone: TIMEZONE } },
                        type: '$responseType',
                    },
                    total: { $sum: 1 },
                },
            },
        ]),
    ]);

    const months = emptyMonths();
    grouped.forEach((row) => {
        if (Number(row._id.year) !== year) return;
        const index = Number(row._id.month) - 1;
        const type = row._id.type;
        if (index < 0 || index > 11 || !TYPES.includes(type)) return;
        months[index][type] = row.total;
    });
    months.forEach((month) => {
        month.total = month.registration + month.enquiry + month.general;
    });

    return {
        year,
        registrations: registrationCount,
        courses: {
            total: courseTotal,
            active: courseActive,
        },
        partners: {
            total: partnerTotal,
            active: partnerActive,
        },
        months,
    };
};

module.exports = {
    getDashboard,
};
