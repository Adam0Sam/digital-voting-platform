import { FC, useState } from 'react';
import { ExtendedFormProps } from '../interface';
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';
import { Button } from '../../ui/button';
import { SquareMinus, SquarePlus } from 'lucide-react';
import FormHandleButtons from '../FormHandleButtons';
import TitleDescriptionForm from '../TitleDescriptionForm';
import { Separator } from '../../ui/separator';
import { ResolutionValue } from '@/types/proposal.type';
import { ScrollArea } from '../../ui/scroll-area';
import ChoiceCountPopover from './ChoiceCountPopover';

type FormValues = ResolutionValue[];
export type ResolutionValueFormProps = ExtendedFormProps<FormValues>;

const ResolutionValueForm: FC<ResolutionValueFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [resolutionValues, setResolutionValues] = useState<ResolutionValue[]>(
    [],
  );

  return (
    <div className="flex max-w-md flex-1 flex-col gap-8">
      <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
        <div className="flex flex-col-reverse gap-10 md:flex-row">
          <div className="flex flex-1 flex-col">
            <SheetTrigger asChild>
              <div>
                <div className="flex items-center justify-between">
                  Resolution Values
                  <Button variant="ghost">
                    <SquarePlus />
                  </Button>
                </div>
                <Separator className="mb-5 mt-2" />
              </div>
            </SheetTrigger>
            <ScrollArea className="h-48">
              {resolutionValues.map(resolution => (
                <div
                  className="mb-4 flex items-center justify-between rounded-md border px-2 py-2"
                  key={resolution.value}
                >
                  <p className="ml-4">{resolution.value}</p>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setResolutionValues(prev =>
                        prev.filter(res => res.value !== resolution.value),
                      )
                    }
                  >
                    <SquareMinus size={22} />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </div>
          <ChoiceCountPopover
            maxChoiceCount={
              resolutionValues.length !== 0 ? resolutionValues.length : 1
            }
          />
        </div>
        <SheetContent
          side="right"
          className="w-full max-w-full sm:w-3/4 sm:max-w-screen-md"
        >
          <div className="flex h-full w-full items-center justify-center">
            <TitleDescriptionForm
              onSubmit={({ title, description }) => {
                setResolutionValues(prevResolutions => [
                  ...prevResolutions,
                  { value: title, description },
                ]);
                setSheetIsOpen(false);
              }}
              titleLabel="Resolution Value"
              descriptionLabel="Description"
              onCancel={() => setSheetIsOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
      <FormHandleButtons
        formSubmitLabel="Next"
        formCancelLabel="Cancel"
        handleSubmitClick={() => onSubmit(resolutionValues)}
        handleCancelClick={onCancel}
      />
    </div>
  );
};

export default ResolutionValueForm;
