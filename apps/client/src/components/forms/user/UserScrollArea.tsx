import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from '@/lib/types';
import { UserMinus } from 'lucide-react';

const UserScrollArea = ({
  users,
  handleRemove,
}: {
  users: User[];
  handleRemove: (user: User) => void;
}) => (
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
          <Button variant="ghost" onClick={() => handleRemove(user)}>
            <UserMinus size={22} />
          </Button>
        </div>
      );
    })}
  </ScrollArea>
);

export default UserScrollArea;