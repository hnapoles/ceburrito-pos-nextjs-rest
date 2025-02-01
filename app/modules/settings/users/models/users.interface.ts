export interface IGetAllUsersByPageService {
    search: string | null,
    recordsPerPage: number | 10;
    pageNumber: number | 1;
}

export interface IUpdateUserByIdService {
     email: string,
     name: string,
     primaryRole: string
}
