export type TPaginateRequest<Filter> = {
  paginate: {
    page: number;
    count: number;
  };
  sort: {
    name: string;
    type: 'asc';
  };
  filter?: Filter;
};

export interface IActionFilter {
  id: string;
  name: string;
}
