import { MongoClient, type Db } from "mongodb";
export declare function connectDatabase(): Promise<void>;
export declare function getMongoClient(): MongoClient;
export declare function getDatabase(): Db;
export declare function disconnectDatabase(): Promise<void>;
export declare function createDatabaseIndexes(): Promise<void>;
