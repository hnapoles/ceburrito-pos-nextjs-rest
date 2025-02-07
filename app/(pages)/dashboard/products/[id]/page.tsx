import { notFound } from 'next/navigation';
import { IProduct } from '@/app/model/products-model';


export default async function Page({ params }: {
  params: Promise<{ id: string }>
} ) {

    const id = (await params).id

    

      if (!true) {
        notFound();
      }

    return (
            <div>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                   
                </div>
            </div>
        )
}