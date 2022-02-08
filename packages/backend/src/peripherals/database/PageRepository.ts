import { Knex } from 'knex'
import { PageRow } from 'knex/types/tables'
import { sortBy } from 'lodash'

import { Hash256 } from '../../model'
import { Logger } from '../../tools/Logger'
import { Repository } from './types'

export interface PageRecord {
  id?: number
  blockNumber: number
  pageHash: Hash256
  data: string
}

export class PageRepository implements Repository<PageRecord> {
  constructor(private knex: Knex, private logger: Logger) {
    this.logger = logger.for(this)
  }

  async add(records: PageRecord[]) {
    if (records.length === 0) {
      this.logger.debug({ method: 'add', rows: 0 })
      return
    }

    const rows: PageRow[] = records.map(toRow)
    await this.knex('pages').insert(rows)

    this.logger.debug({ method: 'add', rows: rows.length })
  }

  async getAll() {
    const rows = await this.knex('pages').select('*')
    this.logger.debug({ method: 'getAll', rows: rows.length })
    return rows.map(toRecord)
  }

  async getAllForFacts(factHashes: Hash256[]) {
    type Row = { fact_hash: string; pages: string[] }

    const rows = (await this.knex('fact_to_pages')
      .select(
        'fact_hash',
        this.knex.raw(
          'ARRAY_AGG(pages.data ORDER BY fact_to_pages.index) as pages'
        )
      )
      .join('pages', 'fact_to_pages.page_hash', 'pages.page_hash')
      .groupBy('fact_hash')
      .whereIn(
        'fact_hash',
        factHashes.map((x) => x.toString())
      )) as unknown as Row[]

    this.logger.debug({ method: 'getAllPagesForFacts', rows: rows.length })

    return sortBy(
      rows.map((row) => ({
        factHash: Hash256(row.fact_hash),
        pages: row.pages,
      })),
      (x) => factHashes.indexOf(x.factHash)
    )
  }

  async deleteAll() {
    await this.knex('pages').delete()
    this.logger.debug({ method: 'deleteAll' })
  }

  async deleteAllAfter(blockNumber: number) {
    const rowsCount = await this.knex('pages')
      .where('block_number', '>', blockNumber)
      .delete()

    this.logger.debug({ method: 'deleteAllAfter', rows: rowsCount })
  }
}

function toRow(record: PageRecord): PageRow {
  return {
    id: record.id,
    block_number: record.blockNumber,
    page_hash: record.pageHash.toString(),
    data: record.data,
  }
}

function toRecord(row: PageRow): PageRecord {
  return {
    id: row.id,
    blockNumber: row.block_number,
    pageHash: Hash256(row.page_hash),
    data: row.data,
  }
}