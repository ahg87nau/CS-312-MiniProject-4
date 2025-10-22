import { MemoryDAO } from './memory.js';
import { PostgresDAO } from './postgres.js';


export function createDAO({ useDb, pgPool }) {
return useDb ? new PostgresDAO(pgPool) : new MemoryDAO();
}