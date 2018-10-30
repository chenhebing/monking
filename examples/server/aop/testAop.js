export default async (context, logger) => {
    return async (target) => {
        await target();
    };
};
