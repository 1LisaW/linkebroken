/// <reference types="node" />
import { EventEmitter } from 'events';
import { AttributeRules } from './links';
export interface CheckOptions {
    concurrency?: number;
    port?: number;
    path: string;
    recurse?: boolean;
    linksToSkip?: string[] | ((link: string) => Promise<boolean>);
    linksAttributes?: AttributeRules;
}
export declare enum LinkState {
    OK = "OK",
    BROKEN = "BROKEN",
    SKIPPED = "SKIPPED"
}
export interface LinkResult {
    url: string;
    originalUri?: string;
    status?: number;
    state: LinkState;
    parent?: string;
}
export interface CrawlResult {
    passed: boolean;
    links: LinkResult[];
}
/**
 * Instance class used to perform a crawl job.
 */
export declare class LinkChecker extends EventEmitter {
    /**
     * Crawl a given url or path, and return a list of visited links along with
     * status codes.
     * @param options Options to use while checking for 404s
     */
    check(options: CheckOptions): Promise<{
        links: LinkResult[];
        passed: boolean;
    }>;
    /**
     * Spin up a local HTTP server to serve static requests from disk
     * @param root The local path that should be mounted as a static web server
     * @param port The port on which to start the local web server
     * @private
     * @returns Promise that resolves with the instance of the HTTP server
     */
    private startWebServer;
    /**
     * Crawl a given url with the provided options.
     * @pram opts List of options used to do the crawl
     * @private
     * @returns A list of crawl results consisting of urls and status codes
     */
    private crawl;
}
/**
 * Convenience method to perform a scan.
 * @param options CheckOptions to be passed on
 */
export declare function check(options: CheckOptions): Promise<{
    links: LinkResult[];
    passed: boolean;
}>;
