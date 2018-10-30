import escape from 'escape-html';
import { parse } from 'url';
import 'typeis';

export default (context, config) => {
    const validateUrl = (url) => {
        const { redirectWhiteList } = config;
        const { hostname } = parse(url);
        if (!hostname) {
            return true;
        }
        return redirectWhiteList.some(whiteUrl => {
            if (whiteUrl.typeis('String')) {
                return hostname === whiteUrl;
            }
            if (whiteUrl.typeis('RegExp')) {
                return whiteUrl.test(hostname);
            }
            return false;
        });
    };
    const safeRedirect = (url, alt) => {
        if (url === 'back') {
            url = context.get('Referrer') || alt || '/';
        }
        url = url || '/';
        if (!validateUrl(url)) {
            return context.throw(403);
        }
        context.redirect(url, alt);
    };
    const isEmptyObject = (obj) => {
        if (Object.prototype.toString.call(obj) !== '[object Object]') return false;
        return Object.keys(obj).length === 0;
    };
    const isEmptyArr = (obj) => {
        if (Object.prototype.toString.call(obj) !== '[object Array]') return false;
        return obj.length === 0;
    };
    const isEmptyString = (str) => {
        if (typeof str !== 'string') return false;
        return !str.trim();
    };
    const validateNotEmpty = value => !(isEmptyString(value) || isEmptyObject(value) || isEmptyArr(value) || typeof value === 'undefined' || typeof value === 'boolean' || value === null);
    return {
        escape,
        safeRedirect,
        isEmptyObject,
        isEmptyArr,
        isEmptyString,
        validateNotEmpty
    };
};
