import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  ManagerPermissionsDto,
  ManagerPermissionsList,
  ProposalManagerRole,
  ProposalManagerRoleDto,
} from '@/lib/types/proposal-manager.type';
import FormHandleButtons from './FormHandleButtons';
import { useEffect, useState } from 'react';
import { SquarePen, Trash2 } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { FormItem } from '../ui/form';
import { cn } from '@/lib/utils';

export type ManageRoleFormProps = {
  defaultRoleTemplate?: ProposalManagerRole;
  handleEditSubmit?: (roleData: ProposalManagerRole) => void;
  handleCreateSubmit: (roleData: ProposalManagerRoleDto) => void;
  handleCancel?: (roleData: ProposalManagerRole) => void;
  className?: string;
};

const DEFAULT_PERMISSIONS: ManagerPermissionsDto = {
  canEditTitle: false,
  canEditDescription: false,
  canEditDates: false,
  canEditStatus: false,
  canEditVisibility: false,
  canDeleteVotes: false,
  canCreateVotes: false,
  canEditManagers: false,
  canEditVoteChoices: false,
  canEditAvailableChoices: false,
  canEditChoiceCount: false,
};

/**
 * TODO
 * Make prettier
 */
export default function ManagerRoleForm({
  defaultRoleTemplate,
  handleCreateSubmit,
  handleEditSubmit,
  handleCancel,
  className,
}: ManageRoleFormProps) {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
  const [emptyTitleError, setEmptyTitleError] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const resetForm = () => {
    setRoleName('');
    setDescription('');
    setPermissions(DEFAULT_PERMISSIONS);
    setEmptyTitleError(false);
    setIsEdit(false);
  };
  useEffect(() => {
    if (defaultRoleTemplate) {
      setRoleName(defaultRoleTemplate.roleName);
      setDescription(defaultRoleTemplate.description || '');

      const permissions = ManagerPermissionsList.reduce(
        (acc, permName) => ({
          ...acc,
          [permName]: defaultRoleTemplate.permissions[permName],
        }),
        {} as typeof DEFAULT_PERMISSIONS,
      );

      setPermissions(permissions);
      setIsEdit(true);
    } else {
      resetForm();
    }
  }, [defaultRoleTemplate]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (isEdit) {
          handleEditSubmit?.({
            roleName,
            description,
            permissions,
            id: defaultRoleTemplate!.id,
          });
        } else {
          handleCreateSubmit({
            roleName,
            description,
            permissions,
          });
          resetForm();
        }
      }}
      className={className}
    >
      <div className="flex flex-col gap-4">
        <FormItem>
          <Input
            placeholder="Your role name"
            value={roleName}
            className={cn('text-xl', {
              'border-red-500': emptyTitleError,
            })}
            onChange={e => setRoleName(e.target.value)}
          />
        </FormItem>
        <FormItem>
          <Textarea
            placeholder="Your role description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </FormItem>
      </div>
      <FormItem>
        <div className="my-10 flex flex-col gap-4">
          {/*
           * TODO
           * Add an option to select/deselect all permissions
           */}
          {Object.entries(permissions).map(([permName, isAllowed]) => (
            <div
              className="flex items-center justify-between px-6"
              key={permName}
            >
              <p>{permName}</p>
              <Checkbox
                checked={isAllowed}
                onCheckedChange={checked => {
                  setPermissions(prev => ({ ...prev, [permName]: checked }));
                }}
              />
            </div>
          ))}
        </div>
      </FormItem>
      <FormHandleButtons
        className="flex-row-reverse"
        formSubmitLabel={
          isEdit ? (
            <div className="flex items-center gap-4">
              Edit template <SquarePen />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              Create template <SquarePen />
            </div>
          )
        }
        formCancelLabel={
          isEdit ? (
            <div className="flex items-center gap-4">
              Delete <Trash2 />
            </div>
          ) : undefined
        }
        handleSubmitClick={e => {
          if (roleName === '') {
            e.preventDefault();
            setEmptyTitleError(true);
          } else {
            setEmptyTitleError(false);
          }
        }}
        handleCancelClick={
          isEdit
            ? () => {
                handleCancel?.({
                  roleName,
                  description,
                  permissions,
                  id: defaultRoleTemplate!.id,
                });
                resetForm();
              }
            : undefined
        }
      />
    </form>
  );
}
