var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
export const upsertBulk = function (docs, opts) {
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
                let errorRow;
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
//# sourceMappingURL=index.js.map