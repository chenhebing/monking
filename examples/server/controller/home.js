import { Get, aopInject } from '../../../src';

export default class Home {
    @Get('/test')
    @aopInject('whiteList')
    async test (context, test) {
        test.getName('test');
        context.body = 1234;
        return 'testaop';
    }
}
