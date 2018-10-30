export default async (context, logger) => {
    return async (target) => {
        logger.info(target);
        const result = await context.$injector.invoke(target);
        logger.info(result);
    };
};
