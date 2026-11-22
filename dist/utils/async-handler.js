export const asyncHandler = (controller) => (req, res, next) => {
    void controller(req, res, next).catch(next);
};
//# sourceMappingURL=async-handler.js.map