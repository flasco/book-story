import { IRecord } from '@/definition';
import { getBookRecord, updateBookRecord } from '@/storage/book';

class RecordCache {
  key: string;
  record: IRecord = {} as IRecord;

  constructor(key: string) {
    this.key = key;
  }

  init = async () => {
    this.record = await getBookRecord(this.key);
  };

  getWatchedPage = () => this.record.recordPage;

  getChapterPosition = () => this.record.recordChapterNum;

  getLastChapterUrl = () => this.record.recordChapterUrl || '';

  updateRecord = (param: Partial<IRecord>, needSave = false) => {
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
