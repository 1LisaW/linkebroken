"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const path = require("path");
const config_1 = require("../src/config");
const assertRejects = require('assert-rejects');
describe('config', () => {
    it('should allow passing no config', async () => {
        const cfg = {
            format: 'json',
            recurse: true,
            silent: true,
            skip: '🌳',
            concurrency: 22,
        };
        const config = await config_1.getConfig(cfg);
        assert.deepStrictEqual(config, cfg);
    });
    it('should throw with a reasonable message if the path doesnt exist', async () => {
        const cfg = {
            config: '/path/does/not/exist',
        };
        await assertRejects(config_1.getConfig(cfg), /ENOENT: no such file or directory/);
    });
    it('should allow reading from a config file', async () => {
        const configPath = path.resolve('test/fixtures/config/linkinator.config.json');
        const expected = require(configPath);
        const config = await config_1.getConfig({ config: configPath });
        delete config.config;
        assert.deepStrictEqual(config, expected);
    });
    it('should merge config settings from the CLI and object', async () => {
        const configPath = path.resolve('test/fixtures/config/linkinator.config.json');
        const expected = require(configPath);
        expected.skip = 'loo';
        const config = await config_1.getConfig({
            config: configPath,
            skip: 'loo',
        });
        delete config.config;
        assert.deepStrictEqual(config, expected);
    });
});
//# sourceMappingURL=test.config.js.map