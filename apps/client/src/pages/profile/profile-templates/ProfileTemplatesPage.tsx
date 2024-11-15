import ManagerRoleTemplates from './ManagerRoleTemplates';

export default function ProfileTemplatesPage() {
  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <h4 className="text-2xl">Profile Templates</h4>
      </div>
      <ManagerRoleTemplates />
    </div>
  );
}
