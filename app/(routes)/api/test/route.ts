import { auth } from "@/auth";
export async function GET() {
  const session = await auth();
  if (!session) {

    //const token = 

    return new Response('unauthorized', {status: 401});
  }

  //if (session) console.log(session)

    //return new Response('ok', {status: 201});
    return Response.json({success: true,  session}, {status: 200});
}
