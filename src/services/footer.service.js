const { Footer } = require('../model');
const { isValidObjectId } = require('mongoose');

const defaultFooter = {
    instituteName: 'Coding Hubs Institute',
    tagline:
        "Punjab's trusted institute for Computer Education, University Degrees & Career Building since 2015.",
    quickLinks: [
        { label: 'About Us', href: '/about' },
        { label: 'Courses', href: '/courses' },
        { label: 'Admission', href: '/admission' },
        { label: 'Gallery', href: '/gallery' },
        { label: 'Contact', href: '/contact' },
    ],
    popularCourses: [
        { label: 'DCA / ADCA / PGDCA' },
        { label: 'Web & Graphic Designing' },
        { label: 'Digital Marketing' },
        { label: 'BCA / MCA / MBA' },
        { label: 'BA / B.Com / B.Sc' },
    ],
    address: 'Main Bazar, Punjab, India',
    phone: '+91 79735-54990',
    email: 'info@codinghubs.in',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    copyright: '© 2026 Coding Hubs Institute. All rights reserved.',
};

function mapList(items = []) {
    return items.map((item) => {
        const next = {
            label: item.label,
            href: item.href || '',
        };
        if (item.id && isValidObjectId(item.id)) next._id = item.id;
        if (item._id && isValidObjectId(item._id)) next._id = item._id;
        return next;
    });
}

const getFooter = async () => {
    let footer = await Footer.findOne().sort({ createdAt: 1 });
    if (!footer) {
        footer = await Footer.create(defaultFooter);
    }
    return footer;
};

const updateFooter = async (payload) => {
    const footer = await getFooter();
    footer.instituteName = payload.instituteName;
    footer.tagline = payload.tagline;
    footer.address = payload.address || '';
    footer.phone = payload.phone || '';
    footer.email = payload.email || '';
    footer.facebook = payload.facebook || '';
    footer.instagram = payload.instagram || '';
    footer.youtube = payload.youtube || '';
    footer.copyright = payload.copyright || '';
    footer.quickLinks = mapList(payload.quickLinks);
    footer.popularCourses = mapList(payload.popularCourses);
    await footer.save();
    return footer;
};

module.exports = {
    getFooter,
    updateFooter,
};
