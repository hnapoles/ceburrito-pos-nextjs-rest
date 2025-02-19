import { IUserWho } from "../model/users-model"

import { TabsContent } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator"

export function WhoTabContent({who} : {who: IUserWho} ) {
    return (
        <TabsContent value="who" className="px-10">
                         Row Who?
                        <Separator className="my-4" />
                        <div className="relative space-between-10">
                            <div>
                                Created by: {who?.createdBy}
                            </div>
                            <div>
                                Created At: {who.createdAt?.toLocaleString('en-US', { timeZone: 'America/Chicago' })}
                            </div>
                            <div className="py-2">

                            </div>
                            <div>
                                Updated by: {who?.updatedBy}
                            </div>
                            <div>
                                Updated At: {who.updatedAt?.toLocaleString('en-US', { timeZone: 'America/Chicago' })}
                            </div>
                        </div>
        </TabsContent>
    )
}