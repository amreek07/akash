const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { partnerService } = require('../services');

function toPartner(partner) {
    const data = typeof partner.toObject === 'function' ? partner.toObject() : partner;
    const status = data.status === 'inactive' ? 'inactive' : 'active';
    return {
        id: String(data._id || data.id || ''),
        partnerId: data.partnerId || '',
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        status,
        isActive: status === 'active',
        createdAt: data.createdAt || null,
    };
}

const createPartner = asyncHandler(async (req, res) => {
    const partner = await partnerService.createPartner(req.body);
    res.status(201).json(new ApiResponse(201, { partner: toPartner(partner) }, 'Partner created successfully'));
});

const getAllPartners = asyncHandler(async (req, res) => {
    const { search, page, limit, status } = req.query;
    const { partners, pagination, counts } = await partnerService.getAllPartners(
        { search, status },
        { page: Number(page) || 1, limit: Number(limit) || 50 },
    );
    res.status(200).json(
        new ApiResponse(
            200,
            { partners: partners.map(toPartner), pagination, counts },
            'Partners fetched successfully',
        ),
    );
});

const getPartnerById = asyncHandler(async (req, res) => {
    const partner = await partnerService.getPartnerById(req.params.id);
    res.status(200).json(new ApiResponse(200, { partner: toPartner(partner) }, 'Partner fetched successfully'));
});

const updatePartner = asyncHandler(async (req, res) => {
    const partner = await partnerService.updatePartner(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, { partner: toPartner(partner) }, 'Partner updated successfully'));
});

const deletePartner = asyncHandler(async (req, res) => {
    await partnerService.deletePartner(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Partner deleted successfully'));
});

module.exports = {
    createPartner,
    getAllPartners,
    getPartnerById,
    updatePartner,
    deletePartner,
};
