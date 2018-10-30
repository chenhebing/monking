import mongoose from 'mongoose';
import extend from 'extend2';

import { importFiles } from '../util';

export default monking => {
    const modelPath = monking.config.path.models;
    mongoose.connect(monking.config.mongodb.url, monking.config.mongodb.options);
    mongoose.connection.once('open', () => {
        const models = importFiles(modelPath, 'index');
        monking.model = monking.model || {};
        const createModel = (name, schema) => {
            return mongoose.model(name, schema);
        };
        const createSchema = (obj = {}, options = {}) => {
            return new mongoose.Schema(extend(true, {}, obj, monking.config.mongodb.defaultSchema.schema), extend(true, {}, options, monking.config.mongodb.defaultSchema.options));
        };
        Object.keys(models).forEach(model => {
            monking.model[model.replace('Index', '')] = models[model]({
                createModel,
                createSchema,
                Schema: mongoose.Schema
            });
        });
        monking.appLogger.info('mongodb opened');
    });
    mongoose.connection.once('error', (err) => {
        monking.appLogger.error('mongodb connnet error: ', err.message);
    });
    monking.modelServices = importFiles(modelPath, 'model');
    return async (ctx, next) => {
        Object.keys(monking.modelServices).forEach(name => {
            ctx.$injector.register(name, monking.modelServices[name]);
        });
        await next();
    };
};
