import { aop } from '../../../src';

export default class test {
    constructor (logger, context) {
        this.context = context;
        this.logger = logger;
    }

    @aop('testAop')
    getName (name) {
        this.logger.info(name);
    }
}
