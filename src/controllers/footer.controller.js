const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { footerService } = require('../services');

function toFooter(footer) {
    const data = typeof footer.toObject === 'function' ? footer.toObject() : footer;
    return {
        id: String(data._id || data.id || ''),
        instituteName: data.instituteName || '',
        tagline: data.tagline || '',
        quickLinks: (data.quickLinks || []).map((link) => ({
            id: String(link._id || link.id),
            label: link.label || '',
            href: link.href || '',
        })),
        popularCourses: (data.popularCourses || []).map((course) => ({
            id: String(course._id || course.id),
            label: course.label || '',
            href: course.href || '',
        })),
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        youtube: data.youtube || '',
        copyright: data.copyright || '',
    };
}

const getFooter = asyncHandler(async (_req, res) => {
    const footer = await footerService.getFooter();
    res.status(200).json(new ApiResponse(200, { footer: toFooter(footer) }, 'Footer fetched successfully'));
});

const updateFooter = asyncHandler(async (req, res) => {
    const footer = await footerService.updateFooter(req.body);
    res.status(200).json(new ApiResponse(200, { footer: toFooter(footer) }, 'Footer updated successfully'));
});

module.exports = {
    getFooter,
    updateFooter,
};
