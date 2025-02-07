import { auth } from "@/auth";
import { NextRequest } from "next/server";

import { FindOneForDeleteProps, ApiOperationNames } from "@/app/model/api-model";
import { IProduct } from "@/app/model/products-model";

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response('unauthorized', {status: 401});
  }

  

  

  return Response.json({success: true,  session}, {status: 200});
}
