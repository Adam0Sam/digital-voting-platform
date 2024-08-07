import ManagerRoleForm from '@/components/forms/ManagerRoleForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { ProposalManagerRole } from '@/lib/types/proposal-manager.type';
import { ListPlus, Settings2, Trash2 } from 'lucide-react';
import { useState } from 'react';

const mockTemplates = [
  {
    id: '1',
    roleName: 'Manager',
    description: 'This role has full permissions',
    permissions: {
      canEditTitle: true,
      canEditDescription: true,
      canEditDates: true,
      canEditStatus: true,
      canEditVisibility: true,
      canEditVotes: true,
      canEditManagers: true,
      canEditChoices: true,
      canEditChoiceCount: true,
    },
  },
  {
    id: '2',
    roleName: 'Voter',
    description: 'This role has limited permissions',
    permissions: {
      canEditTitle: false,
      canEditDescription: false,
      canEditDates: false,
      canEditStatus: false,
      canEditVisibility: false,
      canEditVotes: true,
      canEditManagers: false,
      canEditChoices: false,
      canEditChoiceCount: false,
    },
  },
  {
    id: '3',
    roleName: 'Admin',
    description: 'This role has all permissions',
    permissions: {
      canEditTitle: true,
      canEditDescription: true,
      canEditDates: true,
      canEditStatus: true,
      canEditVisibility: true,
      canEditVotes: false,
      canEditManagers: true,
      canEditChoices: true,
      canEditChoiceCount: true,
    },
  },
] satisfies ProposalManagerRole[];

function ManagertRoleItem({
  template,
  handleCheckedChange,
  handleSettingsClick,
}: {
  template: ProposalManagerRole;
  handleCheckedChange?: (isChecked: boolean) => void;
  handleSettingsClick?: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-md border-2 border-muted px-4 py-2">
      <div className="flex items-center gap-4">
        <Checkbox onCheckedChange={handleCheckedChange} />
        <div className="flex flex-col">
          <h3 className="text-lg font-bold">{template.roleName}</h3>
          <p className="text-sm text-muted-foreground">
            {template.description}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
        <Settings2 />
      </Button>
    </div>
  );
}

export default function ManagerRoleTemplates() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [openedTemplate, setOpenedTemplates] =
    useState<ProposalManagerRole | null>(null);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const { width: windowWidth } = useWindowSize();

  const handleOpenedTemplate = (template: ProposalManagerRole | null) => {
    setOpenedTemplates(template);
    if (windowWidth < 768) setSheetIsOpen(true);
  };

  const deleteSelectedTemplates = () => {
    setTemplates(prevTemplates =>
      prevTemplates.filter(
        template => !selectedTemplateIds.includes(template.id),
      ),
    );
  };
  /**
   * TODO:
   * How to make ScrollArea fill out the rest of the viewport
   */
  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <div className="flex max-h-[30rem] sm:gap-12">
        <div className="flex max-w-screen-sm flex-1 flex-col gap-8">
          <div className="flex justify-between">
            <Button onClick={() => handleOpenedTemplate(null)}>
              <div className="flex items-center gap-4">
                Add Template <ListPlus />˝
              </div>
            </Button>
            <Button
              variant="ghost"
              onClick={deleteSelectedTemplates}
              disabled={selectedTemplateIds.length === 0}
            >
              <Trash2 />
            </Button>
          </div>
          <ScrollArea className="h-full w-full">
            {templates.map(template => (
              <ManagertRoleItem
                key={template.id}
                template={template}
                handleCheckedChange={isChecked => {
                  if (isChecked) {
                    setSelectedTemplateIds(prevIds => [
                      ...prevIds,
                      template.id,
                    ]);
                  } else {
                    setSelectedTemplateIds(prevIds =>
                      prevIds.filter(id => id !== template.id),
                    );
                  }
                }}
                handleSettingsClick={() => {
                  handleOpenedTemplate(template);
                }}
              />
            ))}
          </ScrollArea>
        </div>
        <SheetContent
          side="right"
          className="block w-full max-w-full sm:w-3/4 sm:max-w-screen-xl md:hidden"
        >
          <Card>
            <ManagerRoleForm
              defaultRoleTemplate={openedTemplate ? openedTemplate : undefined}
              onSubmit={data => {
                console.log(data);
              }}
            />
          </Card>
        </SheetContent>
        <div className="hidden flex-1 md:block">
          <Card>
            <ManagerRoleForm
              defaultRoleTemplate={openedTemplate ? openedTemplate : undefined}
              onSubmit={data => {
                console.log(data);
              }}
            />
          </Card>
        </div>
      </div>
    </Sheet>
  );
}
