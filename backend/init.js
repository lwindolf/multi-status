globalThis.window = globalThis;

import { JSDOM } from 'jsdom';

// feed-parser requires DOMParser
const jsdom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
globalThis.window = jsdom.window;
globalThis.document = jsdom.window.document;
globalThis.DOMParser = jsdom.window.DOMParser;