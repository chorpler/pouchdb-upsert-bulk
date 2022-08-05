'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const upsertBulk = function (docs, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const self = this;
        const allDocsOpts = {
            keys: docs.map(doc => doc._id),
            include_docs: true,
        };
        // const bulkGetOpts:BulkGetOpts = {
        //   docs: docs.map(doc => doc._id)
        // }
        // let bulkUpsertOpts = opts != null ? opts : {};
        if (opts != null && opts.replace) {
            allDocsOpts.include_docs = false;
            // bulkGetOpts.include_docs = true
        }
        return self.allDocs(allDocsOpts).then(res => {
            // .then(res => res.results.map(doc => {
            // return self.bulkGet(bulkGetOpts)
            return docs.map(doc => {
                // const row = res.rows.find(r => (r as AllDocsResponseRow).id === doc._id)
                let goodRow;
                const row = res.rows.find(r => {
                    let innerGoodRow;
                    let innerErrorRow;
                    if (r.hasOwnProperty('error')) {
                        innerErrorRow = r;
                        return innerErrorRow.key === doc._id;
                    }
                    else {
                        innerGoodRow = r;
                        return innerGoodRow.id === doc._id;
                    }
                });
                if (!row || row.hasOwnProperty('error')) {
                    return doc;
                }
                else {
                    goodRow = row;
                }
                if (!opts.replace) {
                    return Object.assign({}, goodRow.doc, doc);
                }
                else {
                    return Object.assign({}, doc, {
                        _rev: goodRow.value.rev
                    });
                }
            });
        }).then(docs => {
            // let goodDocs:BulkDocs = docs.filter(r => r._id)
            return self.bulkDocs(docs);
        });
    });
};

exports.upsertBulk = upsertBulk;
