/// <reference types="node" />
import { URL } from 'url';
export interface AttributeRules {
    [index: string]: string[];
}
export declare function getBaseLinkAttributes(): AttributeRules;
export interface ParsedUrl {
    link: string;
    error?: Error;
    url?: URL;
}
export declare function getLinks(source: string, baseUrl: string, linksAttr: AttributeRules): ParsedUrl[];
