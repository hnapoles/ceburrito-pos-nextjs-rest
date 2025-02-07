export interface IProductResponse {
    id: string,
    name: string,
    description: string,
    imageUrl?: string | null
    createdAt: Date,
    updatedAt: Date,
    createdBy: string,
    updatedBy: string,
}