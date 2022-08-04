import { PouchDB } from '../index';

export type EmptyDocument = Object;
export type EmptyDocuments = EmptyDocument[];
export type NewDocument = EmptyDocument & PouchDB.Core.IdMeta;
export type NewDocuments = NewDocument[];
export type AllDocsMeta = PouchDB.Core.AllDocsMeta;
export type PouchDoc = PouchDB.Core.Document<any>;
export type PouchDocs = PouchDoc[];
export type ExistingDocument = PouchDB.Core.ExistingDocument<PouchDoc>;
export type ExistingDocuments = ExistingDocument[];
export type PouchDocId = PouchDB.Core.DocumentId;
export type PouchDocIds = PouchDocId[];
export type PouchDocKey = PouchDB.Core.DocumentKey;
export type PouchDocRev = PouchDB.Core.RevisionId;
export type PouchDocError = PouchDB.Core.Error;
export type AllDocsResponseGeneric = PouchDB.Core.AllDocsResponse<PouchDoc>;
export type AllDocsResponseErrorRow = PouchDB.Core.AllDocsResponseErrorRow<PouchDoc>;
export type AllDocsResponseRow = PouchDB.Core.AllDocsResponseRow<PouchDoc>;
;
export interface AllDocsResponse {
  /** The `skip` if provided, or in CouchDB the actual offset */
  offset: number;
  total_rows: number;
  update_seq?: number | string | undefined;
  rows: Array<{
      /** Only present if `include_docs` was `true`. */
      doc?: PouchDB.Core.ExistingDocument<PouchDoc & AllDocsMeta> | undefined;
      id: PouchDocId;
      key: PouchDocKey;
      value: {
          rev: PouchDocRev;
          deleted?: boolean | undefined;
      }
  }|{ key: PouchDocKey, error: PouchDB.Core.Error }>;
}

export interface AllDocsOpts extends PouchDB.Core.AllDocsWithKeysOptions {
  keys: PouchDocIds;
}

export interface BulkGetOpts extends PouchDB.Core.BulkGetOptions {
}

export interface BulkGetResponse extends PouchDB.Core.BulkGetResponse<PouchDoc> {
}

export interface BulkUpsertOptions {
  replace ?: boolean;
}

export interface BulkUpsertResponse extends AllDocsResponse {
  replace ?: boolean;
}

const upsertBulk = async function(docs:PouchDocs, opts?:BulkUpsertOptions ):Promise<BulkUpsertResponse|PouchDocError[]|Response[]> {
  const self:PouchDB.Database = this;
  const allDocsOpts:AllDocsOpts = {
    keys: docs.map(doc => doc._id)
  }
  // const bulkGetOpts:BulkGetOpts = {
  //   docs: docs.map(doc => doc._id)
  // }
  let bulkUpsertOpts = opts != null ? opts : {};

  if (!opts.replace) {
    allDocsOpts.include_docs = true
    // bulkGetOpts.include_docs = true
  }

  return self.allDocs(allDocsOpts)
  // .then(res => res.results.map(doc => {
  // return self.bulkGet(bulkGetOpts)
    .then(res => docs.map(doc => {
      // const row = res.rows.find(r => (r as AllDocsResponseRow).id === doc._id)
      let goodRow:AllDocsResponseRow;
      let errorRow:AllDocsResponseErrorRow;
      const row = res.rows.find(r => {
        let innerGoodRow:AllDocsResponseRow;
        let innerErrorRow:AllDocsResponseErrorRow;
        if(r.hasOwnProperty('error')) {
          innerErrorRow = (r as AllDocsResponseErrorRow);
          return innerErrorRow.key === doc._id;
        } else {
          innerGoodRow = (r as AllDocsResponseRow);
          return innerGoodRow.id === doc._id;
        }
      });
      if(!row || row.hasOwnProperty('error')) {
        return doc;
      } else {
        goodRow = (row as AllDocsResponseRow);
      }
      if(!opts.replace) {
        return Object.assign({}, goodRow.doc, doc)
      } else {
        return Object.assign({}, doc, {
          _rev: goodRow.value.rev
        })
      }
    }))
    .then(docs => {
      // let goodDocs:BulkDocs = docs.filter(r => r._id)
      return self.bulkDocs(docs);
    });
  };

