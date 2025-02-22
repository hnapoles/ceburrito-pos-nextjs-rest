import { IUserWho } from '../models/users-model';

import { TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function WhoTabContent({ who }: { who: IUserWho }) {
  return (
    <TabsContent value="who" className="px-0">
      <Card>
        <CardHeader>
          <CardTitle>Record Audit</CardTitle>
          <CardDescription>Audit trail for this record.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>Created by: {who?.createdBy}</div>
          <div>
            Created At:{' '}
            {who.createdAt?.toLocaleString('en-US', {
              timeZone: 'America/Chicago',
            })}
          </div>
          <Separator className="my-4" />
          <div>Updated by: {who?.updatedBy}</div>
          <div>
            Updated At:{' '}
            {who.updatedAt?.toLocaleString('en-US', {
              timeZone: 'America/Chicago',
            })}
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </TabsContent>
  );
}
