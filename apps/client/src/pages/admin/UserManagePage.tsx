import { useState } from 'react';
import GenericSpinner from '@/components/GenericSpinner';
import {
  LOADER_IDS,
  useAsyncLoaderValue,
  useDeferredLoadedData,
} from '@/lib/loaders';
import { Suspense } from 'react';
import { Await, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { User, Grade, UserRole, Grades, UserRoles } from '@ambassador';
import { Pencil, Save, X, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';
import { ADMIN_HREFS } from '@/lib/routes';

const EditableUserRoles = UserRoles.filter(role => role !== UserRole.ADMIN);
type EditableUserRole = (typeof EditableUserRoles)[number];

export default function UserManagePage() {
  const users = useDeferredLoadedData(LOADER_IDS.USER_DEEP_INFO);
  return (
    <Suspense fallback={<GenericSpinner centered />}>
      <Await resolve={users.data}>{<_UserManagePage />}</Await>
    </Suspense>
  );
}

function _UserManagePage() {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const allUsers = useAsyncLoaderValue(LOADER_IDS.USER_DEEP_INFO);
  const user = allUsers.find(u => u.id === userId);

  if (!user || !userId) {
    throw new Error('User not found');
  }

  if (user.roles.includes(UserRole.ADMIN)) {
    throw new Error('Cannot manage admin user accounts');
  }

  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);

  const handleInputChange = (
    field: keyof User,
    value: string | Grade | EditableUserRole[],
  ) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = () => {
    api.admin.deleteUser(userId);
    toast('User Deleted', {
      description: 'The user account has been permanently deleted.',
      duration: 5000,
    });
    navigate(ADMIN_HREFS.USERS);
  };

  const handleSave = () => {
    api.admin.editUser(userId, editedUser);
    toast('User Updated', {
      description: `${user.personalNames.join(', ')}, ${user.familyName} information has been successfully updated.`,
      duration: 5000,
    });
    setEditMode(false);
  };

  const handleAccountToggle = () => {
    if (editedUser.active) {
      api.admin.deactivateUser(userId);
    } else {
      api.admin.activateUser(userId);
    }

    setEditedUser(prev => ({ ...prev, active: !prev.active }));
    toast(`Account ${editedUser.active ? 'Disabled' : 'Enabled'}`, {
      description: `Account ${
        editedUser.active ? 'disabled' : 'enabled'
      } for ${editedUser.personalNames.join(' ')} ${editedUser.familyName}.`,
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Manage User: {editedUser.personalNames.join(' ')}{' '}
            {editedUser.familyName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={editedUser.email || ''}
                onChange={e => handleInputChange('email', e.target.value)}
                disabled={!editMode}
              />
            </div>
            <div>
              <Label htmlFor="grade">Grade</Label>
              <Select
                value={editedUser.grade}
                onValueChange={value =>
                  handleInputChange('grade', value as Grade)
                }
                disabled={!editMode}
              >
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Grades).map(grade => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Roles</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {editedUser.roles.map(role => (
                  <Badge key={role} variant="secondary">
                    {role}
                    {editMode && (
                      <button
                        onClick={() =>
                          handleInputChange(
                            'roles',
                            // @ts-expect-error - Error is thrown if account belongs to admin
                            editedUser.roles.filter(r => r !== role),
                          )
                        }
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </Badge>
                ))}
                {editMode && (
                  <Select
                    onValueChange={value =>
                      // @ts-expect-error - Error is thrown if account belongs to admin
                      handleInputChange('roles', [
                        ...editedUser.roles,
                        value as EditableUserRole,
                      ])
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Add role" />
                    </SelectTrigger>
                    <SelectContent>
                      {EditableUserRoles.filter(
                        role => !editedUser.roles.includes(role),
                      ).map(role => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="account-status"
                checked={editedUser.active}
                onCheckedChange={handleAccountToggle}
              />
              <Label htmlFor="account-status">
                Account {editedUser.active ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
            {editMode ? (
              <div className="space-x-2">
                <Button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setEditMode(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit User
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete User</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
