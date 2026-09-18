import { randomUUID } from "node:crypto";
import { chmodSync, existsSync, mkdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import os from "node:os";
import "./parse-finite-number-Z7n6tXLk.js";
import path from "node:path";
import { isMainThread, threadId } from "node:worker_threads";
import { InsertQueryNode, Kysely, SqliteDialect } from "kysely";
import { t as buildApprovalResolutionRef } from "./approval-resolution-ref-BMBlVd2b.js";
import { t as requireNodeSqlite } from "./node-sqlite-BJtdZavS.js";
import { y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { r as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DLqNjJHV.js";
import {
  n as configureSqlitePreSchemaPragmas,
  t as configureSqliteConnectionPragmas,
} from "./sqlite-wal-C_AVzaTm.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/infra/kysely-sync.ts
const kyselyByDatabase = /* @__PURE__ */ new WeakMap();
const compileOnlySqliteDialect = new SqliteDialect({
  database: async () => {
    throw new Error(
      "getNodeSqliteKysely() returns a compile-only Kysely facade; use executeSqliteQuerySync() to execute node:sqlite queries.",
    );
  },
});
function getNodeSqliteKysely(db) {
  const existing = kyselyByDatabase.get(db);
  if (existing) return existing;
  const kysely = new Kysely({ dialect: compileOnlySqliteDialect });
  kyselyByDatabase.set(db, kysely);
  return kysely;
}
/** Execute a compiled Kysely query synchronously against node:sqlite. */
function executeCompiledSqliteQuerySync(db, compiledQuery) {
  const statement = db.prepare(compiledQuery.sql);
  const parameters = compiledQuery.parameters;
  if (statement.columns().length > 0) return { rows: statement.all(...parameters) };
  const { changes, lastInsertRowid } = statement.run(...parameters);
  const result = {
    numAffectedRows: BigInt(changes),
    rows: [],
  };
  if (InsertQueryNode.is(compiledQuery.query) && changes > 0)
    return {
      ...result,
      insertId: BigInt(lastInsertRowid),
    };
  return result;
}
/** Compile and execute a Kysely query synchronously. */
function executeSqliteQuerySync(db, query) {
  return executeCompiledSqliteQuerySync(db, query.compile());
}
/** Compile and lazily iterate a Kysely query synchronously against node:sqlite. */
function* iterateSqliteQuerySync(db, query) {
  const compiledQuery = query.compile();
  const statement = db.prepare(compiledQuery.sql);
  if (statement.columns().length === 0) return;
  const parameters = compiledQuery.parameters;
  yield* statement.iterate(...parameters);
}
/** Execute a Kysely query synchronously and return its first row. */
function executeSqliteQueryTakeFirstSync(db, query) {
  return executeSqliteQuerySync(db, query).rows[0];
}
/** Drop the cached Kysely facade for a DatabaseSync after close/test reset. */
function clearNodeSqliteKyselyCacheForDatabase(db) {
  kyselyByDatabase.delete(db);
}
//#endregion
//#region src/infra/sqlite-user-version.ts
function readSqliteUserVersion(db) {
  const row = db.prepare("PRAGMA user_version").get();
  return Number(row?.user_version ?? 0);
}
function createNewerSqliteSchemaVersionError(
  databaseLabel,
  pathname,
  schemaVersion,
  supportedVersion,
) {
  return /* @__PURE__ */ new Error(
    `${databaseLabel} ${pathname} uses newer schema version ${schemaVersion}; this OpenClaw build supports ${supportedVersion}. Upgrade OpenClaw before opening this database. Do not downgrade OpenClaw or modify the database. To run this older build, use a separate state directory or restore a compatible backup.`,
  );
}
//#endregion
//#region src/infra/private-mode.ts
const CHMOD_UNSUPPORTED_CODES = /* @__PURE__ */ new Set(["ENOTSUP", "EOPNOTSUPP", "EINVAL"]);
const PRIVATE_PROBE_FILE_MODE = 384;
function hasRestrictivePermissions(target) {
  try {
    return (statSync(target).mode & 63) === 0;
  } catch {
    return false;
  }
}
function filesystemRejectsChmod(target) {
  let probePath;
  try {
    const probeDir = statSync(target).isDirectory() ? target : path.dirname(target);
    probePath = path.join(probeDir, `.openclaw-chmod-probe-${randomUUID()}`);
    writeFileSync(probePath, "", {
      flag: "wx",
      mode: PRIVATE_PROBE_FILE_MODE,
    });
  } catch {
    return false;
  }
  try {
    chmodSync(probePath, PRIVATE_PROBE_FILE_MODE);
    return false;
  } catch (err) {
    return err.code === "EPERM";
  } finally {
    try {
      unlinkSync(probePath);
    } catch {}
  }
}
function canIgnorePrivateChmodError(target, code) {
  if (code && CHMOD_UNSUPPORTED_CODES.has(code)) return true;
  if (code !== "EPERM") return false;
  return hasRestrictivePermissions(target) || filesystemRejectsChmod(target);
}
/**
 * Applies a private POSIX mode, reporting unsupported filesystems without
 * weakening real permission failures.
 */
function applyPrivateModeSync(target, mode) {
  try {
    chmodSync(target, mode);
    return { applied: true };
  } catch (err) {
    if (!canIgnorePrivateChmodError(target, err.code)) throw err;
    return {
      applied: false,
      error: err,
    };
  }
}
//#endregion
//#region src/infra/sqlite-files.ts
/** SQLite main database plus every journal-mode sidecar that can contain database pages. */
const SQLITE_DATABASE_FILE_SUFFIXES = ["", "-wal", "-shm", "-journal"];
/** Resolves the main database and all possible journal-mode sidecar paths. */
function resolveSqliteDatabaseFilePaths(pathname) {
  return SQLITE_DATABASE_FILE_SUFFIXES.map((suffix) => `${pathname}${suffix}`);
}
//#endregion
//#region src/infra/sqlite-index-schema.ts
const SQLITE_IDENTIFIER_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/u;
/**
 * Restore named unique indexes when SQLite's IF NOT EXISTS semantics preserve
 * a same-name definition that no longer enforces the canonical constraint.
 */
function repairCanonicalSqliteUniqueIndexes(db, databaseLabel, indexes) {
  const drifted = indexes.filter((index) => {
    assertSqliteIdentifier(index.name);
    const row = db
      .prepare("SELECT sql FROM main.sqlite_schema WHERE type = 'index' AND name = ?")
      .get(index.name);
    return (
      typeof row?.sql !== "string" ||
      normalizeCreateIndexSql(row.sql) !==
        normalizeCreateIndexSql(createIndexSql(index, index.name, false))
    );
  });
  if (drifted.length === 0) return;
  const savepoint = "repair_canonical_unique_indexes";
  let activeIndex;
  db.exec(`SAVEPOINT ${savepoint};`);
  try {
    for (const index of drifted) {
      activeIndex = index;
      const probeName = findUnusedProbeIndexName(db, index.name);
      db.exec(createIndexSql(index, probeName, true));
      db.exec(`DROP INDEX main.${index.name};`);
      db.exec(createIndexSql(index, index.name, true));
      db.exec(`DROP INDEX main.${probeName};`);
    }
    db.exec(`RELEASE SAVEPOINT ${savepoint};`);
  } catch (error) {
    try {
      db.exec(`ROLLBACK TO SAVEPOINT ${savepoint};`);
    } finally {
      db.exec(`RELEASE SAVEPOINT ${savepoint};`);
    }
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `SQLite canonical unique index ${activeIndex?.name ?? "repair"} failed for ${databaseLabel}: ${detail}`,
      { cause: error },
    );
  }
}
function createIndexSql(index, name, qualifyMain) {
  assertSqliteIdentifier(name);
  return `CREATE UNIQUE INDEX ${qualifyMain ? `main.${name}` : name} ${index.definition};`;
}
function findUnusedProbeIndexName(db, canonicalName) {
  const prefix = `openclaw_probe_${canonicalName}`;
  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = suffix === 0 ? prefix : `${prefix}_${suffix}`;
    if (!db.prepare("SELECT 1 AS found FROM main.sqlite_schema WHERE name = ?").get(candidate))
      return candidate;
  }
  throw new Error(`could not allocate a probe index name for ${canonicalName}`);
}
function assertSqliteIdentifier(identifier) {
  if (!SQLITE_IDENTIFIER_PATTERN.test(identifier))
    throw new Error(`invalid SQLite identifier: ${identifier}`);
}
function normalizeCreateIndexSql(sql) {
  return sql
    .trim()
    .replace(/;\s*$/u, "")
    .replace(/^CREATE\s+UNIQUE\s+INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?/iu, "CREATE UNIQUE INDEX ")
    .replace(/\s+/gu, " ")
    .trim();
}
//#endregion
//#region src/infra/sqlite-integrity.ts
const MAX_REPORTED_FOREIGN_KEY_VIOLATIONS = 5;
/** Require structural, table/index, and referential consistency before trusting a database. */
function assertSqliteIntegrity(database, databaseLabel) {
  const quickCheck = runSqliteCheck(database, databaseLabel, "quick_check");
  const integrityCheck = runSqliteCheck(database, databaseLabel, "integrity_check");
  runSqliteForeignKeyCheck(database, databaseLabel);
  return {
    integrityCheck,
    quickCheck,
  };
}
/** Require table and associated index consistency before trusting indexed reads. */
function assertSqliteTableIntegrity(database, databaseLabel, tableName) {
  runSqliteCheck(database, `${databaseLabel} table ${tableName}`, "integrity_check", tableName);
}
function runSqliteCheck(database, databaseLabel, pragma, tableName) {
  const argument = tableName ? `('${tableName.replaceAll("'", "''")}')` : "";
  const results = database
    .prepare(`PRAGMA ${pragma}${argument};`)
    .all()
    .map((row) => row[pragma] ?? Object.values(row)[0]);
  if (results.length === 1 && results[0] === "ok") return "ok";
  const details = results.map((result) => String(result)).join("; ") || "no result";
  throw new Error(`SQLite ${pragma} failed for ${databaseLabel}: ${details}`);
}
function runSqliteForeignKeyCheck(database, databaseLabel) {
  let violationCount = 0;
  const violations = [];
  try {
    const statement = database.prepare("PRAGMA foreign_key_check;");
    statement.setReadBigInts(true);
    for (const violation of statement.iterate()) {
      violationCount += 1;
      retainSortedForeignKeyViolation(violations, violation);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`SQLite foreign_key_check failed for ${databaseLabel}: ${message}`, {
      cause: error,
    });
  }
  if (violations.length === 0) return;
  const details = violations.map(formatSqliteForeignKeyViolation);
  if (violationCount > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS)
    details.push("additional violations omitted");
  throw new Error(`SQLite foreign_key_check failed for ${databaseLabel}: ${details.join("; ")}`);
}
function retainSortedForeignKeyViolation(retained, violation) {
  retained.push(violation);
  retained.sort(compareSqliteForeignKeyViolations);
  if (retained.length > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) retained.pop();
}
function compareSqliteForeignKeyViolations(left, right) {
  const tableOrder = Buffer.compare(Buffer.from(left.table), Buffer.from(right.table));
  if (tableOrder !== 0) return tableOrder;
  if (left.rowid === null || right.rowid === null) {
    if (left.rowid !== right.rowid) return left.rowid === null ? -1 : 1;
  } else if (left.rowid !== right.rowid) return left.rowid < right.rowid ? -1 : 1;
  const parentOrder = Buffer.compare(Buffer.from(left.parent), Buffer.from(right.parent));
  if (parentOrder !== 0) return parentOrder;
  if (left.fkid === right.fkid) return 0;
  return left.fkid < right.fkid ? -1 : 1;
}
function formatSqliteForeignKeyViolation(violation) {
  const row = violation.rowid === null ? "row without rowid" : `row ${violation.rowid.toString()}`;
  return `${violation.table} ${row} references ${violation.parent} (foreign key ${violation.fkid.toString()})`;
}
//#endregion
//#region src/infra/sqlite-schema-contract.ts
const schemaContractCache = /* @__PURE__ */ new Map();
const TABLE_CONSTRAINT_KEYWORDS = /* @__PURE__ */ new Set([
  "CHECK",
  "FOREIGN",
  "PRIMARY",
  "UNIQUE",
]);
/**
 * Require every object from one committed schema while allowing unrelated
 * tables and indexes that do not replace a canonical object.
 */
function assertSqliteSchemaContains(database, databaseLabel, schemaSql, compatibility = {}) {
  let expected = schemaContractCache.get(schemaSql);
  if (!expected) {
    expected = buildSqliteSchemaContract(schemaSql);
    schemaContractCache.set(schemaSql, expected);
  }
  const mismatches = [];
  for (const [tableName, expectedTable] of expected) {
    const actualTable = collectSqliteTableContract(database, tableName);
    if (!actualTable) {
      mismatches.push(`missing table ${tableName}`);
      continue;
    }
    const definitionMismatch = compareTableDefinitions(
      tableName,
      actualTable.definition,
      expectedTable.definition,
      compatibility,
    );
    if (definitionMismatch) mismatches.push(`${definitionMismatch} differ for ${tableName}`);
    for (const expectedIndex of expectedTable.indexes)
      if (!actualTable.indexes.some((actualIndex) => isEqual(actualIndex, expectedIndex)))
        mismatches.push(`missing or drifted index ${expectedIndex.name ?? `on ${tableName}`}`);
    for (const actualIndex of actualTable.indexes)
      if (
        actualIndex.unique === 1 &&
        !expectedTable.indexes.some((expectedIndex) => isEqual(actualIndex, expectedIndex))
      )
        mismatches.push(`unexpected unique index ${actualIndex.name ?? `on ${tableName}`}`);
    for (const expectedTrigger of expectedTable.triggers)
      if (!actualTable.triggers.some((actualTrigger) => isEqual(actualTrigger, expectedTrigger)))
        mismatches.push(`missing or drifted trigger ${expectedTrigger.name}`);
    for (const actualTrigger of actualTable.triggers)
      if (
        !expectedTable.triggers.some((expectedTrigger) => isEqual(actualTrigger, expectedTrigger))
      )
        mismatches.push(`unexpected trigger ${actualTrigger.name}`);
    if (actualTable.virtualTableSql !== expectedTable.virtualTableSql)
      mismatches.push(`virtual table definition differs for ${tableName}`);
    if (
      actualTable.strict !== expectedTable.strict ||
      actualTable.withoutRowid !== expectedTable.withoutRowid
    )
      mismatches.push(`table options differ for ${tableName}`);
  }
  if (mismatches.length > 0) {
    const shown = mismatches.slice(0, 8);
    if (mismatches.length > shown.length)
      shown.push(`${mismatches.length - shown.length} additional mismatch(es)`);
    throw new Error(
      `SQLite schema is incomplete or noncanonical for ${databaseLabel}: ${shown.join("; ")}`,
    );
  }
}
function buildSqliteSchemaContract(schemaSql) {
  const database = new (requireNodeSqlite().DatabaseSync)(":memory:");
  try {
    database.exec(schemaSql);
    const rows = database
      .prepare(`
          SELECT name
          FROM sqlite_schema
          WHERE type = 'table'
            AND name NOT LIKE 'sqlite_%'
          ORDER BY name
        `)
      .all();
    return new Map(
      rows.map((row) => {
        const contract = collectSqliteTableContract(database, row.name);
        if (!contract)
          throw new Error(`Could not collect generated SQLite schema table ${row.name}.`);
        return [row.name, contract];
      }),
    );
  } finally {
    database.close();
  }
}
function collectSqliteTableContract(database, tableName) {
  const table = database
    .prepare("SELECT name, sql FROM sqlite_schema WHERE type = 'table' AND name = ?")
    .get(tableName);
  if (!table) return;
  const quotedTable = quoteSqliteIdentifier(tableName);
  const tableList = database
    .prepare("PRAGMA table_list")
    .all()
    .find((entry) => entry.name === tableName);
  if (!tableList) throw new Error(`Could not inspect SQLite table options for ${tableName}.`);
  const indexes = database
    .prepare(`PRAGMA index_list(${quotedTable})`)
    .all()
    .map((index) => collectSqliteIndexContract(database, index))
    .toSorted(compareJson);
  const triggers = database
    .prepare(`
          SELECT name, sql
          FROM sqlite_schema
          WHERE type = 'trigger' AND tbl_name = ?
          ORDER BY name
        `)
    .all(tableName)
    .map((trigger) => ({
      name: trigger.name,
      sql: normalizeSchemaSql(trigger.sql),
    }));
  const normalizedTableSql = normalizeSchemaSql(table.sql);
  const isVirtualTable =
    normalizedTableSql !== null && /^CREATE VIRTUAL TABLE /iu.test(normalizedTableSql);
  return {
    definition: isVirtualTable ? null : parseTableDefinition(table.sql, tableName),
    indexes,
    strict: tableList.strict,
    triggers,
    virtualTableSql: isVirtualTable ? normalizedTableSql : null,
    withoutRowid: tableList.wr,
  };
}
function compareTableDefinitions(tableName, actual, expected, compatibility) {
  if (!actual || !expected) return actual === expected ? null : "table definition";
  if (actual.columns.size !== expected.columns.size) return "column definitions";
  for (const [columnName, expectedDefinition] of expected.columns) {
    const actualDefinition = actual.columns.get(columnName);
    if (actualDefinition === expectedDefinition) continue;
    if (
      !(compatibility.allowedColumnDefinitions?.[`${tableName}.${columnName}`] ?? []).some(
        (definition) => normalizeSqlWhitespace(definition) === actualDefinition,
      )
    )
      return "column definitions";
  }
  return isEqual(actual.constraints, expected.constraints) ? null : "table constraints";
}
function parseTableDefinition(sql, tableName) {
  if (sql === null) throw new Error(`Could not inspect SQLite table definition for ${tableName}.`);
  const open = findSqlCharacter(sql, "(");
  if (open === -1) throw new Error(`SQLite table ${tableName} has no column definition.`);
  const close = findSqlClosingParenthesis(sql, open);
  const columns = /* @__PURE__ */ new Map();
  const constraints = [];
  for (const rawDefinition of splitSqlList(sql.slice(open + 1, close))) {
    const definition = normalizeSqlWhitespace(rawDefinition);
    if (!definition) continue;
    const token = readSqlToken(definition, 0);
    if (!token) throw new Error(`SQLite table ${tableName} contains an unreadable definition.`);
    if (readTableConstraintKeyword(definition, token)) {
      constraints.push(definition);
      continue;
    }
    const columnName = normalizeSqlIdentifier(token.raw);
    if (columns.has(columnName))
      throw new Error(`SQLite table ${tableName} contains duplicate column ${columnName}.`);
    columns.set(columnName, definition);
  }
  return {
    columns: new Map([...columns].toSorted(([left], [right]) => left.localeCompare(right))),
    constraints: constraints.toSorted(),
  };
}
function readTableConstraintKeyword(sql, first) {
  let token = first;
  if (token.keyword === "CONSTRAINT") {
    const name = readSqlToken(sql, token.end);
    token = name ? readSqlToken(sql, name.end) : null;
  }
  return token?.keyword && TABLE_CONSTRAINT_KEYWORDS.has(token.keyword) ? token.keyword : null;
}
function readSqlToken(sql, start) {
  let index = start;
  while (index < sql.length && /\s/u.test(sql[index] ?? "")) index += 1;
  const char = sql[index];
  if (!char) return null;
  if (char === '"' || char === "`") {
    const end = skipSqlQuoted(sql, index, char);
    return {
      end,
      keyword: null,
      raw: sql.slice(index, end),
    };
  }
  if (char === "[") {
    const end = skipSqlQuoted(sql, index, char);
    return {
      end,
      keyword: null,
      raw: sql.slice(index, end),
    };
  }
  let end = index;
  while (end < sql.length && !/[\s(,]/u.test(sql[end] ?? "")) end += 1;
  const raw = sql.slice(index, end);
  return {
    end,
    keyword: raw.toUpperCase(),
    raw,
  };
}
function normalizeSqlIdentifier(identifier) {
  if (identifier.startsWith('"') && identifier.endsWith('"'))
    return identifier.slice(1, -1).replaceAll('""', '"').toLowerCase();
  if (identifier.startsWith("`") && identifier.endsWith("`"))
    return identifier.slice(1, -1).replaceAll("``", "`").toLowerCase();
  if (identifier.startsWith("[") && identifier.endsWith("]"))
    return identifier.slice(1, -1).toLowerCase();
  return identifier.toLowerCase();
}
function collectSqliteIndexContract(database, index) {
  const row = database
    .prepare("SELECT sql FROM sqlite_schema WHERE type = 'index' AND name = ?")
    .get(index.name);
  const terms = database
    .prepare(`PRAGMA index_xinfo(${quoteSqliteIdentifier(index.name)})`)
    .all()
    .map(({ cid, coll, desc, key, name, seqno }) => ({
      coll,
      desc,
      key,
      kind: sqliteIndexTermKind(cid),
      name,
      seqno,
    }));
  return {
    name: index.name.startsWith("sqlite_autoindex_") ? null : index.name,
    origin: index.origin,
    partial: index.partial,
    sql: normalizeSchemaSql(typeof row?.sql === "string" ? row.sql : null),
    terms,
    unique: index.unique,
  };
}
function sqliteIndexTermKind(cid) {
  return cid === -2 ? "expression" : cid === -1 ? "rowid" : "column";
}
function normalizeSchemaSql(sql) {
  if (sql === null) return null;
  return normalizeSqlWhitespace(sql)
    .replace(/;\s*$/u, "")
    .trim()
    .replace(/^(CREATE TABLE) IF NOT EXISTS /iu, "$1 ")
    .replace(/^(CREATE VIRTUAL TABLE) IF NOT EXISTS /iu, "$1 ")
    .replace(/^(CREATE UNIQUE INDEX) IF NOT EXISTS /iu, "$1 ")
    .replace(/^(CREATE INDEX) IF NOT EXISTS /iu, "$1 ")
    .replace(/^(CREATE TRIGGER) IF NOT EXISTS /iu, "$1 ");
}
function splitSqlList(sql) {
  const items = [];
  let depth = 0;
  let start = 0;
  let index = 0;
  while (index < sql.length) {
    const next = skipSqlQuotedOrComment(sql, index);
    if (next !== index) {
      index = next;
      continue;
    }
    const char = sql[index];
    if (char === "(") depth += 1;
    else if (char === ")") depth -= 1;
    else if (char === "," && depth === 0) {
      items.push(sql.slice(start, index));
      start = index + 1;
    }
    index += 1;
  }
  items.push(sql.slice(start));
  return items;
}
function findSqlCharacter(sql, character) {
  let index = 0;
  while (index < sql.length) {
    const next = skipSqlQuotedOrComment(sql, index);
    if (next !== index) {
      index = next;
      continue;
    }
    if (sql[index] === character) return index;
    index += 1;
  }
  return -1;
}
function findSqlClosingParenthesis(sql, open) {
  let depth = 0;
  let index = open;
  while (index < sql.length) {
    const next = skipSqlQuotedOrComment(sql, index);
    if (next !== index) {
      index = next;
      continue;
    }
    const char = sql[index];
    if (char === "(") depth += 1;
    else if (char === ")") {
      depth -= 1;
      if (depth === 0) return index;
    }
    index += 1;
  }
  throw new Error("SQLite schema contains an unterminated table definition.");
}
function normalizeSqlWhitespace(sql) {
  let normalized = "";
  let pendingSpace = false;
  let index = 0;
  while (index < sql.length) {
    const quoted = skipSqlQuoted(sql, index, sql[index] ?? "");
    if (quoted !== index) {
      if (pendingSpace && normalized.length > 0) normalized += " ";
      normalized += sql.slice(index, quoted);
      pendingSpace = false;
      index = quoted;
      continue;
    }
    const comment = skipSqlComment(sql, index);
    if (comment !== index) {
      pendingSpace = true;
      index = comment;
      continue;
    }
    const char = sql[index] ?? "";
    if (/\s/u.test(char)) pendingSpace = true;
    else {
      if (pendingSpace && normalized.length > 0) normalized += " ";
      normalized += char;
      pendingSpace = false;
    }
    index += 1;
  }
  return normalized.trim();
}
function skipSqlQuotedOrComment(sql, index) {
  const quoted = skipSqlQuoted(sql, index, sql[index] ?? "");
  return quoted !== index ? quoted : skipSqlComment(sql, index);
}
function skipSqlQuoted(sql, index, quote) {
  if (quote !== "'" && quote !== '"' && quote !== "`" && quote !== "[") return index;
  const closingQuote = quote === "[" ? "]" : quote;
  let cursor = index + 1;
  while (cursor < sql.length) {
    if (sql[cursor] !== closingQuote) {
      cursor += 1;
      continue;
    }
    if (quote !== "[" && sql[cursor + 1] === closingQuote) {
      cursor += 2;
      continue;
    }
    return cursor + 1;
  }
  return sql.length;
}
function skipSqlComment(sql, index) {
  if (sql.startsWith("--", index)) {
    const newline = sql.indexOf("\n", index + 2);
    return newline === -1 ? sql.length : newline + 1;
  }
  if (sql.startsWith("/*", index)) {
    const close = sql.indexOf("*/", index + 2);
    return close === -1 ? sql.length : close + 2;
  }
  return index;
}
function quoteSqliteIdentifier(identifier) {
  return `"${identifier.replaceAll('"', '""')}"`;
}
function isEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}
function compareJson(left, right) {
  return JSON.stringify(left).localeCompare(JSON.stringify(right));
}
//#endregion
//#region src/cron/execution-error-constants.ts
/** Stable cron execution error text shared by runtime and ledger codecs. */
const CRON_JOB_EXECUTION_TIMEOUT_ERROR = "cron: job execution timed out";
//#endregion
//#region src/cron/run-diagnostics-normalize.ts
/** Dependency-light normalization helpers for stored cron run diagnostics. */
const MAX_ENTRIES = 10;
const MAX_ENTRY_CHARS = 1e3;
const MAX_SUMMARY_CHARS = 2e3;
function normalizeSeverity(value) {
  return value === "info" || value === "warn" || value === "error" ? value : "error";
}
function normalizeSource(value) {
  switch (value) {
    case "cron-preflight":
    case "cron-setup":
    case "model-preflight":
    case "agent-run":
    case "tool":
    case "exec":
    case "delivery":
      return value;
    default:
      return "agent-run";
  }
}
function normalizeTimestamp(value, nowMs) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : nowMs();
}
function formatUnknownError(error) {
  if (error instanceof Error) return error.message || error.name;
  return String(error);
}
function isRecord(value) {
  return value !== null && typeof value === "object";
}
function normalizeToolName(value) {
  if (typeof value !== "string") return;
  return normalizeOptionalString(value);
}
function normalizeExitCode(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return value === null ? null : void 0;
}
function tailText(value, maxChars) {
  if (value.length <= maxChars) return value;
  return sliceUtf16Safe(value, -maxChars);
}
function normalizeDiagnosticMessage(value, redactText) {
  if (typeof value !== "string") return {};
  const normalized = normalizeOptionalString(value);
  if (!normalized) return {};
  const redacted = redactText(normalized);
  if (redacted.length <= MAX_ENTRY_CHARS) return { message: redacted };
  return {
    message: `${truncateUtf16Safe(redacted, MAX_ENTRY_CHARS - 1)}…`,
    truncated: true,
  };
}
function trimSummary(value) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) return;
  if (normalized.length <= MAX_SUMMARY_CHARS) return normalized;
  return `${truncateUtf16Safe(normalized, MAX_SUMMARY_CHARS - 1)}…`;
}
/** Normalizes stored cron diagnostic payloads into bounded entries. */
function normalizeCronRunDiagnostics(value, opts) {
  if (!value || typeof value !== "object") return;
  const record = value;
  const nowMs = opts?.nowMs ?? Date.now;
  const redactText = opts?.redactText ?? ((text) => text);
  const entriesRaw = Array.isArray(record.entries) ? record.entries : [];
  const entries = [];
  for (const item of entriesRaw) {
    if (!item || typeof item !== "object") continue;
    const entry = item;
    const normalized = normalizeDiagnosticMessage(entry.message, redactText);
    if (!normalized.message) continue;
    entries.push({
      ts: normalizeTimestamp(entry.ts, nowMs),
      source: normalizeSource(entry.source),
      severity: normalizeSeverity(entry.severity),
      message: normalized.message,
      ...(typeof entry.toolName === "string" && entry.toolName.trim()
        ? { toolName: entry.toolName.trim() }
        : {}),
      ...(typeof entry.exitCode === "number" && Number.isFinite(entry.exitCode)
        ? { exitCode: entry.exitCode }
        : entry.exitCode === null
          ? { exitCode: null }
          : {}),
      ...(entry.truncated === true || normalized.truncated ? { truncated: true } : {}),
    });
    if (entries.length > MAX_ENTRIES) entries.shift();
  }
  const summary = trimSummary(
    typeof record.summary === "string" ? redactText(record.summary) : void 0,
  );
  if (entries.length === 0 && !summary) return;
  return {
    ...(summary ? { summary } : {}),
    entries,
  };
}
//#endregion
//#region src/cron/task-run-detail.ts
/** Read-side cron codec between task-ledger detail and the stable run-history wire shape.
 * Deliberately free of agent/runtime imports so history reads stay dependency-light;
 * the event->entry write codec lives in task-run-event-codec.ts. */
const CRON_TASK_DETAIL_KIND = "cron-run";
const CRON_FAILOVER_REASONS = /* @__PURE__ */ new Set([
  "auth",
  "auth_permanent",
  "format",
  "rate_limit",
  "overloaded",
  "billing",
  "server_error",
  "timeout",
  "model_not_found",
  "session_expired",
  "context_overflow",
  "empty_response",
  "no_error_details",
  "unclassified",
  "unknown",
]);
function toJsonValue(value) {
  const serialized = JSON.stringify(value);
  return serialized === void 0 ? void 0 : JSON.parse(serialized);
}
function isJsonObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isCronRunStatus(value) {
  return value === "ok" || value === "error" || value === "skipped";
}
function normalizeCronRunLogErrorReason(value) {
  return typeof value === "string" && CRON_FAILOVER_REASONS.has(value) ? value : void 0;
}
/** Parses stored or migrated cron history while preserving the stable wire shape. */
function parseCronRunLogEntryObject(obj, opts) {
  const jobId = normalizeOptionalString(opts?.jobId);
  if (!obj || typeof obj !== "object") return null;
  const entryObj = obj;
  if (entryObj.action !== "finished") return null;
  if (typeof entryObj.jobId !== "string" || entryObj.jobId.trim().length === 0) return null;
  if (typeof entryObj.ts !== "number" || !Number.isFinite(entryObj.ts)) return null;
  if (jobId && entryObj.jobId !== jobId) return null;
  const usage = entryObj.usage && typeof entryObj.usage === "object" ? entryObj.usage : void 0;
  const normalizedError = typeof entryObj.error === "string" ? entryObj.error : void 0;
  const normalizedProvider =
    typeof entryObj.provider === "string" && entryObj.provider.trim() ? entryObj.provider : void 0;
  const entry = {
    ts: entryObj.ts,
    jobId: entryObj.jobId,
    action: "finished",
    status: entryObj.status,
    error: normalizedError,
    errorReason: normalizeCronRunLogErrorReason(entryObj.errorReason) ?? void 0,
    summary: entryObj.summary,
    runId: typeof entryObj.runId === "string" && entryObj.runId.trim() ? entryObj.runId : void 0,
    diagnostics: normalizeCronRunDiagnostics(entryObj.diagnostics),
    runAtMs: entryObj.runAtMs,
    durationMs: entryObj.durationMs,
    nextRunAtMs: entryObj.nextRunAtMs,
    triggerFired: entryObj.triggerFired === true ? true : void 0,
    model: typeof entryObj.model === "string" && entryObj.model.trim() ? entryObj.model : void 0,
    provider: normalizedProvider,
    usage: usage
      ? {
          input_tokens: typeof usage.input_tokens === "number" ? usage.input_tokens : void 0,
          output_tokens: typeof usage.output_tokens === "number" ? usage.output_tokens : void 0,
          total_tokens: typeof usage.total_tokens === "number" ? usage.total_tokens : void 0,
          cache_read_tokens:
            typeof usage.cache_read_tokens === "number" ? usage.cache_read_tokens : void 0,
          cache_write_tokens:
            typeof usage.cache_write_tokens === "number" ? usage.cache_write_tokens : void 0,
        }
      : void 0,
  };
  if (typeof entryObj.delivered === "boolean") entry.delivered = entryObj.delivered;
  if (
    entryObj.deliveryStatus === "delivered" ||
    entryObj.deliveryStatus === "not-delivered" ||
    entryObj.deliveryStatus === "unknown" ||
    entryObj.deliveryStatus === "not-requested"
  )
    entry.deliveryStatus = entryObj.deliveryStatus;
  if (typeof entryObj.deliveryError === "string") entry.deliveryError = entryObj.deliveryError;
  if (
    entryObj.failureNotificationDelivery &&
    typeof entryObj.failureNotificationDelivery === "object"
  ) {
    const failureNotificationDelivery = entryObj.failureNotificationDelivery;
    if (
      failureNotificationDelivery.status === "delivered" ||
      failureNotificationDelivery.status === "not-delivered" ||
      failureNotificationDelivery.status === "unknown" ||
      failureNotificationDelivery.status === "not-requested"
    )
      entry.failureNotificationDelivery = {
        status: failureNotificationDelivery.status,
        ...(typeof failureNotificationDelivery.delivered === "boolean"
          ? { delivered: failureNotificationDelivery.delivered }
          : {}),
        ...(typeof failureNotificationDelivery.error === "string"
          ? { error: failureNotificationDelivery.error }
          : {}),
      };
  }
  if (entryObj.delivery && typeof entryObj.delivery === "object")
    entry.delivery = entryObj.delivery;
  if (typeof entryObj.sessionId === "string" && entryObj.sessionId.trim())
    entry.sessionId = entryObj.sessionId;
  if (typeof entryObj.sessionKey === "string" && entryObj.sessionKey.trim())
    entry.sessionKey = entryObj.sessionKey;
  return entry;
}
/** Encodes cron-only outcome fields; generic lifecycle fields stay on TaskRecord. */
function cronRunLogEntryToTaskDetail(entry, options) {
  return (
    toJsonValue({
      kind: CRON_TASK_DETAIL_KIND,
      status: entry.status,
      storeKey: options.storeKey,
      errorReason: entry.errorReason,
      diagnostics: entry.diagnostics,
      delivered: entry.delivered,
      deliveryStatus: entry.deliveryStatus,
      deliveryError: entry.deliveryError,
      failureNotificationDelivery: entry.failureNotificationDelivery,
      delivery: entry.delivery,
      sessionId: entry.sessionId,
      runId: entry.runId,
      runAtMs: entry.runAtMs,
      durationMs: entry.durationMs,
      nextRunAtMs: entry.nextRunAtMs,
      triggerFired: entry.triggerFired,
      triggerStateChanged:
        options.triggerEval?.fired === true ? options.triggerEval.stateChanged : void 0,
      triggerState:
        options.triggerEval?.fired === true && options.triggerEval.stateChanged
          ? options.triggerEval.state
          : void 0,
      model: entry.model,
      provider: entry.provider,
      usage: entry.usage,
    }) ?? { kind: CRON_TASK_DETAIL_KIND }
  );
}
/** Returns the cron store partition recorded on a task row. */
function cronTaskRecordStoreKey(task) {
  return isJsonObject(task.detail) && typeof task.detail.storeKey === "string"
    ? task.detail.storeKey
    : void 0;
}
/** Reads internal trigger recovery data without adding it to run-history responses. */
function cronTaskRecordToTriggerEval(task) {
  if (!isJsonObject(task.detail) || task.detail.triggerFired !== true) return;
  return {
    fired: true,
    stateChanged: task.detail.triggerStateChanged === true,
    ...(task.detail.triggerStateChanged === true && "triggerState" in task.detail
      ? { state: task.detail.triggerState }
      : {}),
  };
}
/** Maps the cron outcome vocabulary onto generic task terminal states. */
function cronRunStatusToTaskStatus(entry) {
  if (entry.status === "ok" || entry.status === "skipped") return "succeeded";
  return entry.error === "cron: job execution timed out" ? "timed_out" : "failed";
}
/** Reconstructs the unchanged CronRunLogEntry wire shape from a cron task row. */
function cronTaskRecordToRunLogEntry(task) {
  if (task.runtime !== "cron" || !task.sourceId || !isJsonObject(task.detail)) return null;
  if (task.detail.kind !== CRON_TASK_DETAIL_KIND) return null;
  const wireDetail = { ...task.detail };
  delete wireDetail.storeKey;
  const entry = parseCronRunLogEntryObject(
    {
      ...wireDetail,
      ts: task.endedAt ?? task.lastEventAt ?? task.createdAt,
      jobId: task.sourceId,
      action: "finished",
      status: isCronRunStatus(task.detail.status) ? task.detail.status : void 0,
      error: task.error,
      summary: task.terminalSummary,
      sessionKey: task.childSessionKey,
      runId: typeof task.detail.runId === "string" ? task.detail.runId : void 0,
    },
    { jobId: task.sourceId },
  );
  if (!entry) return null;
  return {
    ...entry,
    delivered: entry.delivered,
    deliveryStatus: entry.deliveryStatus,
    deliveryError: entry.deliveryError,
    sessionId: entry.sessionId,
    sessionKey: entry.sessionKey,
  };
}
//#endregion
//#region src/infra/sqlite-number.ts
/** Converts a SQLite number or bigint column into a JavaScript number. */
function normalizeSqliteNumber(value) {
  if (typeof value === "bigint") return Number(value);
  return typeof value === "number" ? value : void 0;
}
//#endregion
//#region src/infra/state-migrations.cron-run-logs.ts
const CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID = "state:cron-run-logs-to-task-runs:v1";
const CRON_RUN_LOG_IMPORT_BATCH_SIZE = 500;
function tableExists$1(db, name) {
  return Boolean(
    db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1").get(name),
  );
}
function parseDetail(raw) {
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : void 0;
  } catch {
    return;
  }
}
function collectMirroredTasks(db) {
  const rows = db
    .prepare(`SELECT source_id, ended_at, detail_json
       FROM task_runs
       WHERE runtime = 'cron' AND source_id IS NOT NULL AND detail_json IS NOT NULL`)
    .all();
  const bySource = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const detail = parseDetail(row.detail_json);
    if (!row.source_id || detail?.kind !== "cron-run") continue;
    const identities = bySource.get(row.source_id) ?? [];
    identities.push({
      endedAt: normalizeSqliteNumber(row.ended_at) ?? null,
      ...(typeof detail.runId === "string" && detail.runId ? { runId: detail.runId } : {}),
    });
    bySource.set(row.source_id, identities);
  }
  return bySource;
}
function hasMirroredIdentity(identities, runId, endedAt) {
  return identities.some((identity) =>
    runId && identity.runId ? identity.runId === runId : identity.endedAt === endedAt,
  );
}
function integerToBoolean(value) {
  return value === null || value === void 0 ? void 0 : Number(value) !== 0;
}
/** Legacy rows trust write-time errorReason and diagnostic redaction without recomputation. */
function parseLegacyRow(row) {
  let rawEntry;
  try {
    rawEntry = JSON.parse(row.entry_json ?? "");
  } catch {
    return null;
  }
  const parsed = parseCronRunLogEntryObject(rawEntry, { jobId: row.job_id });
  if (!parsed) return null;
  return {
    ...parsed,
    ts: normalizeSqliteNumber(row.ts) ?? parsed.ts,
    jobId: row.job_id,
    status: row.status ?? parsed.status,
    error: row.error ?? parsed.error,
    summary: row.summary ?? parsed.summary,
    delivered: integerToBoolean(row.delivered) ?? parsed.delivered,
    deliveryStatus: row.delivery_status ?? parsed.deliveryStatus,
    deliveryError: row.delivery_error ?? parsed.deliveryError,
    sessionId: row.session_id ?? parsed.sessionId,
    sessionKey: row.session_key ?? parsed.sessionKey,
    runId: row.run_id ?? parsed.runId,
    runAtMs: normalizeSqliteNumber(row.run_at_ms ?? null) ?? parsed.runAtMs,
    durationMs: normalizeSqliteNumber(row.duration_ms ?? null) ?? parsed.durationMs,
    nextRunAtMs: normalizeSqliteNumber(row.next_run_at_ms ?? null) ?? parsed.nextRunAtMs,
    model: row.model ?? parsed.model,
    provider: row.provider ?? parsed.provider,
  };
}
function ordinalKey(jobId, ts) {
  return `${jobId}\0${ts}`;
}
/** Runs inside the state schema transaction and removes the retired table after import. */
function migrateLegacyCronRunLogsToTaskRuns(db) {
  if (!tableExists$1(db, "cron_run_logs"))
    return {
      imported: 0,
      alreadyMirrored: 0,
      malformed: 0,
      skipped: true,
    };
  const mirrored = collectMirroredTasks(db);
  const ordinals = /* @__PURE__ */ new Map();
  const insert = db.prepare(`
    INSERT INTO task_runs (
      task_id, runtime, task_kind, source_id, requester_session_key, owner_key, scope_kind,
      child_session_key, parent_flow_id, parent_task_id, agent_id, requester_agent_id, run_id,
      label, task, status, delivery_status, notify_policy, created_at, started_at, ended_at,
      last_event_at, cleanup_after, error, progress_summary, terminal_summary, terminal_outcome,
      detail_json
    ) VALUES (
      @task_id, 'cron', NULL, @source_id, '', '', 'system', @child_session_key, NULL, NULL,
      NULL, NULL, @run_id, NULL, @task, @status, 'not_applicable', 'silent', @created_at,
      @started_at, @ended_at, @ended_at, NULL, @error, NULL, @terminal_summary,
      @terminal_outcome, @detail_json
    )
  `);
  let imported = 0;
  let alreadyMirrored = 0;
  let malformed = 0;
  let offset = 0;
  while (true) {
    const rows = db
      .prepare(`SELECT * FROM cron_run_logs
         ORDER BY job_id, ts, store_key, seq
         LIMIT ? OFFSET ?`)
      .all(CRON_RUN_LOG_IMPORT_BATCH_SIZE, offset);
    if (rows.length === 0) break;
    offset += rows.length;
    for (const row of rows) {
      const entry = parseLegacyRow(row);
      if (!entry) {
        malformed++;
        continue;
      }
      const key = ordinalKey(entry.jobId, entry.ts);
      const ordinal = (ordinals.get(key) ?? 0) + 1;
      ordinals.set(key, ordinal);
      if (hasMirroredIdentity(mirrored.get(entry.jobId) ?? [], entry.runId, entry.ts)) {
        alreadyMirrored++;
        continue;
      }
      const taskId = `cron-runlog-import:${entry.jobId}:${entry.ts}:${ordinal}`;
      const status = cronRunStatusToTaskStatus(entry);
      insert.run({
        task_id: taskId,
        source_id: entry.jobId,
        child_session_key: entry.sessionKey ?? null,
        run_id: taskId,
        task: entry.jobId,
        status,
        created_at: entry.runAtMs ?? entry.ts,
        started_at: entry.runAtMs ?? null,
        ended_at: entry.ts,
        error: entry.error ?? null,
        terminal_summary: entry.summary ?? null,
        terminal_outcome: status === "succeeded" ? "succeeded" : null,
        detail_json: JSON.stringify(
          cronRunLogEntryToTaskDetail(entry, { storeKey: row.store_key }),
        ),
      });
      imported++;
    }
  }
  db.exec(`
    DROP INDEX IF EXISTS idx_cron_run_logs_store_ts;
    DROP INDEX IF EXISTS idx_cron_run_logs_job_status;
    DROP INDEX IF EXISTS idx_cron_run_logs_delivery;
    DROP TABLE cron_run_logs;
  `);
  const result = {
    imported,
    alreadyMirrored,
    malformed,
    skipped: false,
  };
  const now = Date.now();
  db.prepare(`INSERT INTO migration_runs (id, started_at, finished_at, status, report_json)
     VALUES (?, ?, ?, 'completed', ?)
     ON CONFLICT(id) DO UPDATE SET
       finished_at = excluded.finished_at,
       status = excluded.status,
       report_json = excluded.report_json`).run(
    CRON_RUN_LOG_TASK_IMPORT_MIGRATION_ID,
    now,
    now,
    JSON.stringify(result),
  );
  return result;
}
//#endregion
//#region src/state/openclaw-state-db-schema-helpers.ts
function tableHasColumn(db, tableName, columnName) {
  return db
    .prepare(`PRAGMA table_info(${tableName})`)
    .all()
    .some((row) => row.name === columnName);
}
function tablePrimaryKeyColumns(db, tableName) {
  return db
    .prepare(`PRAGMA table_info(${tableName})`)
    .all()
    .filter((row) => Number(row.pk ?? 0) > 0 && typeof row.name === "string")
    .toSorted((left, right) => Number(left.pk ?? 0) - Number(right.pk ?? 0))
    .map((row) => row.name);
}
function tableExists(db, tableName) {
  return (
    db.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName)
      ?.ok === 1
  );
}
function ensureColumn(db, tableName, columnSql) {
  const columnName = columnSql.trim().split(/\s+/, 1)[0];
  if (!columnName || !tableExists(db, tableName) || tableHasColumn(db, tableName, columnName))
    return false;
  db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnSql};`);
  return true;
}
//#endregion
//#region src/state/openclaw-state-db.paths.ts
/**
 * Path helpers for the shared OpenClaw SQLite state database.
 *
 * Tests get worker-scoped temp state roots unless they explicitly provide
 * `OPENCLAW_STATE_DIR`, which prevents parallel Vitest workers from sharing WAL files.
 */
function resolveOpenClawStateRootDir(env) {
  if (env.OPENCLAW_STATE_DIR?.trim()) return resolveStateDir(env);
  if (env.VITEST || env.NODE_ENV === "test") {
    const workerId = parseStrictNonNegativeInteger(
      env.VITEST_WORKER_ID ?? env.VITEST_POOL_ID ?? "",
    );
    const shardSuffix =
      workerId !== void 0
        ? `${process.pid}-${workerId}`
        : isMainThread
          ? String(process.pid)
          : `${process.pid}-${threadId}`;
    return path.join(os.tmpdir(), "openclaw-test-state", shardSuffix);
  }
  return resolveStateDir(env);
}
/** Resolve the directory that contains the shared state SQLite file. */
function resolveOpenClawStateSqliteDir(env = process.env) {
  return path.join(resolveOpenClawStateRootDir(env), "state");
}
/** Resolve the shared state SQLite file path. */
function resolveOpenClawStateSqlitePath(env = process.env) {
  return path.join(resolveOpenClawStateSqliteDir(env), "openclaw.sqlite");
}
//#endregion
//#region src/state/openclaw-state-schema.generated.ts
/**
 * This file was generated from the SQLite schema source.
 * Please do not edit it manually.
 */
const OPENCLAW_STATE_SCHEMA_SQL = `CREATE TABLE IF NOT EXISTS auth_profile_stores (
  store_key TEXT NOT NULL PRIMARY KEY,
  store_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_profile_state (
  store_key TEXT NOT NULL PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS diagnostic_events (
  scope TEXT NOT NULL,
  event_key TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (scope, event_key)
);

CREATE INDEX IF NOT EXISTS idx_diagnostic_events_scope_created
  ON diagnostic_events(scope, created_at, event_key);

CREATE TABLE IF NOT EXISTS skill_usage (
  skill_file TEXT NOT NULL PRIMARY KEY,
  skill_key TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  skill_source TEXT NOT NULL,
  first_used_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER NOT NULL,
  use_count INTEGER NOT NULL,
  last_agent_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_skill_usage_key
  ON skill_usage(skill_key, skill_file);

CREATE TABLE IF NOT EXISTS skill_lifecycle (
  skill_file TEXT NOT NULL PRIMARY KEY,
  skill_key TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('active', 'stale', 'archived')),
  pinned INTEGER NOT NULL DEFAULT 0,
  state_changed_at_ms INTEGER NOT NULL,
  created_at_ms INTEGER NOT NULL,
  archived_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_skill_lifecycle_key
  ON skill_lifecycle(skill_key, skill_file);

CREATE INDEX IF NOT EXISTS idx_skill_lifecycle_state
  ON skill_lifecycle(state, skill_file);

CREATE TABLE IF NOT EXISTS skill_curator_state (
  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
  last_attempt_at_ms INTEGER NOT NULL,
  last_success_at_ms INTEGER,
  last_error TEXT,
  last_result_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL UNIQUE,
  source_id TEXT NOT NULL UNIQUE,
  schema_version INTEGER NOT NULL DEFAULT 1,
  source_sequence INTEGER NOT NULL,
  occurred_at INTEGER NOT NULL,
  kind TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  error_code TEXT,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  agent_id TEXT,
  session_key TEXT,
  session_id TEXT,
  run_id TEXT,
  tool_call_id TEXT,
  tool_name TEXT,
  direction TEXT,
  channel TEXT,
  conversation_kind TEXT,
  message_outcome TEXT,
  reason_code TEXT,
  delivery_kind TEXT,
  failure_stage TEXT,
  duration_ms INTEGER,
  result_count INTEGER,
  account_ref TEXT,
  conversation_ref TEXT,
  message_ref TEXT,
  target_ref TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_events_time
  ON audit_events(occurred_at DESC, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_agent_sequence
  ON audit_events(agent_id, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_session_sequence
  ON audit_events(session_key, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_run_sequence
  ON audit_events(run_id, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_kind_sequence
  ON audit_events(kind, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_status_sequence
  ON audit_events(status, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_channel_sequence
  ON audit_events(channel, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_direction_sequence
  ON audit_events(direction, sequence DESC);

CREATE TABLE IF NOT EXISTS audit_identity_keys (
  id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
  key_id TEXT NOT NULL,
  key BLOB NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS session_state_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  dedupe_key TEXT UNIQUE,
  session_key TEXT NOT NULL,
  session_id TEXT,
  agent_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  run_id TEXT,
  occurred_at INTEGER NOT NULL,
  summary TEXT NOT NULL,
  payload_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_session_state_events_session_sequence
  ON session_state_events(session_key, sequence DESC);

CREATE INDEX IF NOT EXISTS idx_session_state_events_time
  ON session_state_events(occurred_at DESC, sequence DESC);

CREATE TABLE IF NOT EXISTS session_state_heads (
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  last_sequence INTEGER NOT NULL,
  pruned_max_sequence INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (session_key, agent_id)
);

-- Watcher identity is the bare session key, matching the process-local system-event
-- queue it feeds. Producers only create rows for agent-qualified watcher keys;
-- bare keys (session.scope="global") are ambiguous across agents and are excluded
-- from the notice protocol until watcher identity is agent-scoped end-to-end.
CREATE TABLE IF NOT EXISTS session_watch_cursors (
  watcher_session_key TEXT NOT NULL,
  target_session_key TEXT NOT NULL,
  last_seen_sequence INTEGER NOT NULL DEFAULT 0,
  notified_sequence INTEGER NOT NULL DEFAULT 0,
  material_sequence INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (watcher_session_key, target_session_key)
);

CREATE INDEX IF NOT EXISTS idx_session_watch_cursors_target
  ON session_watch_cursors(target_session_key);

CREATE TABLE IF NOT EXISTS session_upstream_links (
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  catalog_id TEXT NOT NULL,
  host_id TEXT NOT NULL,
  thread_id TEXT NOT NULL,
  upstream_kind TEXT NOT NULL,
  upstream_ref_json TEXT,
  last_marker_json TEXT,
  last_scanned_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  -- (session_key, agent_id) composite identity: under session.scope="global" agents
  -- share bare keys; a key-only row would let one agent overwrite another's upstream.
  PRIMARY KEY (session_key, agent_id)
);

CREATE INDEX IF NOT EXISTS idx_session_upstream_links_catalog_id
  ON session_upstream_links(catalog_id);

CREATE TABLE IF NOT EXISTS diagnostic_stability_bundles (
  bundle_key TEXT NOT NULL PRIMARY KEY,
  reason TEXT NOT NULL,
  generated_at TEXT NOT NULL,
  bundle_json TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_diagnostic_stability_bundles_created
  ON diagnostic_stability_bundles(created_at DESC, bundle_key);

CREATE TABLE IF NOT EXISTS state_leases (
  scope TEXT NOT NULL,
  lease_key TEXT NOT NULL,
  owner TEXT NOT NULL,
  expires_at INTEGER,
  heartbeat_at INTEGER,
  payload_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (scope, lease_key)
);

CREATE INDEX IF NOT EXISTS idx_state_leases_expiry
  ON state_leases(expires_at, scope, lease_key)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_state_leases_owner
  ON state_leases(owner, updated_at DESC);

CREATE TABLE IF NOT EXISTS exec_approvals_config (
  config_key TEXT NOT NULL PRIMARY KEY,
  raw_json TEXT NOT NULL,
  socket_path TEXT,
  has_socket_token INTEGER NOT NULL,
  default_security TEXT,
  default_ask TEXT,
  default_ask_fallback TEXT,
  auto_allow_skills INTEGER,
  agent_count INTEGER NOT NULL,
  allowlist_count INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS operator_approvals (
  approval_id TEXT NOT NULL PRIMARY KEY CHECK (
    length(approval_id) > 0 AND approval_id NOT IN ('.', '..')
  ),
  resolution_ref TEXT NOT NULL CHECK (
    length(resolution_ref) = 43 AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'
  ),
  kind TEXT NOT NULL CHECK (kind IN ('exec', 'plugin')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'allowed', 'denied', 'expired', 'cancelled')),
  presentation_json TEXT NOT NULL,
  requested_by_device_id TEXT,
  requested_by_client_id TEXT,
  requested_by_device_token_auth INTEGER NOT NULL DEFAULT 0,
  reviewer_device_ids_json TEXT NOT NULL,
  source_agent_id TEXT,
  source_session_key TEXT,
  source_session_id TEXT,
  source_run_id TEXT,
  source_tool_call_id TEXT,
  source_tool_name TEXT,
  audience_session_keys_json TEXT NOT NULL,
  runtime_epoch TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  decision TEXT CHECK (decision IN ('allow-once', 'allow-always', 'deny')),
  terminal_reason TEXT CHECK (
    terminal_reason IN (
      'user',
      'timeout',
      'malformed-verdict',
      'no-route',
      'run-aborted',
      'gateway-restart',
      'storage-corrupt'
    )
  ),
  resolved_at_ms INTEGER,
  resolver_kind TEXT CHECK (resolver_kind IN ('device', 'channel', 'runtime', 'system')),
  resolver_id TEXT,
  consumed_at_ms INTEGER,
  consumed_by TEXT,
  CHECK (expires_at_ms >= created_at_ms),
  CHECK (updated_at_ms >= created_at_ms),
  CHECK (resolved_at_ms IS NULL OR resolved_at_ms >= created_at_ms),
  CHECK (resolved_at_ms IS NULL OR resolved_at_ms <= updated_at_ms),
  CHECK (consumed_at_ms IS NULL OR consumed_at_ms >= resolved_at_ms),
  CHECK (consumed_at_ms IS NULL OR consumed_at_ms <= updated_at_ms),
  CHECK (requested_by_device_token_auth IN (0, 1)),
  CHECK (
    (
      status = 'pending'
      AND decision IS NULL
      AND terminal_reason IS NULL
      AND resolved_at_ms IS NULL
      AND resolver_kind IS NULL
      AND resolver_id IS NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
    OR (
      status = 'allowed'
      AND decision IN ('allow-once', 'allow-always')
      AND terminal_reason = 'user'
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
    )
    OR (
      status = 'denied'
      AND decision = 'deny'
      AND terminal_reason IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt')
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
    OR (
      status = 'expired'
      AND decision = 'deny'
      AND terminal_reason = 'timeout'
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
    OR (
      status = 'cancelled'
      AND decision = 'deny'
      AND terminal_reason IN ('run-aborted', 'gateway-restart')
      AND resolved_at_ms IS NOT NULL
      AND resolver_kind IS NOT NULL
      AND consumed_at_ms IS NULL
      AND consumed_by IS NULL
    )
  ),
  CHECK (
    (consumed_at_ms IS NULL AND consumed_by IS NULL)
    OR (
      status = 'allowed'
      AND decision = 'allow-once'
      AND consumed_at_ms IS NOT NULL
      AND consumed_by IS NOT NULL
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_operator_approvals_status_expiry
  ON operator_approvals(status, expires_at_ms, approval_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref
  ON operator_approvals(resolution_ref);

CREATE INDEX IF NOT EXISTS idx_operator_approvals_source_session_created
  ON operator_approvals(source_session_key, created_at_ms DESC, approval_id);

CREATE INDEX IF NOT EXISTS idx_operator_approvals_resolved
  ON operator_approvals(resolved_at_ms, approval_id)
  WHERE resolved_at_ms IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_operator_approvals_runtime_pending
  ON operator_approvals(runtime_epoch, approval_id)
  WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS schema_meta (
  meta_key TEXT NOT NULL PRIMARY KEY,
  role TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  agent_id TEXT,
  app_version TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS device_pairing_pending (
  request_id TEXT NOT NULL PRIMARY KEY,
  device_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  display_name TEXT,
  platform TEXT,
  device_family TEXT,
  client_id TEXT,
  client_mode TEXT,
  role TEXT,
  roles_json TEXT,
  scopes_json TEXT,
  remote_ip TEXT,
  silent INTEGER,
  is_repair INTEGER,
  ts INTEGER NOT NULL,
  refreshed_at_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_device_pairing_pending_device
  ON device_pairing_pending(device_id, ts DESC);

CREATE TABLE IF NOT EXISTS device_pairing_paired (
  device_id TEXT NOT NULL PRIMARY KEY,
  public_key TEXT NOT NULL,
  display_name TEXT,
  operator_label TEXT,
  platform TEXT,
  device_family TEXT,
  client_id TEXT,
  client_mode TEXT,
  role TEXT,
  roles_json TEXT,
  scopes_json TEXT,
  approved_scopes_json TEXT,
  remote_ip TEXT,
  tokens_json TEXT,
  approved_via TEXT,
  node_surface_json TEXT,
  pending_node_surface_json TEXT,
  created_at_ms INTEGER NOT NULL,
  approved_at_ms INTEGER NOT NULL,
  last_seen_at_ms INTEGER,
  last_seen_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_device_pairing_paired_approved
  ON device_pairing_paired(approved_at_ms DESC, device_id);

CREATE TABLE IF NOT EXISTS device_bootstrap_tokens (
  token_key TEXT NOT NULL PRIMARY KEY,
  token TEXT NOT NULL,
  ts INTEGER NOT NULL,
  device_id TEXT,
  public_key TEXT,
  profile_json TEXT,
  redeemed_profile_json TEXT,
  pending_profile_json TEXT,
  issued_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_device_bootstrap_tokens_ts
  ON device_bootstrap_tokens(ts);

CREATE TABLE IF NOT EXISTS device_identities (
  identity_key TEXT NOT NULL PRIMARY KEY,
  device_id TEXT NOT NULL,
  public_key_pem TEXT NOT NULL,
  private_key_pem TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_device_identities_device
  ON device_identities(device_id, updated_at_ms DESC);

CREATE TABLE IF NOT EXISTS device_auth_tokens (
  device_id TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (device_id, role)
);

CREATE INDEX IF NOT EXISTS idx_device_auth_tokens_updated
  ON device_auth_tokens(updated_at_ms DESC, device_id, role);

CREATE TABLE IF NOT EXISTS android_notification_recent_packages (
  package_name TEXT NOT NULL PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_android_notification_recent_packages_order
  ON android_notification_recent_packages(sort_order, package_name);

CREATE TABLE IF NOT EXISTS macos_port_guardian_records (
  pid INTEGER NOT NULL PRIMARY KEY,
  port INTEGER NOT NULL,
  command TEXT NOT NULL,
  mode TEXT NOT NULL,
  timestamp REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_macos_port_guardian_records_port
  ON macos_port_guardian_records(port, timestamp DESC);

CREATE TABLE IF NOT EXISTS workspace_setup_state (
  workspace_key TEXT NOT NULL PRIMARY KEY,
  workspace_path TEXT NOT NULL,
  version INTEGER NOT NULL,
  bootstrap_seeded_at TEXT,
  setup_completed_at TEXT,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workspace_setup_state_path
  ON workspace_setup_state(workspace_path);

CREATE TABLE IF NOT EXISTS native_hook_relay_bridges (
  relay_id TEXT NOT NULL PRIMARY KEY,
  pid INTEGER NOT NULL,
  hostname TEXT NOT NULL,
  port INTEGER NOT NULL,
  token TEXT NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_native_hook_relay_bridges_expires
  ON native_hook_relay_bridges(expires_at_ms, relay_id);

CREATE TABLE IF NOT EXISTS model_capability_cache (
  provider_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  name TEXT NOT NULL,
  input_text INTEGER NOT NULL,
  input_image INTEGER NOT NULL,
  reasoning INTEGER NOT NULL,
  supports_tools INTEGER,
  context_window INTEGER NOT NULL,
  max_tokens INTEGER NOT NULL,
  cost_input REAL NOT NULL,
  cost_output REAL NOT NULL,
  cost_cache_read REAL NOT NULL,
  cost_cache_write REAL NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (provider_id, model_id)
);

CREATE INDEX IF NOT EXISTS idx_model_capability_cache_provider_updated
  ON model_capability_cache(provider_id, updated_at_ms DESC, model_id);

CREATE TABLE IF NOT EXISTS agent_model_catalogs (
  catalog_key TEXT NOT NULL PRIMARY KEY,
  agent_dir TEXT NOT NULL,
  raw_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_model_catalogs_agent_dir
  ON agent_model_catalogs(agent_dir, updated_at DESC);

CREATE TABLE IF NOT EXISTS managed_outgoing_image_records (
  attachment_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  message_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  retention_class TEXT,
  alt TEXT NOT NULL,
  original_media_id TEXT NOT NULL,
  original_media_subdir TEXT NOT NULL,
  original_content_type TEXT NOT NULL,
  original_width INTEGER,
  original_height INTEGER,
  original_size_bytes INTEGER,
  original_filename TEXT,
  record_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_session
  ON managed_outgoing_image_records(session_key, created_at DESC, attachment_id);

CREATE INDEX IF NOT EXISTS idx_managed_outgoing_images_message
  ON managed_outgoing_image_records(session_key, message_id, attachment_id)
  WHERE message_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS channel_pairing_requests (
  channel_key TEXT NOT NULL,
  account_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  meta_json TEXT,
  PRIMARY KEY (channel_key, account_id, request_id)
);

CREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_code
  ON channel_pairing_requests(channel_key, code);

CREATE INDEX IF NOT EXISTS idx_channel_pairing_requests_created
  ON channel_pairing_requests(channel_key, created_at, request_id);

CREATE TABLE IF NOT EXISTS channel_pairing_allow_entries (
  channel_key TEXT NOT NULL,
  account_id TEXT NOT NULL,
  entry TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (channel_key, account_id, entry)
);

CREATE INDEX IF NOT EXISTS idx_channel_pairing_allow_account
  ON channel_pairing_allow_entries(channel_key, account_id, sort_order, entry);

CREATE TABLE IF NOT EXISTS web_push_subscriptions (
  endpoint_hash TEXT NOT NULL PRIMARY KEY,
  subscription_id TEXT NOT NULL UNIQUE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_web_push_subscriptions_updated
  ON web_push_subscriptions(updated_at_ms DESC, subscription_id);

CREATE TABLE IF NOT EXISTS web_push_vapid_keys (
  key_id TEXT NOT NULL PRIMARY KEY,
  public_key TEXT NOT NULL,
  private_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS apns_registrations (
  node_id TEXT NOT NULL PRIMARY KEY,
  transport TEXT NOT NULL,
  token TEXT,
  relay_handle TEXT,
  send_grant TEXT,
  installation_id TEXT,
  topic TEXT NOT NULL,
  environment TEXT NOT NULL,
  distribution TEXT,
  token_debug_suffix TEXT,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_apns_registrations_updated
  ON apns_registrations(updated_at_ms DESC, node_id);

CREATE TABLE IF NOT EXISTS node_host_config (
  config_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  node_id TEXT NOT NULL,
  token TEXT,
  display_name TEXT,
  gateway_host TEXT,
  gateway_port INTEGER,
  gateway_tls INTEGER,
  gateway_tls_fingerprint TEXT,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS voicewake_triggers (
  config_key TEXT NOT NULL,
  position INTEGER NOT NULL,
  trigger TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (config_key, position)
);

CREATE INDEX IF NOT EXISTS idx_voicewake_triggers_trigger
  ON voicewake_triggers(config_key, trigger);

CREATE TABLE IF NOT EXISTS voicewake_routing_config (
  config_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  default_target_mode TEXT NOT NULL,
  default_target_agent_id TEXT,
  default_target_session_key TEXT,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS voicewake_routing_routes (
  config_key TEXT NOT NULL,
  position INTEGER NOT NULL,
  trigger TEXT NOT NULL,
  target_mode TEXT NOT NULL,
  target_agent_id TEXT,
  target_session_key TEXT,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (config_key, position),
  FOREIGN KEY (config_key) REFERENCES voicewake_routing_config(config_key) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_voicewake_routing_routes_trigger
  ON voicewake_routing_routes(config_key, trigger);

CREATE TABLE IF NOT EXISTS update_check_state (
  state_key TEXT NOT NULL PRIMARY KEY,
  last_checked_at TEXT,
  last_notified_version TEXT,
  last_notified_tag TEXT,
  last_available_version TEXT,
  last_available_tag TEXT,
  auto_install_id TEXT,
  auto_first_seen_version TEXT,
  auto_first_seen_tag TEXT,
  auto_first_seen_at TEXT,
  auto_last_attempt_version TEXT,
  auto_last_attempt_at TEXT,
  auto_last_success_version TEXT,
  auto_last_success_at TEXT,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS config_health_entries (
  config_path TEXT NOT NULL PRIMARY KEY,
  last_known_good_json TEXT,
  last_promoted_good_json TEXT,
  last_observed_suspicious_signature TEXT,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS clawhub_promotions_feed_state (
  state_key TEXT NOT NULL PRIMARY KEY,
  etag TEXT,
  payload_json TEXT,
  feed_sequence INTEGER,
  last_checked_at_ms INTEGER,
  notified_slugs_json TEXT NOT NULL DEFAULT '[]',
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS clawhub_promotion_claims (
  slug TEXT NOT NULL PRIMARY KEY,
  provider TEXT,
  model_keys_json TEXT NOT NULL,
  ends_at_ms INTEGER NOT NULL,
  claimed_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS installed_plugin_index (
  index_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  host_contract_version TEXT NOT NULL,
  compat_registry_version TEXT NOT NULL,
  migration_version INTEGER NOT NULL,
  policy_hash TEXT NOT NULL,
  generated_at_ms INTEGER NOT NULL,
  refresh_reason TEXT,
  install_records_json TEXT NOT NULL,
  plugins_json TEXT NOT NULL,
  diagnostics_json TEXT NOT NULL,
  warning TEXT,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_installed_plugin_index_generated
  ON installed_plugin_index(generated_at_ms DESC, index_key);

CREATE TABLE IF NOT EXISTS official_external_plugin_catalog_snapshots (
  feed_url TEXT NOT NULL PRIMARY KEY,
  body TEXT NOT NULL,
  status INTEGER NOT NULL,
  etag TEXT,
  last_modified TEXT,
  checksum TEXT NOT NULL,
  saved_at TEXT NOT NULL,
  trust_mode TEXT,
  trust_key_id TEXT,
  trust_signature_count INTEGER,
  trust_threshold INTEGER,
  trust_verified_at TEXT,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_official_external_plugin_catalog_snapshots_updated
  ON official_external_plugin_catalog_snapshots(updated_at_ms DESC, feed_url);

CREATE TABLE IF NOT EXISTS gateway_restart_sentinel (
  sentinel_key TEXT NOT NULL PRIMARY KEY,
  version INTEGER NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  ts INTEGER NOT NULL,
  session_key TEXT,
  thread_id TEXT,
  delivery_channel TEXT,
  delivery_to TEXT,
  delivery_account_id TEXT,
  message TEXT,
  continuation_json TEXT,
  doctor_hint TEXT,
  stats_json TEXT,
  payload_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_gateway_restart_sentinel_ts
  ON gateway_restart_sentinel(ts DESC, sentinel_key);

CREATE TABLE IF NOT EXISTS gateway_restart_intent (
  intent_key TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  pid INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  reason TEXT,
  force INTEGER,
  wait_ms INTEGER,
  updated_at_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS gateway_restart_handoff (
  handoff_key TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  version INTEGER NOT NULL,
  intent_id TEXT NOT NULL,
  pid INTEGER NOT NULL,
  process_instance_id TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  reason TEXT,
  restart_trace_started_at INTEGER,
  restart_trace_last_at INTEGER,
  source TEXT NOT NULL,
  restart_kind TEXT NOT NULL,
  supervisor_mode TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_gateway_restart_handoff_expiry
  ON gateway_restart_handoff(expires_at, pid);

CREATE TABLE IF NOT EXISTS gateway_boot_lifecycle (
  boot_id TEXT NOT NULL PRIMARY KEY,
  pid INTEGER NOT NULL,
  started_at_ms INTEGER NOT NULL,
  completed_at_ms INTEGER,
  outcome TEXT,
  startup_reason TEXT,
  reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_gateway_boot_lifecycle_started
  ON gateway_boot_lifecycle(started_at_ms);

CREATE TABLE IF NOT EXISTS acp_sessions (
  session_key TEXT NOT NULL PRIMARY KEY,
  session_id TEXT,
  backend TEXT NOT NULL,
  agent TEXT NOT NULL,
  runtime_session_name TEXT NOT NULL,
  identity_json TEXT,
  mode TEXT NOT NULL,
  runtime_options_json TEXT,
  cwd TEXT,
  state TEXT NOT NULL,
  last_activity_at INTEGER NOT NULL,
  last_error TEXT,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_acp_sessions_state_activity
  ON acp_sessions(state, last_activity_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_acp_sessions_agent_activity
  ON acp_sessions(agent, last_activity_at DESC, session_key);

CREATE TABLE IF NOT EXISTS acp_replay_sessions (
  session_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  cwd TEXT NOT NULL,
  complete INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  next_seq INTEGER NOT NULL,
  -- Running estimate of this session's ledger footprint (row overhead plus
  -- all event rows), maintained at insert/trim so budget checks never scan
  -- acp_replay_events (#100622).
  estimated_bytes INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_key_updated
  ON acp_replay_sessions(session_key, complete, updated_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_acp_replay_sessions_updated
  ON acp_replay_sessions(updated_at DESC, session_id);

CREATE TABLE IF NOT EXISTS acp_replay_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  at INTEGER NOT NULL,
  session_key TEXT NOT NULL,
  run_id TEXT,
  update_json TEXT NOT NULL,
  estimated_bytes INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES acp_replay_sessions(session_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_acp_replay_events_session_seq
  ON acp_replay_events(session_id, seq);

CREATE TABLE IF NOT EXISTS agent_databases (
  agent_id TEXT NOT NULL,
  path TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  size_bytes INTEGER,
  PRIMARY KEY (agent_id, path)
);

CREATE TABLE IF NOT EXISTS plugin_state_entries (
  plugin_id TEXT NOT NULL,
  namespace TEXT NOT NULL,
  entry_key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  PRIMARY KEY (plugin_id, namespace, entry_key)
);

CREATE INDEX IF NOT EXISTS idx_plugin_state_expiry
  ON plugin_state_entries(expires_at)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_plugin_state_listing
  ON plugin_state_entries(plugin_id, namespace, created_at, entry_key);

CREATE TABLE IF NOT EXISTS channel_ingress_events (
  queue_name TEXT NOT NULL,
  event_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  status TEXT NOT NULL,
  lane_key TEXT,
  payload_json TEXT NOT NULL,
  metadata_json TEXT,
  received_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  claim_token TEXT,
  claim_owner TEXT,
  claimed_at INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  failed_reason TEXT,
  failed_at INTEGER,
  completed_at INTEGER,
  completed_metadata_json TEXT,
  PRIMARY KEY (queue_name, event_id)
);

CREATE INDEX IF NOT EXISTS idx_channel_ingress_pending
  ON channel_ingress_events(queue_name, status, received_at, event_id);

CREATE INDEX IF NOT EXISTS idx_channel_ingress_claims
  ON channel_ingress_events(queue_name, status, claimed_at);

CREATE INDEX IF NOT EXISTS idx_channel_ingress_lane
  ON channel_ingress_events(queue_name, status, lane_key);

CREATE TABLE IF NOT EXISTS plugin_blob_entries (
  plugin_id TEXT NOT NULL,
  namespace TEXT NOT NULL,
  entry_key TEXT NOT NULL,
  metadata_json TEXT NOT NULL,
  blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  PRIMARY KEY (plugin_id, namespace, entry_key)
);

CREATE INDEX IF NOT EXISTS idx_plugin_blob_expiry
  ON plugin_blob_entries(expires_at)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_plugin_blob_listing
  ON plugin_blob_entries(plugin_id, namespace, created_at, entry_key);

CREATE TABLE IF NOT EXISTS media_blobs (
  subdir TEXT NOT NULL,
  id TEXT NOT NULL,
  content_type TEXT,
  size_bytes INTEGER NOT NULL,
  blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (subdir, id)
);

CREATE INDEX IF NOT EXISTS idx_media_blobs_created
  ON media_blobs(created_at);

CREATE TABLE IF NOT EXISTS skill_uploads (
  upload_id TEXT NOT NULL PRIMARY KEY,
  kind TEXT NOT NULL,
  slug TEXT NOT NULL,
  force INTEGER NOT NULL,
  size_bytes INTEGER NOT NULL,
  sha256 TEXT,
  actual_sha256 TEXT,
  received_bytes INTEGER NOT NULL,
  archive_blob BLOB NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  committed INTEGER NOT NULL,
  committed_at INTEGER,
  idempotency_key_hash TEXT UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_skill_uploads_expiry
  ON skill_uploads(expires_at);

CREATE INDEX IF NOT EXISTS idx_skill_uploads_idempotency
  ON skill_uploads(idempotency_key_hash)
  WHERE idempotency_key_hash IS NOT NULL;

CREATE TABLE IF NOT EXISTS capture_sessions (
  id TEXT NOT NULL PRIMARY KEY,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  mode TEXT NOT NULL,
  source_scope TEXT NOT NULL,
  source_process TEXT NOT NULL,
  proxy_url TEXT
);

CREATE TABLE IF NOT EXISTS capture_blobs (
  blob_id TEXT NOT NULL PRIMARY KEY,
  content_type TEXT,
  encoding TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  sha256 TEXT NOT NULL,
  data BLOB NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS capture_events (
  id INTEGER NOT NULL PRIMARY KEY,
  session_id TEXT NOT NULL,
  ts INTEGER NOT NULL,
  source_scope TEXT NOT NULL,
  source_process TEXT NOT NULL,
  protocol TEXT NOT NULL,
  direction TEXT NOT NULL,
  kind TEXT NOT NULL,
  flow_id TEXT NOT NULL,
  method TEXT,
  host TEXT,
  path TEXT,
  status INTEGER,
  close_code INTEGER,
  content_type TEXT,
  headers_json TEXT,
  data_text TEXT,
  data_blob_id TEXT,
  data_sha256 TEXT,
  error_text TEXT,
  meta_json TEXT,
  FOREIGN KEY (session_id) REFERENCES capture_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (data_blob_id) REFERENCES capture_blobs(blob_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS capture_events_session_ts_idx
  ON capture_events(session_id, ts);

CREATE INDEX IF NOT EXISTS capture_events_flow_idx
  ON capture_events(flow_id, ts);

CREATE TABLE IF NOT EXISTS sandbox_registry_entries (
  registry_kind TEXT NOT NULL,
  container_name TEXT NOT NULL,
  session_key TEXT,
  backend_id TEXT,
  runtime_label TEXT,
  image TEXT,
  created_at_ms INTEGER,
  last_used_at_ms INTEGER,
  config_label_kind TEXT,
  config_hash TEXT,
  cdp_port INTEGER,
  no_vnc_port INTEGER,
  entry_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (registry_kind, container_name)
);

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_updated
  ON sandbox_registry_entries(registry_kind, updated_at DESC, container_name);

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_session
  ON sandbox_registry_entries(registry_kind, session_key, last_used_at_ms DESC, container_name)
  WHERE session_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sandbox_registry_last_used
  ON sandbox_registry_entries(registry_kind, last_used_at_ms DESC, container_name)
  WHERE last_used_at_ms IS NOT NULL;

CREATE TABLE IF NOT EXISTS commitments (
  id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT,
  recipient_id TEXT,
  thread_id TEXT,
  sender_id TEXT,
  kind TEXT NOT NULL,
  sensitivity TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  dedupe_key TEXT NOT NULL,
  confidence REAL NOT NULL,
  due_earliest_ms INTEGER NOT NULL,
  due_latest_ms INTEGER NOT NULL,
  due_timezone TEXT NOT NULL,
  source_message_id TEXT,
  source_run_id TEXT,
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  last_attempt_at_ms INTEGER,
  sent_at_ms INTEGER,
  dismissed_at_ms INTEGER,
  snoozed_until_ms INTEGER,
  expired_at_ms INTEGER,
  record_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_commitments_scope_due
  ON commitments(agent_id, session_key, status, due_earliest_ms, due_latest_ms);

CREATE INDEX IF NOT EXISTS idx_commitments_status_due
  ON commitments(status, due_earliest_ms, due_latest_ms);

CREATE INDEX IF NOT EXISTS idx_commitments_scope_dedupe
  ON commitments(agent_id, session_key, channel, dedupe_key, status);

CREATE TABLE IF NOT EXISTS cron_jobs (
  store_key TEXT NOT NULL,
  job_id TEXT NOT NULL,
  declaration_key TEXT,
  display_name TEXT,
  owner_agent_id TEXT,
  owner_session_key TEXT,
  name TEXT NOT NULL,
  description TEXT,
  enabled INTEGER NOT NULL,
  delete_after_run INTEGER,
  created_at_ms INTEGER NOT NULL,
  agent_id TEXT,
  session_key TEXT,
  schedule_kind TEXT NOT NULL,
  schedule_expr TEXT,
  schedule_tz TEXT,
  every_ms INTEGER,
  anchor_ms INTEGER,
  at TEXT,
  stagger_ms INTEGER,
  session_target TEXT NOT NULL,
  wake_mode TEXT NOT NULL,
  trigger_script TEXT,
  trigger_once INTEGER,
  payload_kind TEXT NOT NULL,
  payload_message TEXT,
  payload_model TEXT,
  payload_fallbacks_json TEXT,
  payload_thinking TEXT,
  payload_timeout_seconds INTEGER,
  payload_allow_unsafe_external_content INTEGER,
  payload_external_content_source_json TEXT,
  payload_light_context INTEGER,
  payload_tools_allow_json TEXT,
  payload_tools_allow_is_default INTEGER,
  delivery_mode TEXT,
  delivery_channel TEXT,
  delivery_to TEXT,
  delivery_thread_id TEXT,
  delivery_thread_id_type TEXT,
  delivery_account_id TEXT,
  delivery_best_effort INTEGER,
  delivery_completion_mode TEXT,
  delivery_completion_to TEXT,
  failure_delivery_mode TEXT,
  failure_delivery_channel TEXT,
  failure_delivery_to TEXT,
  failure_delivery_account_id TEXT,
  failure_alert_disabled INTEGER,
  failure_alert_after INTEGER,
  failure_alert_channel TEXT,
  failure_alert_to TEXT,
  failure_alert_cooldown_ms INTEGER,
  failure_alert_include_skipped INTEGER,
  failure_alert_mode TEXT,
  failure_alert_account_id TEXT,
  next_run_at_ms INTEGER,
  running_at_ms INTEGER,
  last_run_at_ms INTEGER,
  last_run_status TEXT,
  last_error TEXT,
  last_duration_ms INTEGER,
  consecutive_errors INTEGER,
  consecutive_skipped INTEGER,
  schedule_error_count INTEGER,
  last_delivery_status TEXT,
  last_delivery_error TEXT,
  last_delivered INTEGER,
  last_failure_alert_at_ms INTEGER,
  job_json TEXT NOT NULL,
  state_json TEXT NOT NULL DEFAULT '{}',
  runtime_updated_at_ms INTEGER,
  schedule_identity TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (store_key, job_id)
);

CREATE INDEX IF NOT EXISTS idx_cron_jobs_store_updated
  ON cron_jobs(store_key, sort_order ASC, updated_at DESC, job_id);

CREATE INDEX IF NOT EXISTS idx_cron_jobs_store_order
  ON cron_jobs(store_key, sort_order ASC, updated_at ASC, job_id);

CREATE INDEX IF NOT EXISTS idx_cron_jobs_enabled_next_run
  ON cron_jobs(store_key, enabled, next_run_at_ms, job_id)
  WHERE next_run_at_ms IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cron_jobs_agent_session
  ON cron_jobs(agent_id, session_key, updated_at DESC, job_id)
  WHERE agent_id IS NOT NULL OR session_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS command_log_entries (
  id TEXT NOT NULL PRIMARY KEY,
  timestamp_ms INTEGER NOT NULL,
  action TEXT NOT NULL,
  session_key TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  source TEXT NOT NULL,
  entry_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_command_log_entries_timestamp
  ON command_log_entries(timestamp_ms DESC, id);

CREATE INDEX IF NOT EXISTS idx_command_log_entries_session
  ON command_log_entries(session_key, timestamp_ms DESC, id);

CREATE TABLE IF NOT EXISTS delivery_queue_entries (
  queue_name TEXT NOT NULL,
  id TEXT NOT NULL,
  status TEXT NOT NULL,
  entry_kind TEXT,
  session_key TEXT,
  channel TEXT,
  target TEXT,
  account_id TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  last_error TEXT,
  recovery_state TEXT,
  platform_send_started_at INTEGER,
  entry_json TEXT NOT NULL,
  enqueued_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  failed_at INTEGER,
  PRIMARY KEY (queue_name, id)
);

CREATE INDEX IF NOT EXISTS idx_delivery_queue_pending
  ON delivery_queue_entries(queue_name, status, enqueued_at, id);

CREATE INDEX IF NOT EXISTS idx_delivery_queue_failed
  ON delivery_queue_entries(queue_name, status, failed_at, id);

CREATE INDEX IF NOT EXISTS idx_delivery_queue_session
  ON delivery_queue_entries(queue_name, status, session_key, enqueued_at, id)
  WHERE session_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_delivery_queue_target
  ON delivery_queue_entries(queue_name, status, channel, target, enqueued_at, id)
  WHERE channel IS NOT NULL AND target IS NOT NULL;

CREATE TABLE IF NOT EXISTS task_runs (
  task_id TEXT NOT NULL PRIMARY KEY,
  runtime TEXT NOT NULL,
  task_kind TEXT,
  source_id TEXT,
  requester_session_key TEXT,
  owner_key TEXT NOT NULL,
  scope_kind TEXT NOT NULL,
  child_session_key TEXT,
  parent_flow_id TEXT,
  parent_task_id TEXT,
  agent_id TEXT,
  requester_agent_id TEXT,
  run_id TEXT,
  label TEXT,
  task TEXT NOT NULL,
  status TEXT NOT NULL,
  delivery_status TEXT NOT NULL,
  notify_policy TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  ended_at INTEGER,
  last_event_at INTEGER,
  cleanup_after INTEGER,
  tool_use_count INTEGER,
  last_tool_name TEXT,
  error TEXT,
  progress_summary TEXT,
  terminal_summary TEXT,
  terminal_outcome TEXT,
  detail_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_task_runs_run_id ON task_runs(run_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_status ON task_runs(status);
CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_status ON task_runs(runtime, status);
CREATE INDEX IF NOT EXISTS idx_task_runs_cleanup_after ON task_runs(cleanup_after);
CREATE INDEX IF NOT EXISTS idx_task_runs_last_event_at ON task_runs(last_event_at);
CREATE INDEX IF NOT EXISTS idx_task_runs_owner_key ON task_runs(owner_key);
CREATE INDEX IF NOT EXISTS idx_task_runs_parent_flow_id ON task_runs(parent_flow_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_child_session_key ON task_runs(child_session_key);
CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_source_ended
  ON task_runs(runtime, source_id, ended_at, created_at, task_id);
CREATE INDEX IF NOT EXISTS idx_task_runs_runtime_ended
  ON task_runs(runtime, ended_at, created_at, task_id);

CREATE TABLE IF NOT EXISTS subagent_runs (
  run_id TEXT NOT NULL PRIMARY KEY,
  child_session_key TEXT NOT NULL,
  controller_session_key TEXT,
  requester_session_key TEXT NOT NULL,
  requester_display_key TEXT NOT NULL,
  requester_origin_json TEXT,
  task TEXT NOT NULL,
  task_name TEXT,
  cleanup TEXT NOT NULL,
  label TEXT,
  model TEXT,
  agent_dir TEXT,
  workspace_dir TEXT,
  run_timeout_seconds INTEGER,
  spawn_mode TEXT,
  created_at INTEGER NOT NULL,
  started_at INTEGER,
  session_started_at INTEGER,
  accumulated_runtime_ms INTEGER,
  ended_at INTEGER,
  outcome_json TEXT,
  archive_at_ms INTEGER,
  cleanup_completed_at INTEGER,
  cleanup_handled INTEGER,
  suppress_announce_reason TEXT,
  expects_completion_message INTEGER,
  announce_retry_count INTEGER,
  last_announce_retry_at INTEGER,
  last_announce_delivery_error TEXT,
  ended_reason TEXT,
  pause_reason TEXT,
  wake_on_descendant_settle INTEGER,
  frozen_result_text TEXT,
  frozen_result_captured_at INTEGER,
  fallback_frozen_result_text TEXT,
  fallback_frozen_result_captured_at INTEGER,
  ended_hook_emitted_at INTEGER,
  pending_final_delivery INTEGER,
  pending_final_delivery_created_at INTEGER,
  pending_final_delivery_last_attempt_at INTEGER,
  pending_final_delivery_attempt_count INTEGER,
  pending_final_delivery_last_error TEXT,
  pending_final_delivery_payload_json TEXT,
  completion_announced_at INTEGER,
  payload_json TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_subagent_runs_child_session_key
  ON subagent_runs(child_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_requester_session_key
  ON subagent_runs(requester_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_controller_session_key
  ON subagent_runs(controller_session_key, created_at DESC, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_archive_at
  ON subagent_runs(archive_at_ms, cleanup_handled, run_id);
CREATE INDEX IF NOT EXISTS idx_subagent_runs_ended_cleanup
  ON subagent_runs(ended_at, cleanup_handled, run_id);

CREATE TABLE IF NOT EXISTS current_conversation_bindings (
  binding_key TEXT NOT NULL PRIMARY KEY,
  binding_id TEXT NOT NULL,
  target_agent_id TEXT NOT NULL,
  target_session_id TEXT,
  target_session_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  conversation_kind TEXT NOT NULL,
  parent_conversation_id TEXT,
  conversation_id TEXT NOT NULL,
  target_kind TEXT NOT NULL,
  status TEXT NOT NULL,
  bound_at INTEGER NOT NULL,
  expires_at INTEGER,
  metadata_json TEXT,
  record_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_target
  ON current_conversation_bindings(target_agent_id, target_session_key, updated_at DESC, binding_key);
CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_conversation
  ON current_conversation_bindings(channel, account_id, conversation_kind, conversation_id);
CREATE INDEX IF NOT EXISTS idx_current_conversation_bindings_expires
  ON current_conversation_bindings(expires_at, binding_key);

CREATE TABLE IF NOT EXISTS plugin_binding_approvals (
  plugin_root TEXT NOT NULL,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  plugin_id TEXT NOT NULL,
  plugin_name TEXT,
  approved_at INTEGER NOT NULL,
  PRIMARY KEY (plugin_root, channel, account_id)
);

CREATE INDEX IF NOT EXISTS idx_plugin_binding_approvals_plugin
  ON plugin_binding_approvals(plugin_id, approved_at DESC);

CREATE TABLE IF NOT EXISTS tui_last_sessions (
  scope_key TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tui_last_sessions_session_key
  ON tui_last_sessions(session_key, updated_at DESC, scope_key);

CREATE TABLE IF NOT EXISTS task_delivery_state (
  task_id TEXT NOT NULL PRIMARY KEY,
  requester_origin_json TEXT,
  last_notified_event_at INTEGER,
  FOREIGN KEY (task_id) REFERENCES task_runs(task_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS flow_runs (
  flow_id TEXT NOT NULL PRIMARY KEY,
  shape TEXT,
  sync_mode TEXT NOT NULL DEFAULT 'managed',
  owner_key TEXT NOT NULL,
  requester_origin_json TEXT,
  controller_id TEXT,
  revision INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  notify_policy TEXT NOT NULL,
  goal TEXT NOT NULL,
  current_step TEXT,
  blocked_task_id TEXT,
  blocked_summary TEXT,
  state_json TEXT,
  wait_json TEXT,
  cancel_requested_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  ended_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_flow_runs_status ON flow_runs(status);
CREATE INDEX IF NOT EXISTS idx_flow_runs_owner_key ON flow_runs(owner_key);
CREATE INDEX IF NOT EXISTS idx_flow_runs_updated_at ON flow_runs(updated_at);

CREATE TABLE IF NOT EXISTS migration_runs (
  id TEXT NOT NULL PRIMARY KEY,
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  status TEXT NOT NULL,
  report_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_migration_runs_started
  ON migration_runs(started_at DESC, id);

CREATE TABLE IF NOT EXISTS migration_sources (
  source_key TEXT NOT NULL PRIMARY KEY,
  migration_kind TEXT NOT NULL,
  source_path TEXT NOT NULL,
  target_table TEXT NOT NULL,
  source_sha256 TEXT,
  source_size_bytes INTEGER,
  source_record_count INTEGER,
  last_run_id TEXT NOT NULL,
  status TEXT NOT NULL,
  imported_at INTEGER NOT NULL,
  removed_source INTEGER NOT NULL DEFAULT 0,
  report_json TEXT NOT NULL,
  FOREIGN KEY (last_run_id) REFERENCES migration_runs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_migration_sources_path
  ON migration_sources(source_path, migration_kind, target_table);

CREATE INDEX IF NOT EXISTS idx_migration_sources_run
  ON migration_sources(last_run_id, source_path);

CREATE TABLE IF NOT EXISTS backup_runs (
  id TEXT NOT NULL PRIMARY KEY,
  created_at INTEGER NOT NULL,
  archive_path TEXT NOT NULL,
  status TEXT NOT NULL,
  manifest_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_backup_runs_created
  ON backup_runs(created_at DESC, id);

CREATE TABLE IF NOT EXISTS worktrees (
  id TEXT NOT NULL PRIMARY KEY,
  repo_fingerprint TEXT NOT NULL,
  repo_root TEXT NOT NULL,
  path TEXT NOT NULL,
  branch TEXT NOT NULL,
  base_ref TEXT NOT NULL,
  owner_kind TEXT NOT NULL CHECK (owner_kind IN ('manual', 'workboard', 'session')),
  owner_id TEXT,
  snapshot_ref TEXT,
  created_at INTEGER NOT NULL,
  last_active_at INTEGER NOT NULL,
  removed_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_worktrees_repo_fingerprint
  ON worktrees(repo_fingerprint);

CREATE INDEX IF NOT EXISTS idx_worktrees_removed_at
  ON worktrees(removed_at);

-- Gateway-owned custom session group catalog (names + display order).
-- Membership stays on each session entry's category field; this table only
-- owns which groups exist and how operator UIs order them.
CREATE TABLE IF NOT EXISTS session_groups (
  name TEXT NOT NULL PRIMARY KEY,
  position INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

-- Gateway-owned durable cloud worker lifecycle. Provider-specific execution
-- stays in plugins; this table records only core reconciliation facts.
CREATE TABLE IF NOT EXISTS worker_environments (
  environment_id TEXT NOT NULL PRIMARY KEY,
  provider_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  profile_snapshot_json TEXT NOT NULL,
  provision_operation_id TEXT NOT NULL UNIQUE,
  lease_id TEXT,
  ssh_host TEXT,
  ssh_port INTEGER CHECK (ssh_port IS NULL OR (ssh_port >= 1 AND ssh_port <= 65535)),
  ssh_user TEXT,
  ssh_host_key TEXT,
  ssh_key_ref_json TEXT,
  state TEXT NOT NULL CHECK (
    state IN (
      'requested',
      'provisioning',
      'bootstrapping',
      'ready',
      'attached',
      'idle',
      'draining',
      'destroying',
      'destroyed',
      'failed',
      'orphaned'
    )
  ),
  bootstrap_bundle_hash TEXT,
  bootstrap_openclaw_version TEXT,
  bootstrap_protocol_features_json TEXT,
  owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0),
  teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed')),
  attached_session_ids_json TEXT NOT NULL DEFAULT '[]',
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  state_changed_at_ms INTEGER NOT NULL,
  idle_since_at_ms INTEGER,
  destroy_requested_at_ms INTEGER,
  last_error TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_worker_environments_provider_lease
  ON worker_environments(provider_id, lease_id)
  WHERE lease_id IS NOT NULL;

-- Session placement lives in the shared state database so local admission,
-- worker admission, and environment attachment use one durable authority.
CREATE TABLE IF NOT EXISTS worker_session_placements (
  session_id TEXT NOT NULL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  session_key TEXT NOT NULL,
  state TEXT NOT NULL CHECK (
    state IN (
      'local',
      'requested',
      'provisioning',
      'syncing',
      'starting',
      'active',
      'draining',
      'reconciling',
      'reclaimed',
      'failed'
    )
  ),
  environment_id TEXT,
  transition_generation INTEGER NOT NULL DEFAULT 0 CHECK (transition_generation >= 0),
  active_owner_epoch INTEGER CHECK (active_owner_epoch IS NULL OR active_owner_epoch >= 1),
  workspace_base_manifest_ref TEXT,
  remote_workspace_dir TEXT,
  worker_bundle_hash TEXT,
  last_transcript_ack_cursor INTEGER CHECK (
    last_transcript_ack_cursor IS NULL OR last_transcript_ack_cursor >= 0
  ),
  last_live_event_ack_cursor INTEGER CHECK (
    last_live_event_ack_cursor IS NULL OR last_live_event_ack_cursor >= 0
  ),
  recovery_error TEXT,
  turn_claim_owner TEXT CHECK (turn_claim_owner IN ('local', 'worker')),
  turn_claim_id TEXT,
  turn_claim_run_id TEXT,
  turn_claim_generation INTEGER CHECK (
    turn_claim_generation IS NULL OR turn_claim_generation >= 0
  ),
  turn_claim_owner_epoch INTEGER CHECK (
    turn_claim_owner_epoch IS NULL OR turn_claim_owner_epoch >= 1
  ),
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  state_changed_at_ms INTEGER NOT NULL,
  CHECK (
    (state IN ('local', 'requested')
      AND environment_id IS NULL AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL
      AND worker_bundle_hash IS NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IS 'provisioning'
      AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL
      AND worker_bundle_hash IS NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IS 'syncing'
      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NULL AND remote_workspace_dir IS NULL
      AND worker_bundle_hash IS NOT NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IS 'starting'
      AND environment_id IS NOT NULL AND active_owner_epoch IS NULL
      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL
      AND worker_bundle_hash IS NOT NULL
      AND last_transcript_ack_cursor IS NULL AND last_live_event_ack_cursor IS NULL
      AND recovery_error IS NULL)
    OR
    (state IN ('active', 'draining', 'reconciling')
      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL
      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL
      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL)
    OR
    (state IS 'reclaimed'
      AND environment_id IS NOT NULL AND active_owner_epoch IS NOT NULL
      AND workspace_base_manifest_ref IS NOT NULL AND remote_workspace_dir IS NOT NULL
      AND worker_bundle_hash IS NOT NULL AND recovery_error IS NULL
      AND turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL
      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)
    OR
    (state IS 'failed' AND recovery_error IS NOT NULL)
  ),
  CHECK (
    (turn_claim_owner IS NULL AND turn_claim_id IS NULL AND turn_claim_run_id IS NULL
      AND turn_claim_generation IS NULL AND turn_claim_owner_epoch IS NULL)
    OR
    (turn_claim_owner IS 'local' AND turn_claim_id IS NOT NULL
      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL
      AND turn_claim_owner_epoch IS NULL)
    OR
    (turn_claim_owner IS 'worker' AND turn_claim_id IS NOT NULL
      AND turn_claim_run_id IS NOT NULL AND turn_claim_generation IS NOT NULL
      AND turn_claim_owner_epoch IS NOT NULL)
  ),
  CHECK (
    turn_claim_owner IS NULL
    OR
    (turn_claim_owner IS 'local' AND state IN ('local', 'requested', 'failed'))
    OR
    (turn_claim_owner IS 'worker' AND state IN ('active', 'draining')
      AND turn_claim_owner_epoch IS active_owner_epoch)
  )
);

CREATE INDEX IF NOT EXISTS idx_worker_session_placements_session_key
  ON worker_session_placements(agent_id, session_key);

CREATE INDEX IF NOT EXISTS idx_worker_session_placements_reconcile
  ON worker_session_placements(updated_at_ms, session_id);

-- One active, opaque admission credential per worker environment. Plaintext
-- may be retried until delivery acknowledgement but never enters durable state.
CREATE TABLE IF NOT EXISTS worker_environment_credentials (
  environment_id TEXT NOT NULL PRIMARY KEY,
  credential_hash TEXT NOT NULL UNIQUE,
  bundle_hash TEXT NOT NULL,
  session_id TEXT,
  rpc_set_version INTEGER NOT NULL CHECK (rpc_set_version >= 1),
  owner_epoch INTEGER NOT NULL CHECK (owner_epoch >= 0),
  expires_at_ms INTEGER NOT NULL CHECK (expires_at_ms >= 0),
  delivered_at_ms INTEGER CHECK (delivered_at_ms >= 0),
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE
);

-- One durable sequence cursor per attached session owner epoch. The environment
-- binding prevents independent workers with coincident epochs from sharing replay state.
CREATE TABLE IF NOT EXISTS worker_transcript_commit_heads (
  session_id TEXT NOT NULL,
  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),
  environment_id TEXT NOT NULL,
  next_seq INTEGER NOT NULL CHECK (next_seq >= 1),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, run_epoch)
);

-- Pending rows preserve a claimed request across gateway restarts. Terminal rows
-- cache the exact result returned for deterministic at-least-once replay.
CREATE TABLE IF NOT EXISTS worker_transcript_commits (
  session_id TEXT NOT NULL,
  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),
  seq INTEGER NOT NULL CHECK (seq >= 1),
  request_hash TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),
  result_json TEXT,
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, run_epoch, seq),
  FOREIGN KEY (session_id, run_epoch)
    REFERENCES worker_transcript_commit_heads(session_id, run_epoch)
    ON DELETE CASCADE,
  CHECK (
    (state = 'pending' AND result_json IS NULL) OR
    (state = 'terminal' AND result_json IS NOT NULL)
  )
);

-- Pending rows preserve a claimed inference turn across gateway restarts.
-- Terminal rows cache the exact outcome returned for deterministic replay.
CREATE TABLE IF NOT EXISTS worker_inference_turns (
  session_id TEXT NOT NULL,
  run_epoch INTEGER NOT NULL CHECK (run_epoch >= 0),
  run_id TEXT NOT NULL,
  turn_id TEXT NOT NULL,
  environment_id TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending', 'terminal')),
  terminal_json TEXT,
  created_at_ms INTEGER NOT NULL CHECK (created_at_ms >= 0),
  updated_at_ms INTEGER NOT NULL CHECK (updated_at_ms >= 0),
  PRIMARY KEY (session_id, run_epoch, run_id, turn_id),
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE,
  CHECK (
    (state = 'pending' AND terminal_json IS NULL) OR
    (state = 'terminal' AND terminal_json IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_worker_inference_turns_pending_run
  ON worker_inference_turns(session_id, run_epoch, run_id)
  WHERE state = 'pending';

CREATE TABLE IF NOT EXISTS fleet_cells (
  tenant_id TEXT NOT NULL PRIMARY KEY,
  created_at_ms INTEGER NOT NULL,
  image TEXT NOT NULL,
  runtime TEXT NOT NULL,
  host_port INTEGER NOT NULL,
  container_name TEXT NOT NULL,
  data_dir TEXT NOT NULL
);\n`;
/** Maximum time one synchronous SQLite call may wait for a lock. */
const OPENCLAW_SQLITE_BUSY_TIMEOUT_MS = 5e3;
const OPENCLAW_STATE_DIR_MODE = 448;
const OPENCLAW_STATE_FILE_MODE = 384;
const OPENCLAW_STATE_CANONICAL_UNIQUE_INDEXES = [
  {
    name: "idx_operator_approvals_resolution_ref",
    definition: "ON operator_approvals(resolution_ref)",
  },
  {
    name: "idx_worker_environments_provider_lease",
    definition: `
      ON worker_environments(provider_id, lease_id)
      WHERE lease_id IS NOT NULL
    `,
  },
];
const OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY = {
  allowedColumnDefinitions: {
    "commitments.attempts": ["attempts INTEGER NOT NULL DEFAULT 0"],
    "commitments.confidence": ["confidence REAL NOT NULL DEFAULT 0"],
    "commitments.created_at_ms": ["created_at_ms INTEGER NOT NULL DEFAULT 0"],
    "commitments.dedupe_key": ["dedupe_key TEXT NOT NULL DEFAULT ''"],
    "commitments.due_timezone": ["due_timezone TEXT NOT NULL DEFAULT 'UTC'"],
    "commitments.kind": ["kind TEXT NOT NULL DEFAULT 'followup'"],
    "commitments.reason": ["reason TEXT NOT NULL DEFAULT ''"],
    "commitments.sensitivity": ["sensitivity TEXT NOT NULL DEFAULT 'normal'"],
    "commitments.source": ["source TEXT NOT NULL DEFAULT 'unknown'"],
    "commitments.suggested_text": ["suggested_text TEXT NOT NULL DEFAULT ''"],
    "cron_jobs.created_at_ms": ["created_at_ms INTEGER NOT NULL DEFAULT 0"],
    "cron_jobs.enabled": ["enabled INTEGER NOT NULL DEFAULT 1"],
    "cron_jobs.name": ["name TEXT NOT NULL DEFAULT ''"],
    "cron_jobs.payload_kind": ["payload_kind TEXT NOT NULL DEFAULT 'message'"],
    "cron_jobs.schedule_kind": ["schedule_kind TEXT NOT NULL DEFAULT 'manual'"],
    "cron_jobs.session_target": ["session_target TEXT NOT NULL DEFAULT 'main'"],
    "cron_jobs.wake_mode": ["wake_mode TEXT NOT NULL DEFAULT 'auto'"],
    "current_conversation_bindings.conversation_kind": [
      "conversation_kind TEXT NOT NULL DEFAULT 'channel'",
    ],
    "current_conversation_bindings.target_agent_id": [
      "target_agent_id TEXT NOT NULL DEFAULT 'main'",
    ],
  },
};
const cachedDatabases = /* @__PURE__ */ new Map();
function assertSupportedSchemaVersion(db, pathname) {
  const userVersion = readSqliteUserVersion(db);
  if (userVersion > 2)
    throw createNewerSqliteSchemaVersionError("OpenClaw state database", pathname, userVersion, 2);
}
/** Require the canonical shared-state owner and schema before offline file maintenance. */
function assertOpenClawStateDatabaseForMaintenance(database, options) {
  const userVersion = readSqliteUserVersion(database);
  if (userVersion > 2)
    throw createNewerSqliteSchemaVersionError(
      "OpenClaw state database",
      options.pathname,
      userVersion,
      2,
    );
  if (userVersion !== 2)
    throw new Error(
      `OpenClaw state database ${options.pathname} uses schema version ${userVersion}; run openclaw doctor --fix before compacting it.`,
    );
  const metadata = database
    .prepare("SELECT role, schema_version FROM schema_meta WHERE meta_key = 'primary' LIMIT 1")
    .get();
  if (metadata?.role !== "global") {
    const role = typeof metadata?.role === "string" ? metadata.role : "missing";
    throw new Error(
      `OpenClaw state database ${options.pathname} has schema role ${role}; expected global.`,
    );
  }
  if (metadata.schema_version !== 2) {
    const schemaVersion =
      typeof metadata.schema_version === "number" ? metadata.schema_version : "invalid";
    throw new Error(
      `OpenClaw state database ${options.pathname} metadata schema version ${schemaVersion} does not match 2; run openclaw doctor --fix before compacting it.`,
    );
  }
  assertSqliteSchemaContains(
    database,
    options.pathname,
    OPENCLAW_STATE_SCHEMA_SQL,
    OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY,
  );
}
const stateDbLog = createSubsystemLogger("state/db");
/** Targets already warned about, so chmod-less filesystems warn once per path. */
const chmodWarnedTargets = /* @__PURE__ */ new Set();
function bestEffortChmodSync(target, mode) {
  const result = applyPrivateModeSync(target, mode);
  if (result.applied || chmodWarnedTargets.has(target)) return;
  chmodWarnedTargets.add(target);
  stateDbLog.warn(`skipped permission hardening for ${target}: ${String(result.error)}`);
}
function ensureOpenClawStatePermissions(pathname, env) {
  const dir = path.dirname(pathname);
  const defaultDir = resolveOpenClawStateSqliteDir(env);
  const isDefaultStateDatabase =
    path.resolve(pathname) === path.resolve(resolveOpenClawStateSqlitePath(env));
  if (isDefaultStateDatabase && dir !== defaultDir)
    throw new Error(`OpenClaw state database path resolved outside its state dir: ${pathname}`);
  const dirExisted = existsSync(dir);
  mkdirSync(dir, {
    recursive: true,
    mode: OPENCLAW_STATE_DIR_MODE,
  });
  if (isDefaultStateDatabase || !dirExisted) bestEffortChmodSync(dir, OPENCLAW_STATE_DIR_MODE);
  for (const candidate of resolveSqliteDatabaseFilePaths(pathname))
    if (existsSync(candidate)) bestEffortChmodSync(candidate, OPENCLAW_STATE_FILE_MODE);
}
function ensureOperatorApprovalResolutionRefs(db) {
  if (!tableExists(db, "operator_approvals")) return;
  runSqliteImmediateTransactionSync(db, () => {
    ensureColumn(db, "operator_approvals", "resolution_ref TEXT");
    const rows = db
      .prepare("SELECT approval_id, kind, resolution_ref FROM operator_approvals")
      .all();
    const update = db.prepare(
      "UPDATE operator_approvals SET resolution_ref = ? WHERE approval_id = ?",
    );
    for (const row of rows) {
      if (typeof row.approval_id !== "string" || (row.kind !== "exec" && row.kind !== "plugin"))
        throw new Error("operator approval row cannot be assigned a transport reference");
      const resolutionRef = buildApprovalResolutionRef({
        approvalId: row.approval_id,
        approvalKind: row.kind,
      });
      if (row.resolution_ref !== resolutionRef) update.run(resolutionRef, row.approval_id);
    }
    if (
      db
        .prepare(`SELECT canonical.approval_id
         FROM operator_approvals AS canonical
         JOIN operator_approvals AS referenced
           ON canonical.approval_id = referenced.resolution_ref
         WHERE canonical.approval_id <> referenced.approval_id
         LIMIT 1`)
        .get()
    )
      throw new Error("operator approval ids conflict with durable transport references");
    db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref
        ON operator_approvals(resolution_ref);
    `);
  });
}
function repairLegacyTaskAgentAttribution(db) {
  if (!tableExists(db, "task_runs") || !tableHasColumn(db, "task_runs", "requester_agent_id"))
    return;
  db.exec(`
    UPDATE task_runs
    SET
      requester_agent_id = CASE
        WHEN owner_key GLOB 'agent:*:*' THEN substr(
          owner_key,
          7,
          instr(substr(owner_key, 7), ':') - 1
        )
        WHEN requester_session_key GLOB 'agent:*:*' THEN substr(
          requester_session_key,
          7,
          instr(substr(requester_session_key, 7), ':') - 1
        )
        WHEN agent_id <> substr(
          child_session_key,
          7,
          instr(substr(child_session_key, 7), ':') - 1
        ) THEN agent_id
        ELSE NULL
      END,
      agent_id = substr(
        child_session_key,
        7,
        instr(substr(child_session_key, 7), ':') - 1
      )
    WHERE requester_agent_id IS NULL
      AND runtime IN ('subagent', 'acp')
      AND child_session_key GLOB 'agent:*:*'
      AND instr(substr(child_session_key, 7), ':') > 1
      AND (
        owner_key GLOB 'agent:*:*'
        OR requester_session_key GLOB 'agent:*:*'
        OR (
          agent_id IS NOT NULL
          AND agent_id <> substr(
            child_session_key,
            7,
            instr(substr(child_session_key, 7), ':') - 1
          )
        )
      );
  `);
}
function repairLegacyTaskDeliveryStatuses(db) {
  if (!tableExists(db, "task_runs") || !tableHasColumn(db, "task_runs", "delivery_status")) return;
  db.exec(`
    UPDATE task_runs
    SET delivery_status = 'not_applicable'
    WHERE delivery_status = 'not-requested';
  `);
}
function hasCanonicalAgentDatabasesPrimaryKey(db) {
  if (!tableExists(db, "agent_databases")) return true;
  const primaryKey = tablePrimaryKeyColumns(db, "agent_databases");
  return primaryKey.length === 2 && primaryKey[0] === "agent_id" && primaryKey[1] === "path";
}
function canRepairAgentDatabasesPrimaryKey(db) {
  if (!tableExists(db, "agent_databases")) return false;
  return ["agent_id", "path", "schema_version", "last_seen_at", "size_bytes"].every((column) =>
    tableHasColumn(db, "agent_databases", column),
  );
}
function repairAgentDatabasesCompositePrimaryKey(db) {
  if (hasCanonicalAgentDatabasesPrimaryKey(db) || !canRepairAgentDatabasesPrimaryKey(db))
    return false;
  db.exec(`
    DROP TABLE IF EXISTS agent_databases_migration_new;
    CREATE TABLE agent_databases_migration_new (
      agent_id TEXT NOT NULL,
      path TEXT NOT NULL,
      schema_version INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL,
      size_bytes INTEGER,
      PRIMARY KEY (agent_id, path)
    );
    INSERT OR REPLACE INTO agent_databases_migration_new (
      agent_id,
      path,
      schema_version,
      last_seen_at,
      size_bytes
    )
    SELECT
      agent_id,
      path,
      schema_version,
      last_seen_at,
      size_bytes
    FROM agent_databases
    WHERE agent_id IS NOT NULL AND path IS NOT NULL;
    DROP TABLE agent_databases;
    ALTER TABLE agent_databases_migration_new RENAME TO agent_databases;
  `);
  return true;
}
const AUDIT_EVENT_STATE_SCHEMA_VERSION = 2;
const AUDIT_EVENT_LEGACY_COLUMNS = [
  "sequence",
  "event_id",
  "source_id",
  "source_sequence",
  "occurred_at",
  "kind",
  "action",
  "status",
  "error_code",
  "actor_type",
  "actor_id",
  "agent_id",
  "session_key",
  "session_id",
  "run_id",
  "tool_call_id",
  "tool_name",
];
const AUDIT_EVENT_V2_COLUMNS = [
  "sequence",
  "event_id",
  "source_id",
  "schema_version",
  "source_sequence",
  "occurred_at",
  "kind",
  "action",
  "status",
  "error_code",
  "actor_type",
  "actor_id",
  "agent_id",
  "session_key",
  "session_id",
  "run_id",
  "tool_call_id",
  "tool_name",
  "direction",
  "channel",
  "conversation_kind",
  "message_outcome",
  "reason_code",
  "delivery_kind",
  "failure_stage",
  "duration_ms",
  "result_count",
  "account_ref",
  "conversation_ref",
  "message_ref",
  "target_ref",
];
function tableColumnInfo(db, tableName) {
  return db.prepare(`PRAGMA table_info(${tableName})`).all();
}
function tableHasExactColumns(db, tableName, expected) {
  const names = tableColumnInfo(db, tableName).map((column) => column.name);
  return names.length === expected.length && names.every((name, index) => name === expected[index]);
}
function tableHasRequiredColumns(db, tableName, required) {
  const columns = new Map(tableColumnInfo(db, tableName).map((column) => [column.name, column]));
  return required.every((name) => Number(columns.get(name)?.notnull ?? 0) === 1);
}
function tableSql(db, tableName) {
  const row = db
    .prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(tableName);
  return typeof row?.sql === "string" ? row.sql : void 0;
}
function tableHasUniqueColumn(db, tableName, columnName) {
  return db
    .prepare(`PRAGMA index_list(${tableName})`)
    .all()
    .some((index) => {
      if (Number(index.unique ?? 0) !== 1 || typeof index.name !== "string") return false;
      const escaped = index.name.replaceAll("'", "''");
      const columns = db.prepare(`PRAGMA index_info('${escaped}')`).all();
      return columns.length === 1 && columns[0]?.name === columnName;
    });
}
function hasCanonicalAuditEventTable(db, expectedColumns, requiredColumns) {
  const sql = tableSql(db, "audit_events")?.toLowerCase();
  return (
    tableHasExactColumns(db, "audit_events", expectedColumns) &&
    tablePrimaryKeyColumns(db, "audit_events").join(",") === "sequence" &&
    tableHasRequiredColumns(db, "audit_events", requiredColumns) &&
    typeof sql === "string" &&
    /\bsequence\s+integer\s+primary\s+key\s+autoincrement\b/.test(sql) &&
    tableHasUniqueColumn(db, "audit_events", "event_id") &&
    tableHasUniqueColumn(db, "audit_events", "source_id")
  );
}
function hasCanonicalAuditIdentityKeyTable(db) {
  if (!tableExists(db, "audit_identity_keys")) return false;
  const sql = tableSql(db, "audit_identity_keys")?.toLowerCase();
  return (
    tableHasExactColumns(db, "audit_identity_keys", ["id", "key_id", "key", "created_at"]) &&
    tablePrimaryKeyColumns(db, "audit_identity_keys").join(",") === "id" &&
    tableHasRequiredColumns(db, "audit_identity_keys", ["id", "key_id", "key", "created_at"]) &&
    typeof sql === "string" &&
    /\bcheck\s*\(\s*id\s*=\s*1\s*\)/.test(sql)
  );
}
function hasCanonicalAuditEventsSchema(db) {
  if (!tableExists(db, "audit_events"))
    return (
      readSqliteUserVersion(db) < AUDIT_EVENT_STATE_SCHEMA_VERSION &&
      !tableExists(db, "audit_identity_keys")
    );
  return (
    hasCanonicalAuditEventTable(db, AUDIT_EVENT_V2_COLUMNS, [
      "event_id",
      "source_id",
      "schema_version",
      "source_sequence",
      "occurred_at",
      "kind",
      "action",
      "status",
      "actor_type",
      "actor_id",
    ]) && hasCanonicalAuditIdentityKeyTable(db)
  );
}
function canRepairLegacyAuditEventsSchema(db) {
  if (
    !tableExists(db, "audit_events") ||
    tableExists(db, "audit_events_migration_new") ||
    tableHasColumn(db, "audit_events", "schema_version")
  )
    return false;
  return (
    (!tableExists(db, "audit_identity_keys") || hasCanonicalAuditIdentityKeyTable(db)) &&
    hasCanonicalAuditEventTable(db, AUDIT_EVENT_LEGACY_COLUMNS, [
      "event_id",
      "source_id",
      "source_sequence",
      "occurred_at",
      "kind",
      "action",
      "status",
      "actor_type",
      "actor_id",
      "agent_id",
      "run_id",
    ])
  );
}
function readAuditEventSequenceHighWater(db) {
  if (!tableExists(db, "sqlite_sequence")) return;
  const row = db
    .prepare("SELECT CAST(seq AS TEXT) AS seq FROM sqlite_sequence WHERE name = 'audit_events'")
    .get();
  if (row === void 0) return;
  if (typeof row.seq !== "string" || !/^\d+$/.test(row.seq))
    throw new Error("audit event sequence high-water mark is invalid");
  const sequence = BigInt(row.seq);
  if (sequence > BigInt(Number.MAX_SAFE_INTEGER))
    throw new Error("audit event sequence high-water mark exceeds the supported integer range");
  return Number(sequence);
}
function restoreAuditEventSequenceHighWater(db, sequence) {
  if (sequence === void 0) return;
  db.prepare("DELETE FROM sqlite_sequence WHERE name = 'audit_events'").run();
  db.prepare("INSERT INTO sqlite_sequence (name, seq) VALUES ('audit_events', ?)").run(sequence);
}
function repairAuditEventsSchema(db) {
  if (hasCanonicalAuditEventsSchema(db) || !canRepairLegacyAuditEventsSchema(db)) return false;
  const sequenceHighWater = readAuditEventSequenceHighWater(db);
  db.exec(`
    CREATE TABLE audit_events_migration_new (
      sequence INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL UNIQUE,
      source_id TEXT NOT NULL UNIQUE,
      schema_version INTEGER NOT NULL DEFAULT 1,
      source_sequence INTEGER NOT NULL,
      occurred_at INTEGER NOT NULL,
      kind TEXT NOT NULL,
      action TEXT NOT NULL,
      status TEXT NOT NULL,
      error_code TEXT,
      actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      agent_id TEXT,
      session_key TEXT,
      session_id TEXT,
      run_id TEXT,
      tool_call_id TEXT,
      tool_name TEXT,
      direction TEXT,
      channel TEXT,
      conversation_kind TEXT,
      message_outcome TEXT,
      reason_code TEXT,
      delivery_kind TEXT,
      failure_stage TEXT,
      duration_ms INTEGER,
      result_count INTEGER,
      account_ref TEXT,
      conversation_ref TEXT,
      message_ref TEXT,
      target_ref TEXT
    );
    INSERT INTO audit_events_migration_new (
      sequence,
      event_id,
      source_id,
      schema_version,
      source_sequence,
      occurred_at,
      kind,
      action,
      status,
      error_code,
      actor_type,
      actor_id,
      agent_id,
      session_key,
      session_id,
      run_id,
      tool_call_id,
      tool_name
    )
    SELECT
      sequence,
      event_id,
      source_id,
      1,
      source_sequence,
      occurred_at,
      kind,
      action,
      status,
      error_code,
      actor_type,
      actor_id,
      agent_id,
      session_key,
      session_id,
      run_id,
      tool_call_id,
      tool_name
    FROM audit_events;
    DROP TABLE audit_events;
    ALTER TABLE audit_events_migration_new RENAME TO audit_events;
    CREATE INDEX idx_audit_events_time
      ON audit_events(occurred_at DESC, sequence DESC);
    CREATE INDEX idx_audit_events_agent_sequence
      ON audit_events(agent_id, sequence DESC);
    CREATE INDEX idx_audit_events_session_sequence
      ON audit_events(session_key, sequence DESC);
    CREATE INDEX idx_audit_events_run_sequence
      ON audit_events(run_id, sequence DESC);
    CREATE INDEX idx_audit_events_kind_sequence
      ON audit_events(kind, sequence DESC);
    CREATE INDEX idx_audit_events_status_sequence
      ON audit_events(status, sequence DESC);
    CREATE INDEX idx_audit_events_channel_sequence
      ON audit_events(channel, sequence DESC);
    CREATE INDEX idx_audit_events_direction_sequence
      ON audit_events(direction, sequence DESC);
    CREATE TABLE IF NOT EXISTS audit_identity_keys (
      id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
      key_id TEXT NOT NULL,
      key BLOB NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
  restoreAuditEventSequenceHighWater(db, sequenceHighWater);
  return true;
}
function markCurrentStateSchemaVersion(db) {
  if (!tableExists(db, "audit_events")) return;
  db.exec(`PRAGMA user_version = 2;`);
  if (
    tableExists(db, "schema_meta") &&
    ["meta_key", "schema_version", "updated_at"].every((column) =>
      tableHasColumn(db, "schema_meta", column),
    )
  )
    db.prepare(
      "UPDATE schema_meta SET schema_version = ?, updated_at = ? WHERE meta_key = 'primary'",
    ).run(2, Date.now());
}
function assertCanonicalStateSchemaShape(db, pathname) {
  if (!hasCanonicalAgentDatabasesPrimaryKey(db))
    throw new Error(
      `OpenClaw state database ${pathname} has a legacy agent database registry schema; run openclaw doctor --fix to migrate it.`,
    );
  if (!hasCanonicalAuditEventsSchema(db)) {
    if (canRepairLegacyAuditEventsSchema(db))
      throw new Error(
        `OpenClaw state database ${pathname} has a legacy audit event schema; run openclaw doctor --fix to migrate it.`,
      );
    throw new Error(
      `OpenClaw state database ${pathname} has a noncanonical audit event schema that cannot be repaired automatically; restore the canonical audit_events shape before retrying.`,
    );
  }
}
function detectOpenClawStateDatabaseSchemaMigrations(options = {}) {
  const pathname = resolveDatabasePath(options);
  if (!existsSync(pathname)) return [];
  const db = new (requireNodeSqlite().DatabaseSync)(pathname, { readOnly: true });
  try {
    const migrations = [];
    if (!hasCanonicalAgentDatabasesPrimaryKey(db))
      migrations.push({
        kind: "agent-databases-composite-primary-key",
        path: pathname,
      });
    if (!hasCanonicalAuditEventsSchema(db))
      migrations.push({
        kind: "audit-events-v2",
        path: pathname,
      });
    return migrations;
  } finally {
    db.close();
  }
}
function repairOpenClawStateDatabaseSchema(options = {}) {
  const env = options.env ?? process.env;
  const pathname = resolveDatabasePath(options);
  if (!existsSync(pathname))
    return {
      changes: [],
      warnings: [],
    };
  ensureOpenClawStatePermissions(pathname, env);
  const db = new (requireNodeSqlite().DatabaseSync)(pathname);
  try {
    assertStateDatabaseIntegrityBeforeMutation(db, pathname);
    assertSupportedSchemaVersion(db, pathname);
    return {
      changes: runSqliteImmediateTransactionSync(
        db,
        () => {
          const applied = [];
          if (repairAgentDatabasesCompositePrimaryKey(db))
            applied.push(
              `Migrated shared state agent database registry primary key → agent_id,path`,
            );
          if (repairAuditEventsSchema(db))
            applied.push(
              `Migrated shared state audit event ledger → versioned message lifecycle schema`,
            );
          assertCanonicalStateSchemaShape(db, pathname);
          markCurrentStateSchemaVersion(db);
          return applied;
        },
        {
          busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
          databaseLabel: pathname,
          operationLabel: "state.schema.repair",
        },
      ),
      warnings: [],
    };
  } catch (err) {
    return {
      changes: [],
      warnings: [`Failed migrating shared state database schema at ${pathname}: ${String(err)}`],
    };
  } finally {
    db.close();
    ensureOpenClawStatePermissions(pathname, env);
  }
}
function ensureStartupMigrationCheckpointSchema(db, pathname) {
  runSqliteImmediateTransactionSync(
    db,
    () => {
      assertSupportedSchemaVersion(db, pathname);
      db.exec(`
        CREATE TABLE IF NOT EXISTS schema_meta (
          meta_key TEXT NOT NULL PRIMARY KEY,
          role TEXT NOT NULL,
          schema_version INTEGER NOT NULL,
          agent_id TEXT,
          app_version TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS state_leases (
          scope TEXT NOT NULL,
          lease_key TEXT NOT NULL,
          owner TEXT NOT NULL,
          expires_at INTEGER,
          heartbeat_at INTEGER,
          payload_json TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          PRIMARY KEY (scope, lease_key)
        );
        CREATE INDEX IF NOT EXISTS idx_state_leases_expiry
          ON state_leases(expires_at, scope, lease_key)
          WHERE expires_at IS NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_state_leases_owner
          ON state_leases(owner, updated_at DESC);
      `);
      ensureColumn(db, "schema_meta", "app_version TEXT");
    },
    {
      busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
      databaseLabel: pathname,
      operationLabel: "state.schema.ensure-startup-checkpoint",
    },
  );
}
function withOpenClawStateStartupMigrationCheckpointDatabase(callback, options = {}) {
  const env = options.env ?? process.env;
  const pathname = resolveDatabasePath(options);
  ensureOpenClawStatePermissions(pathname, env);
  const db = new (requireNodeSqlite().DatabaseSync)(pathname);
  try {
    assertStateDatabaseIntegrityBeforeMutation(db, pathname);
    ensureStartupMigrationCheckpointSchema(db, pathname);
    return callback(db);
  } finally {
    db.close();
    ensureOpenClawStatePermissions(pathname, env);
  }
}
function backfillAcpReplayEstimatedBytes(db) {
  if (
    !tableExists(db, "acp_replay_events") ||
    !tableHasColumn(db, "acp_replay_events", "estimated_bytes")
  )
    return;
  const pendingEvent = db
    .prepare("SELECT 1 FROM acp_replay_events WHERE estimated_bytes = 0 LIMIT 1")
    .get();
  const pendingSession = db
    .prepare("SELECT 1 FROM acp_replay_sessions WHERE estimated_bytes = 0 LIMIT 1")
    .get();
  if (!pendingEvent && !pendingSession) return;
  db.exec(`
    UPDATE acp_replay_events
       SET estimated_bytes = length(session_id) + length(session_key) + length(update_json)
             + COALESCE(length(run_id), 0) + 32
     WHERE estimated_bytes = 0;
    UPDATE acp_replay_sessions
       SET estimated_bytes = length(session_id) + length(session_key) + length(cwd) + 32
             + COALESCE((SELECT SUM(e.estimated_bytes) FROM acp_replay_events e
                          WHERE e.session_id = acp_replay_sessions.session_id), 0)
     WHERE estimated_bytes = 0;
  `);
}
function backfillCronRunLogEntryJson(db) {
  if (!tableExists(db, "cron_run_logs") || !tableHasColumn(db, "cron_run_logs", "entry_json"))
    return;
  const rows = db
    .prepare(`SELECT store_key, job_id, seq, ts
         FROM cron_run_logs
        WHERE entry_json = '{}'`)
    .all();
  if (rows.length === 0) return;
  const update = db.prepare(`UPDATE cron_run_logs
        SET entry_json = ?
      WHERE store_key = ? AND job_id = ? AND seq = ?`);
  for (const row of rows)
    update.run(
      JSON.stringify({
        ts: Number(row.ts),
        jobId: row.job_id,
        action: "finished",
      }),
      row.store_key,
      row.job_id,
      row.seq,
    );
}
function parseJsonRecord(value) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function textField(record, key) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : null;
}
function numberField(record, key) {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function recordField(record, key) {
  const value = record[key];
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function jsonField(value) {
  return value === void 0 ? null : JSON.stringify(value);
}
function cronSessionTargetField(record) {
  const value = textField(record, "sessionTarget");
  if (!value) return null;
  return value === "main" ||
    value === "isolated" ||
    value === "current" ||
    value.startsWith("session:")
    ? value
    : null;
}
function cronWakeModeField(record) {
  const value = textField(record, "wakeMode");
  return value === "now" || value === "next-heartbeat" ? value : null;
}
function booleanField(record, key) {
  const value = record[key];
  return typeof value === "boolean" ? (value ? 1 : 0) : null;
}
function failureDestinationField(record, key) {
  if (!record || !Object.hasOwn(record, key)) return null;
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : "";
}
function migrateLegacyCronDeliveryThreadIds(db) {
  const rows = db
    .prepare(`SELECT store_key, job_id, job_json, delivery_thread_id
         FROM cron_jobs
        WHERE delivery_thread_id_type IS NULL`)
    .all();
  const update = db.prepare(`UPDATE cron_jobs
        SET delivery_thread_id = ?, delivery_thread_id_type = ?
      WHERE store_key = ? AND job_id = ? AND delivery_thread_id_type IS NULL`);
  for (const row of rows) {
    const job = parseJsonRecord(row.job_json);
    const typed = (job ? recordField(job, "delivery") : null)?.threadId;
    if (row.delivery_thread_id === null) {
      if (typeof typed === "number" && Number.isFinite(typed))
        update.run(String(typed), "number", row.store_key, row.job_id);
      continue;
    }
    const type =
      typeof typed === "number" &&
      Number.isFinite(typed) &&
      String(typed) === row.delivery_thread_id
        ? "number"
        : "string";
    update.run(row.delivery_thread_id, type, row.store_key, row.job_id);
  }
}
function backfillCronJobsFromJobJson(db) {
  if (
    !tableExists(db, "cron_jobs") ||
    !tableHasColumn(db, "cron_jobs", "job_json") ||
    !tableHasColumn(db, "cron_jobs", "schedule_kind") ||
    !tableHasColumn(db, "cron_jobs", "payload_kind")
  )
    return;
  const rows = db
    .prepare(`SELECT store_key, job_id, job_json, updated_at
         FROM cron_jobs
        WHERE schedule_kind = 'manual'
           OR payload_kind = 'message'
           OR name = ''`)
    .all();
  if (rows.length === 0) return;
  const update = db.prepare(`UPDATE cron_jobs
        SET name = ?,
            enabled = ?,
            delete_after_run = ?,
            created_at_ms = ?,
            agent_id = ?,
            session_key = ?,
            schedule_kind = ?,
            schedule_expr = ?,
            schedule_tz = ?,
            every_ms = ?,
            anchor_ms = ?,
            at = ?,
            stagger_ms = ?,
            session_target = ?,
            wake_mode = ?,
            payload_kind = ?,
            payload_message = ?,
            payload_model = ?,
            payload_fallbacks_json = ?,
            payload_thinking = ?,
            payload_timeout_seconds = ?,
            payload_allow_unsafe_external_content = ?,
            payload_external_content_source_json = ?,
            payload_light_context = ?,
            payload_tools_allow_json = ?,
            delivery_mode = ?,
            delivery_channel = ?,
            delivery_to = ?,
            delivery_thread_id = ?,
            delivery_account_id = ?,
            delivery_best_effort = ?,
            delivery_completion_mode = ?,
            delivery_completion_to = ?,
            failure_delivery_mode = ?,
            failure_delivery_channel = ?,
            failure_delivery_to = ?,
            failure_delivery_account_id = ?,
            failure_alert_disabled = ?,
            failure_alert_after = ?,
            failure_alert_channel = ?,
            failure_alert_to = ?,
            failure_alert_cooldown_ms = ?,
            failure_alert_include_skipped = ?,
            failure_alert_mode = ?,
            failure_alert_account_id = ?,
            runtime_updated_at_ms = ?
      WHERE store_key = ?
        AND job_id = ?`);
  for (const row of rows) {
    const job = parseJsonRecord(row.job_json);
    if (!job) continue;
    const schedule = recordField(job, "schedule");
    const payload = recordField(job, "payload");
    const scheduleKind = textField(schedule ?? {}, "kind");
    const payloadKind = textField(payload ?? {}, "kind");
    const isAt = scheduleKind === "at" && textField(schedule ?? {}, "at");
    const isEvery = scheduleKind === "every" && numberField(schedule ?? {}, "everyMs") != null;
    const isCron = scheduleKind === "cron" && textField(schedule ?? {}, "expr");
    const isSystemEvent = payloadKind === "systemEvent" && textField(payload ?? {}, "text");
    const isAgentTurn = payloadKind === "agentTurn" && textField(payload ?? {}, "message");
    if (!schedule || !payload || (!isAt && !isEvery && !isCron) || (!isSystemEvent && !isAgentTurn))
      continue;
    const fallbackTime = Number(row.updated_at) || 0;
    const delivery = recordField(job, "delivery");
    const completionDestination = delivery ? recordField(delivery, "completionDestination") : null;
    const failureDestination = delivery ? recordField(delivery, "failureDestination") : null;
    const failureAlertValue = job.failureAlert;
    const failureAlert =
      failureAlertValue &&
      typeof failureAlertValue === "object" &&
      !Array.isArray(failureAlertValue)
        ? failureAlertValue
        : null;
    update.run(
      textField(job, "name") ?? row.job_id,
      job.enabled === false ? 0 : 1,
      booleanField(job, "deleteAfterRun"),
      numberField(job, "createdAtMs") ?? fallbackTime,
      textField(job, "agentId"),
      textField(job, "sessionKey"),
      scheduleKind,
      isCron ? textField(schedule, "expr") : null,
      isCron ? textField(schedule, "tz") : null,
      isEvery ? numberField(schedule, "everyMs") : null,
      isEvery ? numberField(schedule, "anchorMs") : null,
      isAt ? textField(schedule, "at") : null,
      isCron ? numberField(schedule, "staggerMs") : null,
      cronSessionTargetField(job) ?? (payloadKind === "agentTurn" ? "isolated" : "main"),
      cronWakeModeField(job) ?? "now",
      payloadKind,
      isSystemEvent ? textField(payload, "text") : textField(payload, "message"),
      isAgentTurn ? textField(payload, "model") : null,
      isAgentTurn ? jsonField(payload.fallbacks) : null,
      isAgentTurn ? textField(payload, "thinking") : null,
      isAgentTurn ? numberField(payload, "timeoutSeconds") : null,
      isAgentTurn && typeof payload.allowUnsafeExternalContent === "boolean"
        ? payload.allowUnsafeExternalContent
          ? 1
          : 0
        : null,
      isAgentTurn ? jsonField(payload.externalContentSource) : null,
      isAgentTurn && typeof payload.lightContext === "boolean"
        ? payload.lightContext
          ? 1
          : 0
        : null,
      isAgentTurn ? jsonField(payload.toolsAllow) : null,
      delivery ? textField(delivery, "mode") : null,
      delivery ? textField(delivery, "channel") : null,
      delivery ? textField(delivery, "to") : null,
      delivery ? textField(delivery, "threadId") : null,
      delivery ? textField(delivery, "accountId") : null,
      delivery && typeof delivery.bestEffort === "boolean" ? (delivery.bestEffort ? 1 : 0) : null,
      completionDestination ? textField(completionDestination, "mode") : null,
      completionDestination ? textField(completionDestination, "to") : null,
      failureDestinationField(failureDestination, "mode"),
      failureDestinationField(failureDestination, "channel"),
      failureDestinationField(failureDestination, "to"),
      failureDestinationField(failureDestination, "accountId"),
      failureAlertValue === false ? 1 : failureAlert ? 0 : null,
      failureAlert ? numberField(failureAlert, "after") : null,
      failureAlert ? textField(failureAlert, "channel") : null,
      failureAlert ? textField(failureAlert, "to") : null,
      failureAlert ? numberField(failureAlert, "cooldownMs") : null,
      failureAlert && typeof failureAlert.includeSkipped === "boolean"
        ? failureAlert.includeSkipped
          ? 1
          : 0
        : null,
      failureAlert ? textField(failureAlert, "mode") : null,
      failureAlert ? textField(failureAlert, "accountId") : null,
      numberField(job, "updatedAtMs") ?? fallbackTime,
      row.store_key,
      row.job_id,
    );
  }
}
function metadataStringField(record, key) {
  return textField(record, key);
}
function backfillDeliveryQueueEntriesFromEntryJson(db) {
  if (
    !tableExists(db, "delivery_queue_entries") ||
    !tableHasColumn(db, "delivery_queue_entries", "entry_json") ||
    !tableHasColumn(db, "delivery_queue_entries", "retry_count")
  )
    return;
  const rows = db
    .prepare(`SELECT queue_name, id, entry_json
         FROM delivery_queue_entries
        WHERE retry_count = 0
           OR last_attempt_at IS NULL
           OR last_error IS NULL
           OR recovery_state IS NULL
           OR platform_send_started_at IS NULL
           OR entry_kind IS NULL
           OR session_key IS NULL
           OR channel IS NULL
           OR target IS NULL
           OR account_id IS NULL`)
    .all();
  if (rows.length === 0) return;
  const update = db.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = COALESCE(?, entry_kind),
            session_key = COALESCE(?, session_key),
            channel = COALESCE(?, channel),
            target = COALESCE(?, target),
            account_id = COALESCE(?, account_id),
            retry_count = ?,
            last_attempt_at = COALESCE(?, last_attempt_at),
            last_error = COALESCE(?, last_error),
            recovery_state = COALESCE(?, recovery_state),
            platform_send_started_at = COALESCE(?, platform_send_started_at)
      WHERE queue_name = ?
        AND id = ?`);
  for (const row of rows) {
    const entry = parseJsonRecord(row.entry_json);
    if (!entry) continue;
    const session = recordField(entry, "session");
    const route = recordField(entry, "route");
    const deliveryContext = recordField(entry, "deliveryContext");
    update.run(
      metadataStringField(entry, "kind"),
      metadataStringField(entry, "sessionKey") ??
        (session ? metadataStringField(session, "key") : null),
      metadataStringField(entry, "channel") ??
        (route ? metadataStringField(route, "channel") : null) ??
        (deliveryContext ? metadataStringField(deliveryContext, "channel") : null),
      metadataStringField(entry, "to") ??
        (route ? metadataStringField(route, "to") : null) ??
        (deliveryContext ? metadataStringField(deliveryContext, "to") : null),
      metadataStringField(entry, "accountId") ??
        (route ? metadataStringField(route, "accountId") : null) ??
        (deliveryContext ? metadataStringField(deliveryContext, "accountId") : null),
      numberField(entry, "retryCount") ?? 0,
      numberField(entry, "lastAttemptAt"),
      metadataStringField(entry, "lastError"),
      metadataStringField(entry, "recoveryState"),
      numberField(entry, "platformSendStartedAt"),
      row.queue_name,
      row.id,
    );
  }
}
function ensureAdditiveStateColumns(db) {
  ensureColumn(db, "device_pairing_pending", "refreshed_at_ms INTEGER");
  ensureColumn(db, "device_pairing_paired", "approved_via TEXT");
  ensureColumn(db, "device_pairing_paired", "operator_label TEXT");
  ensureColumn(db, "device_pairing_paired", "node_surface_json TEXT");
  ensureColumn(db, "device_pairing_paired", "pending_node_surface_json TEXT");
  ensureColumn(db, "cron_run_logs", "status TEXT");
  ensureColumn(db, "cron_run_logs", "error TEXT");
  ensureColumn(db, "cron_run_logs", "summary TEXT");
  ensureColumn(db, "cron_run_logs", "diagnostics_summary TEXT");
  ensureColumn(db, "cron_run_logs", "delivery_status TEXT");
  ensureColumn(db, "cron_run_logs", "delivery_error TEXT");
  ensureColumn(db, "cron_run_logs", "delivered INTEGER");
  ensureColumn(db, "cron_run_logs", "session_id TEXT");
  ensureColumn(db, "cron_run_logs", "session_key TEXT");
  ensureColumn(db, "cron_run_logs", "run_id TEXT");
  ensureColumn(db, "cron_run_logs", "run_at_ms INTEGER");
  ensureColumn(db, "cron_run_logs", "duration_ms INTEGER");
  ensureColumn(db, "cron_run_logs", "next_run_at_ms INTEGER");
  ensureColumn(db, "cron_run_logs", "model TEXT");
  ensureColumn(db, "cron_run_logs", "provider TEXT");
  ensureColumn(db, "cron_run_logs", "total_tokens INTEGER");
  ensureColumn(db, "cron_run_logs", "entry_json TEXT NOT NULL DEFAULT '{}'");
  ensureColumn(db, "cron_run_logs", "created_at INTEGER NOT NULL DEFAULT 0");
  backfillCronRunLogEntryJson(db);
  ensureColumn(db, "acp_replay_events", "estimated_bytes INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "acp_replay_sessions", "estimated_bytes INTEGER NOT NULL DEFAULT 0");
  backfillAcpReplayEstimatedBytes(db);
  ensureColumn(db, "cron_jobs", "description TEXT");
  ensureColumn(db, "cron_jobs", "declaration_key TEXT");
  ensureColumn(db, "cron_jobs", "display_name TEXT");
  ensureColumn(db, "cron_jobs", "owner_agent_id TEXT");
  ensureColumn(db, "cron_jobs", "owner_session_key TEXT");
  ensureColumn(db, "cron_jobs", "name TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "cron_jobs", "enabled INTEGER NOT NULL DEFAULT 1");
  ensureColumn(db, "cron_jobs", "delete_after_run INTEGER");
  ensureColumn(db, "cron_jobs", "created_at_ms INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "cron_jobs", "agent_id TEXT");
  ensureColumn(db, "cron_jobs", "session_key TEXT");
  ensureColumn(db, "cron_jobs", "schedule_kind TEXT NOT NULL DEFAULT 'manual'");
  ensureColumn(db, "cron_jobs", "schedule_expr TEXT");
  ensureColumn(db, "cron_jobs", "schedule_tz TEXT");
  ensureColumn(db, "cron_jobs", "every_ms INTEGER");
  ensureColumn(db, "cron_jobs", "anchor_ms INTEGER");
  ensureColumn(db, "cron_jobs", "at TEXT");
  ensureColumn(db, "cron_jobs", "stagger_ms INTEGER");
  ensureColumn(db, "cron_jobs", "session_target TEXT NOT NULL DEFAULT 'main'");
  ensureColumn(db, "cron_jobs", "wake_mode TEXT NOT NULL DEFAULT 'auto'");
  ensureColumn(db, "cron_jobs", "trigger_script TEXT");
  ensureColumn(db, "cron_jobs", "trigger_once INTEGER");
  ensureColumn(db, "cron_jobs", "payload_kind TEXT NOT NULL DEFAULT 'message'");
  ensureColumn(db, "cron_jobs", "payload_message TEXT");
  ensureColumn(db, "cron_jobs", "payload_model TEXT");
  ensureColumn(db, "cron_jobs", "payload_fallbacks_json TEXT");
  ensureColumn(db, "cron_jobs", "payload_thinking TEXT");
  ensureColumn(db, "cron_jobs", "payload_timeout_seconds INTEGER");
  ensureColumn(db, "cron_jobs", "payload_allow_unsafe_external_content INTEGER");
  ensureColumn(db, "cron_jobs", "payload_external_content_source_json TEXT");
  ensureColumn(db, "cron_jobs", "payload_light_context INTEGER");
  ensureColumn(db, "cron_jobs", "payload_tools_allow_json TEXT");
  ensureColumn(db, "cron_jobs", "payload_tools_allow_is_default INTEGER");
  ensureColumn(db, "cron_jobs", "delivery_mode TEXT");
  ensureColumn(db, "cron_jobs", "delivery_channel TEXT");
  ensureColumn(db, "cron_jobs", "delivery_to TEXT");
  ensureColumn(db, "cron_jobs", "delivery_thread_id TEXT");
  ensureColumn(db, "cron_jobs", "delivery_account_id TEXT");
  ensureColumn(db, "cron_jobs", "delivery_best_effort INTEGER");
  ensureColumn(db, "cron_jobs", "delivery_completion_mode TEXT");
  ensureColumn(db, "cron_jobs", "delivery_completion_to TEXT");
  ensureColumn(db, "cron_jobs", "failure_delivery_mode TEXT");
  ensureColumn(db, "cron_jobs", "failure_delivery_channel TEXT");
  ensureColumn(db, "cron_jobs", "failure_delivery_to TEXT");
  ensureColumn(db, "cron_jobs", "failure_delivery_account_id TEXT");
  ensureColumn(db, "cron_jobs", "failure_alert_disabled INTEGER");
  ensureColumn(db, "cron_jobs", "failure_alert_after INTEGER");
  ensureColumn(db, "cron_jobs", "failure_alert_channel TEXT");
  ensureColumn(db, "cron_jobs", "failure_alert_to TEXT");
  ensureColumn(db, "cron_jobs", "failure_alert_cooldown_ms INTEGER");
  ensureColumn(db, "cron_jobs", "failure_alert_include_skipped INTEGER");
  ensureColumn(db, "cron_jobs", "failure_alert_mode TEXT");
  ensureColumn(db, "cron_jobs", "failure_alert_account_id TEXT");
  ensureColumn(db, "cron_jobs", "next_run_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "running_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "last_run_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "last_run_status TEXT");
  ensureColumn(db, "cron_jobs", "last_error TEXT");
  ensureColumn(db, "cron_jobs", "last_duration_ms INTEGER");
  ensureColumn(db, "cron_jobs", "consecutive_errors INTEGER");
  ensureColumn(db, "cron_jobs", "consecutive_skipped INTEGER");
  ensureColumn(db, "cron_jobs", "schedule_error_count INTEGER");
  ensureColumn(db, "cron_jobs", "last_delivery_status TEXT");
  ensureColumn(db, "cron_jobs", "last_delivery_error TEXT");
  ensureColumn(db, "cron_jobs", "last_delivered INTEGER");
  ensureColumn(db, "cron_jobs", "last_failure_alert_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "state_json TEXT NOT NULL DEFAULT '{}'");
  ensureColumn(db, "cron_jobs", "runtime_updated_at_ms INTEGER");
  ensureColumn(db, "cron_jobs", "schedule_identity TEXT");
  ensureColumn(db, "cron_jobs", "sort_order INTEGER NOT NULL DEFAULT 0");
  backfillCronJobsFromJobJson(db);
  if (ensureColumn(db, "cron_jobs", "delivery_thread_id_type TEXT"))
    migrateLegacyCronDeliveryThreadIds(db);
  ensureColumn(db, "sandbox_registry_entries", "session_key TEXT");
  ensureColumn(db, "sandbox_registry_entries", "backend_id TEXT");
  ensureColumn(db, "sandbox_registry_entries", "runtime_label TEXT");
  ensureColumn(db, "sandbox_registry_entries", "image TEXT");
  ensureColumn(db, "sandbox_registry_entries", "created_at_ms INTEGER");
  ensureColumn(db, "sandbox_registry_entries", "last_used_at_ms INTEGER");
  ensureColumn(db, "sandbox_registry_entries", "config_label_kind TEXT");
  ensureColumn(db, "sandbox_registry_entries", "config_hash TEXT");
  ensureColumn(db, "sandbox_registry_entries", "cdp_port INTEGER");
  ensureColumn(db, "sandbox_registry_entries", "no_vnc_port INTEGER");
  ensureColumn(db, "delivery_queue_entries", "entry_kind TEXT");
  ensureColumn(db, "delivery_queue_entries", "session_key TEXT");
  ensureColumn(db, "delivery_queue_entries", "channel TEXT");
  ensureColumn(db, "delivery_queue_entries", "target TEXT");
  ensureColumn(db, "delivery_queue_entries", "account_id TEXT");
  ensureColumn(db, "delivery_queue_entries", "retry_count INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "delivery_queue_entries", "last_attempt_at INTEGER");
  ensureColumn(db, "delivery_queue_entries", "last_error TEXT");
  ensureColumn(db, "delivery_queue_entries", "recovery_state TEXT");
  ensureColumn(db, "delivery_queue_entries", "platform_send_started_at INTEGER");
  backfillDeliveryQueueEntriesFromEntryJson(db);
  ensureColumn(db, "commitments", "account_id TEXT");
  ensureColumn(db, "commitments", "recipient_id TEXT");
  ensureColumn(db, "commitments", "thread_id TEXT");
  ensureColumn(db, "commitments", "sender_id TEXT");
  ensureColumn(db, "commitments", "kind TEXT NOT NULL DEFAULT 'followup'");
  ensureColumn(db, "commitments", "sensitivity TEXT NOT NULL DEFAULT 'normal'");
  ensureColumn(db, "commitments", "source TEXT NOT NULL DEFAULT 'unknown'");
  ensureColumn(db, "commitments", "reason TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "commitments", "suggested_text TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "commitments", "dedupe_key TEXT NOT NULL DEFAULT ''");
  ensureColumn(db, "commitments", "confidence REAL NOT NULL DEFAULT 0");
  ensureColumn(db, "commitments", "due_timezone TEXT NOT NULL DEFAULT 'UTC'");
  ensureColumn(db, "commitments", "source_message_id TEXT");
  ensureColumn(db, "commitments", "source_run_id TEXT");
  ensureColumn(db, "commitments", "created_at_ms INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "commitments", "attempts INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "commitments", "last_attempt_at_ms INTEGER");
  ensureColumn(db, "commitments", "sent_at_ms INTEGER");
  ensureColumn(db, "commitments", "dismissed_at_ms INTEGER");
  ensureColumn(db, "commitments", "snoozed_until_ms INTEGER");
  ensureColumn(db, "commitments", "expired_at_ms INTEGER");
  ensureColumn(db, "current_conversation_bindings", "target_agent_id TEXT NOT NULL DEFAULT 'main'");
  ensureColumn(db, "current_conversation_bindings", "target_session_id TEXT");
  ensureColumn(
    db,
    "current_conversation_bindings",
    "conversation_kind TEXT NOT NULL DEFAULT 'channel'",
  );
  ensureColumn(db, "device_bootstrap_tokens", "pending_profile_json TEXT");
  ensureColumn(db, "gateway_restart_handoff", "restart_trace_started_at INTEGER");
  ensureColumn(db, "gateway_restart_handoff", "restart_trace_last_at INTEGER");
  ensureColumn(db, "gateway_restart_intent", "reason TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "delivery_channel TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "delivery_to TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "delivery_account_id TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "message TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "continuation_json TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "doctor_hint TEXT");
  ensureColumn(db, "gateway_restart_sentinel", "stats_json TEXT");
  ensureColumn(db, "gateway_boot_lifecycle", "startup_reason TEXT");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_mode TEXT");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_key_id TEXT");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_signature_count INTEGER");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_threshold INTEGER");
  ensureColumn(db, "official_external_plugin_catalog_snapshots", "trust_verified_at TEXT");
  if (ensureColumn(db, "task_runs", "requester_agent_id TEXT"))
    repairLegacyTaskAgentAttribution(db);
  repairLegacyTaskDeliveryStatuses(db);
  ensureColumn(db, "task_runs", "tool_use_count INTEGER");
  ensureColumn(db, "task_runs", "last_tool_name TEXT");
  ensureColumn(db, "task_runs", "detail_json TEXT");
  ensureColumn(db, "subagent_runs", "task_name TEXT");
  ensureColumn(db, "worker_environments", "bootstrap_bundle_hash TEXT");
  ensureColumn(db, "worker_environments", "bootstrap_openclaw_version TEXT");
  ensureColumn(db, "worker_environments", "bootstrap_protocol_features_json TEXT");
  ensureColumn(
    db,
    "worker_environments",
    "owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0)",
  );
  ensureColumn(db, "worker_environments", "ssh_host_key TEXT");
  ensureColumn(
    db,
    "worker_environments",
    "teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed'))",
  );
  ensureOperatorApprovalResolutionRefs(db);
}
function ensureSchema(db, pathname) {
  const now = Date.now();
  const kysely = getNodeSqliteKysely(db);
  runSqliteImmediateTransactionSync(
    db,
    () => {
      assertSupportedSchemaVersion(db, pathname);
      ensureAdditiveStateColumns(db);
      assertCanonicalStateSchemaShape(db, pathname);
      db.exec(OPENCLAW_STATE_SCHEMA_SQL);
      migrateLegacyCronRunLogsToTaskRuns(db);
      repairCanonicalSqliteUniqueIndexes(db, pathname, OPENCLAW_STATE_CANONICAL_UNIQUE_INDEXES);
      db.exec(
        "DROP TABLE IF EXISTS node_pairing_pending; DROP TABLE IF EXISTS node_pairing_paired;",
      );
      db.exec(`PRAGMA user_version = 2;`);
      executeSqliteQuerySync(
        db,
        kysely
          .insertInto("schema_meta")
          .values({
            meta_key: "primary",
            role: "global",
            schema_version: 2,
            agent_id: null,
            app_version: null,
            created_at: now,
            updated_at: now,
          })
          .onConflict((conflict) =>
            conflict.column("meta_key").doUpdateSet({
              role: "global",
              schema_version: 2,
              agent_id: null,
              app_version: null,
              updated_at: now,
            }),
          ),
      );
    },
    {
      busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
      databaseLabel: pathname,
      operationLabel: "state.schema.ensure",
    },
  );
}
function resolveDatabasePath(options = {}) {
  return path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
}
function assertStateDatabaseIntegrityBeforeMutation(database, pathname) {
  database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
  assertSqliteIntegrity(database, pathname);
}
/** Open or return a cached shared state database after schema and migration checks. */
function openOpenClawStateDatabase(options = {}) {
  const env = options.env ?? process.env;
  const pathname = resolveDatabasePath(options);
  const cached = cachedDatabases.get(pathname);
  if (cached?.db.isOpen) return cached;
  if (cached) {
    cached.walMaintenance.close();
    clearNodeSqliteKyselyCacheForDatabase(cached.db);
    cachedDatabases.delete(pathname);
  }
  ensureOpenClawStatePermissions(pathname, env);
  const db = new (requireNodeSqlite().DatabaseSync)(pathname);
  const walMaintenance = (() => {
    let maintenance;
    try {
      assertStateDatabaseIntegrityBeforeMutation(db, pathname);
      configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
      maintenance = configureSqliteConnectionPragmas(db, {
        busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
        databaseLabel: "openclaw-state",
        databasePath: pathname,
        foreignKeys: true,
        synchronous: "NORMAL",
      });
      ensureSchema(db, pathname);
      return maintenance;
    } catch (err) {
      maintenance?.close();
      db.close();
      throw err;
    }
  })();
  ensureOpenClawStatePermissions(pathname, env);
  const database = {
    db,
    path: pathname,
    walMaintenance,
  };
  cachedDatabases.set(pathname, database);
  return database;
}
/** Run a synchronous immediate transaction against the shared state database. */
function runOpenClawStateWriteTransaction(operation, options = {}) {
  const database = openOpenClawStateDatabase(options);
  const result = runSqliteImmediateTransactionSync(database.db, () => operation(database), {
    busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
    databaseLabel: database.path,
    operationLabel: "state.write",
  });
  try {
    ensureOpenClawStatePermissions(database.path, options.env ?? process.env);
  } catch {}
  return result;
}
/** Close all cached shared state database handles. */
function closeOpenClawStateDatabase() {
  for (const database of cachedDatabases.values()) {
    database.walMaintenance.close();
    clearNodeSqliteKyselyCacheForDatabase(database.db);
    if (database.db.isOpen) database.db.close();
  }
  cachedDatabases.clear();
}
/** Test whether any cached shared state database handle is still open. */
function isOpenClawStateDatabaseOpen() {
  return Array.from(cachedDatabases.values()).some((database) => database.db.isOpen);
}
//#endregion
export {
  assertSqliteTableIntegrity as A,
  iterateSqliteQuerySync as B,
  normalizeCronRunDiagnostics as C,
  CRON_JOB_EXECUTION_TIMEOUT_ERROR as D,
  tailText as E,
  readSqliteUserVersion as F,
  clearNodeSqliteKyselyCacheForDatabase as I,
  executeSqliteQuerySync as L,
  resolveSqliteDatabaseFilePaths as M,
  applyPrivateModeSync as N,
  assertSqliteSchemaContains as O,
  createNewerSqliteSchemaVersionError as P,
  executeSqliteQueryTakeFirstSync as R,
  isRecord as S,
  normalizeToolName as T,
  cronTaskRecordStoreKey as _,
  ensureOpenClawStatePermissions as a,
  parseCronRunLogEntryObject as b,
  repairOpenClawStateDatabaseSchema as c,
  resolveOpenClawStateSqliteDir as d,
  resolveOpenClawStateSqlitePath as f,
  cronRunStatusToTaskStatus as g,
  cronRunLogEntryToTaskDetail as h,
  detectOpenClawStateDatabaseSchemaMigrations as i,
  repairCanonicalSqliteUniqueIndexes as j,
  assertSqliteIntegrity as k,
  runOpenClawStateWriteTransaction as l,
  normalizeSqliteNumber as m,
  assertOpenClawStateDatabaseForMaintenance as n,
  isOpenClawStateDatabaseOpen as o,
  migrateLegacyCronRunLogsToTaskRuns as p,
  closeOpenClawStateDatabase as r,
  openOpenClawStateDatabase as s,
  OPENCLAW_SQLITE_BUSY_TIMEOUT_MS as t,
  withOpenClawStateStartupMigrationCheckpointDatabase as u,
  cronTaskRecordToRunLogEntry as v,
  normalizeExitCode as w,
  formatUnknownError as x,
  cronTaskRecordToTriggerEval as y,
  getNodeSqliteKysely as z,
};
