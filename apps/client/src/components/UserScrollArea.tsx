import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from '@/lib/types';
import { UserMinus } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';

const UserScrollArea: FC<
  PropsWithChildren<{ users: User[]; handleRemove: (user: User) => void }>
> = ({ users, handleRemove, children }) => (
  <ScrollArea className="max-h-48 overflow-auto md:h-48">
    {users.map(user => {
      return (
        <div
          className="mb-4 flex items-center justify-between gap-12 rounded-md border px-2 py-4"
          key={user.id}
        >
          <p>
            {user.personalNames.join(' ')}, {user.familyName}
          </p>
          <div className="flex items-center gap-2">
            {children}
            <Button variant="ghost" onClick={() => handleRemove(user)}>
              <UserMinus size={22} />
            </Button>
          </div>
        </div>
      );
    })}
  </ScrollArea>
);

export default UserScrollArea;
