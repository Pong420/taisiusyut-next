export interface Timestamp {
  createdAt: number;
  updatedAt: number;
}

export interface IPaginateResult<T> {
  data: T[];
  total: number;
  pageSize: number;
  pageNo: number;
  totalPages: number;
  nextPage?: number | null;
  prevPage?: number | null;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  meta?: any;
}

export declare enum IOrder {
  ASC = 1,
  DESC = -1
}
