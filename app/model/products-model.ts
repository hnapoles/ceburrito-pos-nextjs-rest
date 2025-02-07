export interface IProduct {
    _id: string,
    name: string,
    description: string,
    imageUrl?: string | null
    createdAt: Date,
    updatedAt: Date,
    createdBy: string,
    updatedBy: string,
}

export interface IProductListProps {
    products: IProduct[],
    limit: number | 10,
    page: number | 1,
    totalDataCount: number | 1
}