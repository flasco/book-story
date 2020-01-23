import { getBookRecord, updateBookRecord } from '@/storage/book';

interface IRecord {
  recordChapterNum: number;
  recordPage: number;
}

interface IRecordS {
  recordChapterNum?: number;
  recordPage?: number;
}

class RecordCache {
  key: string;
  record: IRecord;

  constructor(key: string) {
    this.key = key;
    this.record = getBookRecord(key);
  }

  getWatchedPage = () => this.record.recordPage;

  getChapterPosition = () => this.record.recordChapterNum;

  updateRecord = (param: IRecordS, needSave = false) => {
    this.record = {
      ...this.record,
      ...param,
    };

    if (needSave) {
      updateBookRecord(this.key, this.record);
    }
  };
}

export default RecordCache;
