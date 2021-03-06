#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meow = require("meow");
const updateNotifier = require("update-notifier");
const chalk = require("chalk");
const index_1 = require("./index");
const util_1 = require("util");
const config_1 = require("./config");
const toCSV = util_1.promisify(require('jsonexport'));
const pkg = require('../../package.json');
updateNotifier({ pkg }).notify();
const cli = meow(`
    Usage
      $ linkinator LOCATION [ --arguments ]

    Positional arguments

      LOCATION
        Required. Either the URL or the path on disk to check for broken links.

    Flags
      --config
          Path to the config file to use. Looks for \`linkinator.config.json\` by default.

      --concurrency
          The number of connections to make simultaneously. Defaults to 100.

      --recurse, -r
          Recursively follow links on the same root domain.

      --skip, -s
          List of urls in regexy form to not include in the check.

      --format, -f
          Return the data in CSV or JSON format.

      --silent
          Only output broken links

      --help
          Show this command.

    Examples
      $ linkinator docs/
      $ linkinator https://www.google.com
      $ linkinator . --recurse
      $ linkinator . --skip www.googleapis.com
      $ linkinator . --format CSV
`, {
    flags: {
        config: { type: 'string' },
        concurrency: { type: 'string' },
        recurse: { type: 'boolean', alias: 'r', default: undefined },
        skip: { type: 'string', alias: 's' },
        format: { type: 'string', alias: 'f' },
        silent: { type: 'boolean', default: undefined },
    },
});
let flags;
async function main() {
    if (cli.input.length !== 1) {
        cli.showHelp();
        return;
    }
    flags = await config_1.getConfig(cli.flags);
    const start = Date.now();
    if (!flags.silent) {
        log(`🏊‍♂️ crawling ${cli.input}`);
    }
    const checker = new index_1.LinkChecker();
    // checker.on('pagestart', url => {
    //   if (!flags.silent) {
    //     log(`\n Scanning ${chalk.grey(url)}`);
    //   }
    // });
    checker.on('link', (link) => {
        if (flags.silent && link.state !== index_1.LinkState.BROKEN) {
            return;
        }
        let state = '';
        switch (link.state) {
            case index_1.LinkState.BROKEN:
                state = `[${chalk.red(link.status.toString())}]`;
                break;
            case index_1.LinkState.OK:
                state = `[${chalk.green(link.status.toString())}]`;
                break;
            case index_1.LinkState.SKIPPED:
                state = `[${chalk.grey('SKP')}]`;
                break;
            default:
                throw new Error('Invalid state.');
        }
        log(`${state} ${chalk.gray(link.url)}`);
    });
    const opts = {
        path: cli.input[0],
        recurse: flags.recurse,
        concurrency: Number(flags.concurrency),
    };
    if (flags.skip) {
        if (typeof flags.skip === 'string') {
            opts.linksToSkip = flags.skip.split(' ').filter(x => !!x);
        }
        else if (Array.isArray(flags.skip)) {
            opts.linksToSkip = flags.skip;
        }
    }
    const result = await checker.check(opts);
    log();
    const format = flags.format ? flags.format.toLowerCase() : null;
    if (format === 'json') {
        console.log(JSON.stringify(result, null, 2));
        return;
    }
    else if (format === 'csv') {
        const csv = await toCSV(result.links);
        console.log(csv);
        return;
    }
    else {
        const parents = result.links.reduce((acc, curr) => {
            if (!flags.silent || curr.state === index_1.LinkState.BROKEN) {
                const parent = curr.parent || '';
                if (!acc[parent]) {
                    acc[parent] = [];
                }
                acc[parent].push(curr);
            }
            return acc;
        }, {});
        Object.keys(parents).forEach(parent => {
            const links = parents[parent];
            log(chalk.blue(parent));
            links.forEach(link => {
                if (flags.silent && link.state !== index_1.LinkState.BROKEN) {
                    return;
                }
                let state = '';
                switch (link.state) {
                    case index_1.LinkState.BROKEN:
                        state = `[${chalk.red(link.status.toString())}]`;
                        break;
                    case index_1.LinkState.OK:
                        state = `[${chalk.green(link.status.toString())}]`;
                        break;
                    case index_1.LinkState.SKIPPED:
                        state = `[${chalk.grey('SKP')}]`;
                        break;
                    default:
                        throw new Error('Invalid state.');
                }
                log(`  ${state} ${chalk.gray(link.url)}`);
            });
        });
    }
    const total = (Date.now() - start) / 1000;
    if (!result.passed) {
        const borked = result.links.filter(x => x.state === index_1.LinkState.BROKEN);
        console.error(chalk.bold(`${chalk.red('ERROR')}: Detected ${borked.length} broken links. Scanned ${chalk.yellow(result.links.length.toString())} links in ${chalk.cyan(total.toString())} seconds.`));
        process.exit(1);
    }
    log(chalk.bold(`🤖 Successfully scanned ${chalk.green(result.links.length.toString())} links in ${chalk.cyan(total.toString())} seconds.`));
}
function log(message = '\n') {
    if (!flags.format) {
        console.log(message);
    }
}
main();
//# sourceMappingURL=cli.js.map