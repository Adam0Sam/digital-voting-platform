import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import FormHandleButtons from './FormHandleButtons';
import { useEffect, useState } from 'react';
import { SquarePen, Trash2 } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { FormItem } from '../ui/form';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import {
  CreateManagerRoleDto,
  ManagerPermissionNames,
  ManagerPermissions,
  ManagerRole,
} from '@ambassador';

export type ManageRoleFormProps = {
  defaultRoleTemplate?: ManagerRole;
  handleEditSubmit?: (roleData: ManagerRole) => void;
  handleCreateSubmit: (roleData: CreateManagerRoleDto) => void;
  handleCancel?: (roleData: ManagerRole) => void;
  className?: string;
};

const DEFAULT_PERMISSIONS: ManagerPermissions = {
  canEditTitle: false,
  canEditDescription: false,
  canEditDates: false,
  canEditStatus: false,
  canEditVisibility: false,
  canDeleteVotes: false,
  canCreateVotes: false,
  canEditManagers: false,
  canEditVotes: false,
  canEditCandidates: false,
  canEditChoiceCount: false,
  canEditUserPattern: false,
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
  const [emptyPermissionsError, setEmptyPermissionsError] = useState(false);
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

      const permissions = ManagerPermissionNames.reduce(
        (acc, permName) => ({
          ...acc,
          [permName]: defaultRoleTemplate.permissions[permName],
        }),
        {} as ManagerPermissions,
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
          if (Object.values(permissions).some(perm => perm === true)) {
            handleCreateSubmit({
              roleName,
              description,
              permissions,
            });
            resetForm();
          } else {
            setEmptyPermissionsError(true);
          }
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
          <div className="flex flex-col">
            <h4
              className={cn('text-center text-2xl', {
                'text-red-500': emptyPermissionsError,
              })}
            >
              Permissions
            </h4>
            {emptyPermissionsError && (
              <p className="text-center text-sm text-red-500">
                You must select at least one permission
              </p>
            )}
          </div>
          <Separator />
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
                  setEmptyPermissionsError(false);
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
