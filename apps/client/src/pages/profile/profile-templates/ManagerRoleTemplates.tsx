import ManagerRoleForm from '@/components/forms/ManagerRoleForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { api } from '@/lib/api';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { ManagerRolesLoaderReturnType } from '@/lib/loaders';
import {
  ProposalManagerRole,
  ProposalManagerRoleDto,
} from '@/lib/types/proposal-manager.type';

import { ListPlus, Settings2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router-dom';

/**
 * TODO
 * Rethink how mobile form is displayed
 */

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
  const authoredRoles = useLoaderData() as ManagerRolesLoaderReturnType;
  const revalidator = useRevalidator();

  const [templates, setTemplates] = useState(authoredRoles);
  const [openedTemplate, setOpenedTemplates] =
    useState<ProposalManagerRole | null>(null);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);

  useEffect(() => {
    setTemplates(authoredRoles);
  }, [authoredRoles]);

  const { width: windowWidth } = useWindowSize();

  const handleOpenedTemplate = (template: ProposalManagerRole | null) => {
    setOpenedTemplates(template);
    /**
     * TODO:
     * Bug with Sheet not auto closing as window stretches from mobile
     */
    if (windowWidth < 768) {
      setSheetIsOpen(true);
    } else {
      setSheetIsOpen(false);
    }
  };

  const createTemplate = async (roleTemplateDto: ProposalManagerRoleDto) => {
    await api.managerRole.createRole(roleTemplateDto);
    revalidator.revalidate();
  };

  const editTemplate = async (roleTemplate: ProposalManagerRole) => {
    setTemplates(prevTemplates =>
      prevTemplates.map(template =>
        template.id === roleTemplate.id ? roleTemplate : template,
      ),
    );
    await api.managerRole.updateRole(roleTemplate);
  };

  const deleteTemplate = async (roleTemplate: ProposalManagerRole) => {
    setTemplates(prevTemplates =>
      prevTemplates.filter(template => template.id !== roleTemplate.id),
    );
    await api.managerRole.deleteOneRole(roleTemplate.id);
  };

  const deleteManyTemplates = async (roleTemplateIds: string[]) => {
    setTemplates(prevTemplates =>
      prevTemplates.filter(template => !roleTemplateIds.includes(template.id)),
    );
    await api.managerRole.deleteManyRoles(roleTemplateIds);
  };

  const ManagerRoleCard = (
    <Card className="p-4">
      <ManagerRoleForm
        defaultRoleTemplate={openedTemplate ? openedTemplate : undefined}
        handleCreateSubmit={createTemplate}
        handleEditSubmit={editTemplate}
        handleCancel={deleteTemplate}
      />
    </Card>
  );
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
                Add Template <ListPlus />
              </div>
            </Button>
            <Button
              variant="ghost"
              onClick={() => deleteManyTemplates(selectedTemplateIds)}
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
          {ManagerRoleCard}
        </SheetContent>
        <div className="hidden flex-1 md:block">{ManagerRoleCard}</div>
      </div>
    </Sheet>
  );
}
