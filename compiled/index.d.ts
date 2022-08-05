import { PouchDB } from '../index';
export declare type EmptyDocument = Object;
export declare type EmptyDocuments = EmptyDocument[];
export declare type NewDocument = EmptyDocument & PouchDB.Core.IdMeta;
export declare type NewDocuments = NewDocument[];
export declare type AllDocsMeta = PouchDB.Core.AllDocsMeta;
export declare type PouchDoc = PouchDB.Core.Document<any>;
export declare type PouchDocs = PouchDoc[];
export declare type ExistingDocument = PouchDB.Core.ExistingDocument<PouchDoc>;
export declare type ExistingDocuments = ExistingDocument[];
export declare type PouchDocId = PouchDB.Core.DocumentId;
export declare type PouchDocIds = PouchDocId[];
export declare type PouchDocKey = PouchDB.Core.DocumentKey;
export declare type PouchDocRev = PouchDB.Core.RevisionId;
export declare type PouchDocError = PouchDB.Core.Error;
export declare type AllDocsResponseGeneric = PouchDB.Core.AllDocsResponse<PouchDoc>;
export declare type AllDocsResponseErrorRow = PouchDB.Core.AllDocsResponseErrorRow<PouchDoc>;
export declare type AllDocsResponseRow = PouchDB.Core.AllDocsResponseRow<PouchDoc>;
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
        };
    } | {
        key: PouchDocKey;
        error: PouchDB.Core.Error;
    }>;
}
export interface AllDocsOpts extends PouchDB.Core.AllDocsWithKeysOptions {
    keys: PouchDocIds;
}
export interface BulkGetOpts extends PouchDB.Core.BulkGetOptions {
}
export interface BulkGetResponse extends PouchDB.Core.BulkGetResponse<PouchDoc> {
}
export interface BulkUpsertOptions {
    replace?: boolean;
}
export interface BulkUpsertResponse extends AllDocsResponse {
    replace?: boolean;
}
export declare const upsertBulk: (docs: PouchDocs, opts?: BulkUpsertOptions) => Promise<BulkUpsertResponse | PouchDocError[] | Response[]>;
