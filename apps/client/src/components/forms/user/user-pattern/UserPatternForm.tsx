// import { Grade, UserPattern, UserRole } from '@ambassador';
// import { ExtendedFormProps, WithRequiredSubmit } from '../../interface';
// import { useRef, useState } from 'react';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import { Button } from '@/components/ui/button';
// import { SquareAsterisk } from 'lucide-react';
// import { MultiSelectDropdownHandle } from '@/components/MultiSelectDropdown';
// import FormHandleButtons from '../../FormHandleButtons';
// import { UserPatternFormContent } from './UserPatternFormContent';

// type FormValues = UserPattern;
// export type UserPatternFormProps = WithRequiredSubmit<
//   ExtendedFormProps<FormValues>
// >;

// export default function UserPatternForm({ onSubmit }: UserPatternFormProps) {
//   const [sheetIsOpen, setSheetIsOpen] = useState(false);
//   const gradesDropdownRef = useRef<MultiSelectDropdownHandle<Grade>>(null);
//   const rolesDropdownRef = useRef<MultiSelectDropdownHandle<UserRole>>(null);

//   return (
//     <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
//       <div className="flex flex-col-reverse md:flex-row">
//         <div className="flex flex-1 flex-col">
//           <SheetTrigger asChild className="flex-1">
//             <Button className="max-w-max">
//               <div className="flex items-center gap-2">
//                 <p>Create User Pattern</p>
//                 <SquareAsterisk />
//               </div>
//             </Button>
//           </SheetTrigger>
//         </div>
//       </div>
//       <SheetContent
//         side="right"
//         className="flex w-full max-w-full justify-center sm:w-3/4 sm:max-w-screen-md"
//       >
//         <UserPatternFormContent
//           gradesDropdownRef={gradesDropdownRef}
//           rolesDropdownRef={rolesDropdownRef}
//         >
//           <FormHandleButtons
//             className="mt-72"
//             handleSubmitClick={() => {
//               setSheetIsOpen(false);
//               onSubmit({
//                 grades: gradesDropdownRef.current?.getSelectedItems() ?? [],
//                 roles: rolesDropdownRef.current?.getSelectedItems() ?? [],
//               });
//             }}
//           />
//         </UserPatternFormContent>
//       </SheetContent>
//     </Sheet>
//   );
// }

import { UserPattern } from '@ambassador';
import { ExtendedFormProps, WithRequiredSubmit } from '../../interface';
import { useRef, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SquareAsterisk } from 'lucide-react';
import FormHandleButtons from '../../FormHandleButtons';
import UserPatternSelectionGrid, {
  UserPatternSelectionGridHandles,
} from './UserPatternSelectionGrid';

type FormValues = UserPattern;
export type UserPatternFormProps = WithRequiredSubmit<
  ExtendedFormProps<FormValues>
>;

export default function UserPatternForm({ onSubmit }: UserPatternFormProps) {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const selectionGridRef = useRef<UserPatternSelectionGridHandles>(null);
  const handleSubmit = () => {
    setSheetIsOpen(false);
    if (!selectionGridRef.current)
      throw new Error('Selection grid ref is null');
    onSubmit({
      grades: selectionGridRef.current.getSelectedGrades(),
      roles: selectionGridRef.current.getSelectedRoles(),
    });
  };

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <SheetTrigger asChild>
        <Button className="max-w-max">
          <SquareAsterisk className="mr-2 h-4 w-4" />
          Create User Pattern
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Create User Pattern</SheetTitle>
          <SheetDescription>
            Select grades and roles to define the user pattern. Users matching
            this pattern will be automatically added to the voter list.
          </SheetDescription>
        </SheetHeader>
        <UserPatternSelectionGrid ref={selectionGridRef} />
        <div className="mt-6">
          <FormHandleButtons
            handleSubmitClick={handleSubmit}
            handleCancelClick={() => setSheetIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
