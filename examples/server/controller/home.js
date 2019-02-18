import { Get, aopInject, Post } from '../../../src';

export default class Home {
    @Get('/test')
    @aopInject('whiteList')
    async test (context, test) {
        test.getName('test');
        context.body = 1234;
        return 'testaop';
    }
    @Post('/api/test')
    async apiTest (body, logger, context) {
        logger.info(body);
        context.body = body;
    }
}
