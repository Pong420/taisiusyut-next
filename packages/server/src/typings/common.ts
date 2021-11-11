export interface CreatedAt {
  createdAt: number;
}
export interface UpdatedAt {
  updatedAt: number;
}

export interface Timestamp extends CreatedAt, UpdatedAt {}

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
