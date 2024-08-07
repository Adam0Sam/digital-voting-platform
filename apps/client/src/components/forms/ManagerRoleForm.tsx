import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ProposalManagerRoleDto } from '@/lib/types/proposal-manager.type';
import FormHandleButtons from './FormHandleButtons';
import { useEffect, useState } from 'react';
import { SquarePen, Trash2 } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { FormItem } from '../ui/form';
import { cn } from '@/lib/utils';
import { set } from 'date-fns';

export type ManageRoleFormProps = {
  defaultRoleTemplate?: ProposalManagerRoleDto;
  onSubmit: (roleData: ProposalManagerRoleDto) => void;
};

const DEFAULT_PERMISSIONS = {
  canEditTitle: true,
  canEditDescription: true,
  canEditDates: true,
  canEditStatus: false,
  canEditVisibility: false,
  canEditVotes: false,
  canEditManagers: false,
  canEditChoices: false,
  canEditChoiceCount: false,
};

/**
 * TODO
 * Make prettier
 */
export default function ManagerRoleForm({
  defaultRoleTemplate,
  onSubmit,
}: ManageRoleFormProps) {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
  const [emptyTitleError, setEmptyTitleError] = useState(false);

  useEffect(() => {
    if (defaultRoleTemplate) {
      setRoleName(defaultRoleTemplate.roleName);
      setDescription(defaultRoleTemplate.description || '');
      setPermissions(defaultRoleTemplate.permissions);
    } else {
      setRoleName('');
      setDescription('');
      setPermissions(DEFAULT_PERMISSIONS);
    }
  }, [defaultRoleTemplate]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit({
          roleName,
          description,
          permissions,
        });
      }}
    >
      <FormItem>
        <Input
          placeholder="Your role name"
          value={roleName}
          className={cn({ 'border-red-500': emptyTitleError })}
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
      <FormItem>
        <div className="flex flex-col gap-4">
          {Object.entries(permissions).map(([permName, isAllowed]) => (
            <div key={permName} className="flex items-center gap-4">
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
          defaultRoleTemplate ? (
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
          defaultRoleTemplate ? (
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
          defaultRoleTemplate
            ? () => {
                setRoleName('');
                setDescription('');
                setPermissions(DEFAULT_PERMISSIONS);
              }
            : undefined
        }
      />
    </form>
  );
}
