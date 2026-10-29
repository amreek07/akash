const { Partner } = require('../model');
const ApiError = require('../utils/ApiError');
const { isValidObjectId } = require('mongoose');

function resolveStatus(payload) {
    if (payload.status === 'active' || payload.status === 'inactive') {
        return {
            status: payload.status,
            isActive: payload.status === 'active',
        };
    }
    const isActive = payload.isActive !== false;
    return {
        status: isActive ? 'active' : 'inactive',
        isActive,
    };
}

async function nextPartnerId() {
    const year = new Date().getFullYear();
    const prefix = `CHI-P-${year}-`;
    const existing = await Partner.find({ partnerId: { $regex: `^${prefix}` } }).select('partnerId');
    const highest = existing.reduce((max, partner) => {
        const sequence = Number(String(partner.partnerId).slice(prefix.length));
        return Number.isFinite(sequence) ? Math.max(max, sequence) : max;
    }, 0);
    return `${prefix}${String(highest + 1).padStart(3, '0')}`;
}

const createPartner = async (payload) => {
    const email = String(payload.email || '').trim().toLowerCase();
    const existingEmail = await Partner.findOne({ email });
    if (existingEmail) {
        throw new ApiError(400, 'A partner with this email already exists');
    }

    const flags = resolveStatus(payload);
    const partner = await Partner.create({
        partnerId: await nextPartnerId(),
        name: String(payload.name || '').trim(),
        email,
        phone: String(payload.phone || '').trim(),
        address: String(payload.address || '').trim(),
        city: String(payload.city || '').trim(),
        ...flags,
    });
    if (!partner) {
        throw new ApiError(400, 'Failed to create partner');
    }
    return partner;
};

const getAllPartners = async (filter = {}, options = {}) => {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 50);
    const skip = (page - 1) * limit;
    const query = {};

    if (filter.status === 'active' || filter.status === 'inactive') {
        query.status = filter.status;
    }
    if (filter.search) {
        const regex = { $regex: filter.search, $options: 'i' };
        query.$or = [
            { name: regex },
            { email: regex },
            { phone: regex },
            { city: regex },
            { partnerId: regex },
        ];
    }

    const partners = await Partner.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Partner.countDocuments(query);
    const totalPages = Math.ceil(total / limit) || 1;
    const [active, inactive] = await Promise.all([
        Partner.countDocuments({ status: 'active' }),
        Partner.countDocuments({ status: 'inactive' }),
    ]);

    return {
        partners,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
        counts: {
            all: active + inactive,
            active,
            inactive,
        },
    };
};

const getPartnerById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid partner ID');
    }
    const partner = await Partner.findById(id);
    if (!partner) {
        throw new ApiError(404, 'Partner not found');
    }
    return partner;
};

const updatePartner = async (id, payload) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid partner ID');
    }
    const email = String(payload.email || '').trim().toLowerCase();
    const existingEmail = await Partner.findOne({ email, _id: { $ne: id } });
    if (existingEmail) {
        throw new ApiError(400, 'A partner with this email already exists');
    }

    const flags = resolveStatus(payload);
    const partner = await Partner.findByIdAndUpdate(
        id,
        {
            name: String(payload.name || '').trim(),
            email,
            phone: String(payload.phone || '').trim(),
            address: String(payload.address || '').trim(),
            city: String(payload.city || '').trim(),
            ...flags,
        },
        { new: true },
    );
    if (!partner) {
        throw new ApiError(404, 'Partner not found');
    }
    return partner;
};

const deletePartner = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid partner ID');
    }
    const partner = await Partner.findByIdAndDelete(id);
    if (!partner) {
        throw new ApiError(404, 'Partner not found');
    }
    return partner;
};

module.exports = {
    createPartner,
    getAllPartners,
    getPartnerById,
    updatePartner,
    deletePartner,
};
