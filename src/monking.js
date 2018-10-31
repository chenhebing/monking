import Koa from 'koa';

import Config from './config';
import MiddleWare from './middleware';

export default class MonKing extends Koa {
    constructor () {
        super();
        this.config = Config;
        this.init();
        return this;
    }

    async init () {
        const middlewares = await MiddleWare(this);
        this.use(middlewares);
    }
}
