import Koa from 'koa';

import Config from './config';
import MiddleWare from './middleware';

export default class MonKing extends Koa {
    constructor () {
        super();
        this.config = Config;
        this.use(MiddleWare(this));
        return this;
    }
}
