import CSRF from 'koa-csrf';

export default monking => new CSRF(monking.config.csrf);
