import session from 'koa-session';

export default (monking) => {
    monking.keys = monking.config.session.keys;
    return session(monking.config.session.options, monking);
};
