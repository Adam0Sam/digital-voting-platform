import { Grades, User, UserRoles } from '@/lib/types';
import { ExtendedFormProps } from '../interface';
import { FC, PropsWithChildren, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import {
  MANAGER_ROLES_LOADER_ID,
  ManagerRolesLoaderReturnType,
} from '@/lib/loaders';
import {
  ProposalManagerDto,
  ProposalManagerRole,
} from '@/lib/types/proposal-manager.type';
import UserSelectionForm from './UserSelectionForm';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SquarePlay, SquarePlus, UserPlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import UserScrollArea from '@/components/UserScrollArea';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

type FormValues = User[];
export type ManagerSelectionFormProps = ExtendedFormProps<FormValues>;

const NO_ROLE = 'NO_ROLE_ID' as const;

const getCardStyles = () => 'flex flex-col items-center gap-4 overflow-hidden';

/**
 * Algorithms in this component can be significantly improved.
 * Maybe could use these as example flowcharts for part B docs
 */
const ManagerSelectionForm: FC<
  PropsWithChildren<ManagerSelectionFormProps>
> = ({ onSubmit, onCancel, children }) => {
  const authoredManagerRoles = useRouteLoaderData(
    MANAGER_ROLES_LOADER_ID,
  ) as ManagerRolesLoaderReturnType;

  const [sheetIsOpen, setSheetIsOpen] = useState(false);

  const [mappedManagers, setMappedManagers] = useState<
    {
      role: ProposalManagerRole;
      users: User[];
    }[]
  >([]);

  const handleUserRemove = (targetUser: User) => {
    setMappedManagers(prevManagers =>
      prevManagers.map(manager => {
        const userIsFound = !!manager.users.find(
          user => user.id === targetUser.id,
        );
        if (userIsFound) {
          return {
            ...manager,
            users: manager.users.filter(user => user.id !== targetUser.id),
          };
        } else {
          return manager;
        }
      }),
    );
  };

  const handleUserSelectionEnd = (
    selectedUsers: User[],
    assignedRole: ProposalManagerRole,
  ) => {
    setMappedManagers(prevManagers => {
      const updatedManagers = prevManagers.map(manager => {
        if (manager.role === assignedRole) {
          return {
            ...manager,
            users: selectedUsers,
          };
        } else {
          return manager;
        }
      });

      return updatedManagers;
    });
  };

  const handleRoleAddition = (role: ProposalManagerRole) => {
    setMappedManagers(prevManagers => {
      return [
        ...prevManagers,
        {
          role,
          users: [],
        },
      ];
    });
  };

  const handleRoleRemoval = (role: ProposalManagerRole) => {
    setMappedManagers(prevManagers =>
      prevManagers.filter(manager => manager.role.id !== role.id),
    );
  };

  return (
    <div className="flex max-w-5xl flex-1 flex-col gap-8">
      <div className="flex flex-col">
        <div>
          <div className="flex items-center justify-center">
            <p className={cn('text-2xl', { 'text-destructive': false })}>
              Selected Manager Users
            </p>
          </div>
          <Separator className="mb-5 mt-2" />
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,24rem))] gap-10 [grid-auto-rows:20rem]">
          {mappedManagers.map(({ role, users }) => {
            return (
              <Card key={role.id} className={getCardStyles()}>
                <CardHeader>
                  <CardTitle>{role.roleName}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <UserSelectionForm
                  initiallySelectedUsers={users}
                  onSelectionEnd={selectedUsers =>
                    handleUserSelectionEnd(selectedUsers, role)
                  }
                  disableSubmit={true}
                  className="w-full px-4"
                />
              </Card>
            );
          })}
          <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
            <SheetTrigger asChild>
              <Card className="flex cursor-pointer items-center justify-center hover:bg-muted">
                <SquarePlus size={36} />
              </Card>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-full sm:w-1/2 sm:max-w-screen-md"
            >
              <div className="flex flex-col gap-8">
                <TooltipProvider>
                  {authoredManagerRoles?.map(role => {
                    const isSelected = !!mappedManagers.find(
                      manager => manager.role.id === role.id,
                    );

                    return (
                      <Tooltip key={role.id}>
                        <TooltipTrigger>
                          <div
                            className={cn(
                              'flex h-20 w-full cursor-pointer items-center justify-center border-secondary hover:bg-primary-foreground',
                              {
                                'bg-secondary': isSelected,
                                'border-primary': isSelected,
                              },
                            )}
                            onClick={() => {
                              if (isSelected) {
                                handleRoleRemoval(role);
                              } else {
                                handleRoleAddition(role);
                              }
                            }}
                          >
                            <p className="text-xl">{role.roleName}</p>
                            <p>{role.description}</p>
                          </div>
                        </TooltipTrigger>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default ManagerSelectionForm;
