import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Grade, Grades, UserRole, UserRoles } from '@ambassador';
import { Check } from 'lucide-react';
import { forwardRef, Ref, useImperativeHandle, useState } from 'react';

type UserPatternSelectionGridProps = {
  initialGrades?: Grade[];
  initialRoles?: UserRole[];
};
export type UserPatternSelectionGridHandles = {
  getSelectedGrades: () => Grade[];
  getSelectedRoles: () => UserRole[];
};

const UserPatternSelectionGrid = (
  props: UserPatternSelectionGridProps,
  ref: Ref<UserPatternSelectionGridHandles>,
) => {
  const [selectedGrades, setSelectedGrades] = useState<Grade[]>(
    props.initialGrades ?? [],
  );
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(
    props.initialRoles ?? [],
  );

  const toggleGrade = (grade: Grade) => {
    setSelectedGrades(prev =>
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade],
    );
  };

  const toggleRole = (role: UserRole) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role],
    );
  };

  useImperativeHandle(ref, () => ({
    getSelectedGrades: () => selectedGrades,
    getSelectedRoles: () => selectedRoles,
  }));

  return (
    <Tabs defaultValue="grades" className="mt-6 w-full">
      <TabsList>
        <TabsTrigger value="grades">Grades</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
      </TabsList>
      <TabsContent value="grades">
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Grades.map(grade => (
              <Card
                key={grade}
                className={`cursor-pointer transition-colors ${
                  selectedGrades.includes(grade)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                }`}
                onClick={() => toggleGrade(grade)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <span>{grade}</span>
                  {selectedGrades.includes(grade) && (
                    <Check className="h-4 w-4" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="roles">
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-2 gap-4">
            {UserRoles.map(role => (
              <Card
                key={role}
                className={`cursor-pointer transition-colors ${
                  selectedRoles.includes(role)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                }`}
                onClick={() => toggleRole(role)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <span>{role}</span>
                  {selectedRoles.includes(role) && (
                    <Check className="h-4 w-4" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default forwardRef(UserPatternSelectionGrid);
