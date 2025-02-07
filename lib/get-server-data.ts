import { apiRequest } from "./axios-client-v2";
import { IUserResponse } from "@/app/model/users-model";


const appApiServerUrl = process.env.APP_API_SERVER_URL || "http://172.104.117.139:3000/"

export async function getServerData(accessToken: string) {

    let primaryRole = ""
    let apiKey = ""
    if (accessToken) {
        const { data, error } = await apiRequest<IUserResponse>({ url: `${appApiServerUrl}/auth/login/jwt`, 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+accessToken,
          },
        });

        if (error) {
          console.log('error from api serer => ', error)
          apiKey = 'error-from-api-server'
          primaryRole = 'error-from-api-server'
        } else {
          if (data && data.apiKey) {
            apiKey = data.apiKey
          }
          if (data && data.primaryRole) {
            primaryRole = data.primaryRole
          }
          
        }
    }
    return { apiKey, primaryRole }

}
        
    