export interface IGetAllUsersByPageService {
    keyword: string | null,
    recordsPerPage: number | 10;
    pageNumber: number | 1;
}

export interface IUpdateUserByIdService {
    email: string,
    name: string,
    primaryRole: string
}


export interface User {
    id: string,
    username: string,
    email: string,
    primaryRole: string
    isVerified: boolean,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    createdBy: string,
    updatedBy: string,
    imageUrl: string | null,
}