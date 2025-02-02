export interface IUserResponse {
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
    accessToken: string | null
}