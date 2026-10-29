const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { dashboardService } = require('../services');

const getDashboard = asyncHandler(async (_req, res) => {
    const stats = await dashboardService.getDashboard();
    res.status(200).json(new ApiResponse(200, stats, 'Dashboard fetched successfully'));
});

module.exports = {
    getDashboard,
};
