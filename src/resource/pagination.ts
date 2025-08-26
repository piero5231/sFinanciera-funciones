export const pagination = ({ page = 0, items = 1 }: { page?: number; items?: number }) => {
  const limit = items;
  const offset = page * limit;
  return {
    limit,
    offset,
  };
};

export type PaginationData<T> = {
  totalItems: number;
};

export interface IPaginationRequest {
  limit: number;
  offset: number;
}

export interface IMetaPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  nextPage?: number;
  prevPage?: number;
}

export const getPaginationData = ({ count, page = 0, limit = 1 }: { count: number; page?: number; limit?: number }) => {
  const totalPages = Math.ceil(count / limit);
  const nextPage = page < totalPages - 1 ? page + 1 : undefined;
  const prevPage = page > 0 ? page - 1 : undefined;
  if (!nextPage) return { totalItems: count, totalPages, currentPage: page, prevPage };
  if (!prevPage) return { totalItems: count, totalPages, currentPage: page, nextPage };
  return { totalItems: count, totalPages, currentPage: page, nextPage, prevPage };
};
