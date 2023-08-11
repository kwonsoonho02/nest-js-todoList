export class page<T> {
  pageSize: number;
  totalCount: number;
  totalPage: number;
  items: T[];
  constructor(
    pageSize: number,
    pageCount: number,
    totalPage: number,
    items: T[],
  ) {
    this.pageSize = pageSize;
    this.totalCount = pageCount;
    this.totalPage = totalPage;
    this.items = items;
  }
}
