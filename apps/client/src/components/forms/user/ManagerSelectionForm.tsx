import { User } from '@/lib/types';
import { ExtendedFormProps } from '../interface';
import { FC, useEffect, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import {
  MANAGER_ROLES_LOADER_ID,
  ManagerRolesLoaderReturnType,
} from '@/lib/loaders';
import {
  ProposalManagerListDto,
  ProposalManagerRole,
} from '@/lib/types/proposal-manager.type';
import UserSelectionForm from './UserSelectionForm';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { SquarePlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ScrollArea } from '@/components/ui/scroll-area';
import FormHandleButtons from '../FormHandleButtons';
import ManagerRoleForm from '../ManagerRoleForm';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

type FormValues = ProposalManagerListDto[];
export type ManagerSelectionFormProps = ExtendedFormProps<FormValues>;

type RoleCardProps = {
  role: ProposalManagerRole;
  isSelected: boolean;
  handleClick: () => void;
};

const RoleCard: FC<RoleCardProps> = ({ role, handleClick, isSelected }) => {
  return (
    <div
      className={cn(
        'mb-4 flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-secondary hover:bg-primary-foreground',
        {
          'bg-secondary': isSelected,
          'border-primary': isSelected,
        },
      )}
      key={role.id}
      onClick={handleClick}
    >
      <p className="text-xl font-bold">{role.roleName}</p>
      <p className="max-w-prose overflow-hidden text-ellipsis text-secondary-foreground">
        {role.description}
      </p>
    </div>
  );
};

/**
 * Algorithms in this component can be significantly improved.
 * Maybe could use these as example flowcharts for part B docs
 */
const ManagerSelectionForm: FC<ManagerSelectionFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [authoredManagerRoles, setAuthoredManagerRoles] = useState<
    ProposalManagerRole[]
  >([]);

  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [roleFormIsOpen, setRoleFormIsOpen] = useState(false);

  const [mappedManagers, setMappedManagers] = useState<
    ProposalManagerListDto[]
  >([]);

  const loadedManagerRoles = useRouteLoaderData(
    MANAGER_ROLES_LOADER_ID,
  ) as ManagerRolesLoaderReturnType;

  useEffect(() => {
    setAuthoredManagerRoles(loadedManagerRoles);
    if (loadedManagerRoles.length === 0) {
      setSheetIsOpen(true);
    }
  }, [loadedManagerRoles]);

  const handleUserRemove = (targetUser: User) => {
    setMappedManagers(prevManagers =>
      prevManagers
        .map(manager => {
          const userIsFound = !!manager.users.find(
            user => user.id === targetUser.id,
          );
          if (userIsFound) {
            const filteredUsers = manager.users.filter(
              user => user.id !== targetUser.id,
            );

            if (filteredUsers.length === 0) {
              return null;
            }

            return {
              ...manager,
              users: filteredUsers,
            };
          } else {
            return manager;
          }
        })
        .filter(manager => manager !== null),
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

        <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-10 [grid-auto-rows:20rem]">
          {mappedManagers.map(({ role, users }) => {
            return (
              <Card
                key={role.id}
                className="flex max-w-sm flex-col items-center gap-4 overflow-hidden"
              >
                <CardHeader>
                  <CardTitle>{role.roleName}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <UserSelectionForm
                  initiallySelectedUsers={users}
                  onSelectionEnd={selectedUsers => {
                    console.log('selectedUsers', selectedUsers);
                    handleUserSelectionEnd(selectedUsers, role);
                  }}
                  onUserRemove={handleUserRemove}
                  disableSubmit={true}
                  className="w-full px-4"
                />
              </Card>
            );
          })}
          <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
            <SheetTrigger asChild>
              <Card className="flex max-w-sm cursor-pointer items-center justify-center hover:bg-muted">
                <SquarePlus size={36} />
              </Card>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-full py-20 sm:w-1/2 sm:max-w-screen-md"
            >
              <ScrollArea className="h-full">
                {roleFormIsOpen ? (
                  <div className="flex flex-col items-center">
                    {authoredManagerRoles.length === 0 && (
                      <div className="mb-12 flex flex-col items-center gap-2">
                        <h3 className="text-xl text-muted-foreground">
                          You have not created any manager roles
                        </h3>
                        <p className="text-2xl">Create a Manager Role</p>
                      </div>
                    )}
                    <ManagerRoleForm
                      handleCreateSubmit={templateDto => {
                        api.managerRole.createRole(templateDto).then(role => {
                          const newRole: ProposalManagerRole = {
                            ...role,
                            permissions: templateDto.permissions,
                          };
                          setAuthoredManagerRoles(prevRoles => [
                            ...prevRoles,
                            newRole,
                          ]);
                          handleRoleAddition(newRole);
                          setSheetIsOpen(false);
                        });
                      }}
                      className="w-full max-w-sm"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-10">
                    <div className="w-full max-w-lg">
                      {authoredManagerRoles?.map(role => {
                        const isSelected = !!mappedManagers.find(
                          manager => manager.role.id === role.id,
                        );

                        return (
                          <RoleCard
                            key={role.id}
                            role={role}
                            isSelected={isSelected}
                            handleClick={() => {
                              if (isSelected) {
                                handleRoleRemoval(role);
                              } else {
                                handleRoleAddition(role);
                              }
                              setSheetIsOpen(false);
                            }}
                          />
                        );
                      })}
                    </div>
                    <Button
                      onClick={() => setRoleFormIsOpen(true)}
                      className="flex max-w-sm items-center justify-center"
                    >
                      <div className="flex items-center gap-4 text-lg">
                        Create a new role
                        <SquarePlus />
                      </div>
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <FormHandleButtons
        handleCancelClick={onCancel}
        handleSubmitClick={() => onSubmit?.(mappedManagers)}
      />
    </div>
  );
};

export default ManagerSelectionForm;
