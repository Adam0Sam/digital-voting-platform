import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ExtendedFormProps } from '../interface';
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';
import { Button } from '../../ui/button';
import { SquareMinus, SquarePlus } from 'lucide-react';
import FormHandleButtons from '../FormHandleButtons';
import TitleDescriptionForm from '../TitleDescriptionForm';
import { Separator } from '../../ui/separator';
import { ScrollArea } from '../../ui/scroll-area';
import ChoiceCountPopover from './ChoiceCountPopover';

import { cn } from '@/lib/utils';
import { ProposalChoiceDto } from '@/lib/types/proposal.type';

type FormValues = {
  choices: ProposalChoiceDto[];
  choiceCount: number;
};
export type ProposalChoiceFormProps = ExtendedFormProps<FormValues> & {
  initialChoices?: ProposalChoiceDto[];
  disableEdit?: boolean;
  children?: React.JSX.Element;
};

export type ProposalChoiceFormHandle = {
  getChoices: () => ProposalChoiceDto[];
  getChoiceCount: () => number;
};

const ProposalChoiceForm = forwardRef(_ProposalChoiceForm);
export default ProposalChoiceForm;

function _ProposalChoiceForm(
  props: ProposalChoiceFormProps,
  ref: React.Ref<ProposalChoiceFormHandle>,
) {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [proposalChoices, setProposalChoices] = useState<ProposalChoiceDto[]>(
    props.initialChoices ?? [],
  );
  const choiceCount = useRef(1);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    getChoices: () => proposalChoices,
    getChoiceCount: () => choiceCount.current,
  }));

  return (
    <div className="flex max-w-md flex-1 flex-col gap-8">
      <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
        <div className="flex flex-col-reverse gap-10 md:flex-row">
          <div className="flex flex-1 flex-col">
            <SheetTrigger asChild disabled={!!props.disableEdit}>
              <div>
                <div className="flex items-center justify-between">
                  <p className={cn({ 'text-destructive': error })}>
                    Resolution Values
                  </p>
                  {!props.disableEdit && (
                    <Button variant="ghost">
                      <SquarePlus />
                    </Button>
                  )}
                </div>
                <Separator className="mb-5 mt-2" />
              </div>
            </SheetTrigger>
            <ScrollArea className="h-48">
              {error && <p className="text-md text-destructive">{error}</p>}
              {proposalChoices.map(resolution => (
                <div
                  className="mb-4 flex items-center justify-between rounded-md border px-2 py-2"
                  key={resolution.value}
                >
                  <p className="ml-4">{resolution.value}</p>
                  {!props.disableEdit && (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setProposalChoices(prev =>
                          prev.filter(res => res.value !== resolution.value),
                        )
                      }
                    >
                      <SquareMinus size={22} />
                    </Button>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
          <ChoiceCountPopover
            maxChoiceCount={
              proposalChoices.length !== 0 ? proposalChoices.length : 1
            }
            defaultChoiceCount={choiceCount.current}
            handleSelect={value => {
              if (props.disableEdit) return;
              choiceCount.current = value;
            }}
          />
        </div>
        <SheetContent
          side="right"
          className="w-full max-w-full sm:w-3/4 sm:max-w-screen-md"
        >
          <div className="flex h-full w-full items-center justify-center">
            <TitleDescriptionForm
              onSubmit={({ title, description }) => {
                setProposalChoices(prevResolutions => [
                  ...prevResolutions,
                  { value: title, description },
                ]);
                setError(null);
                setSheetIsOpen(false);
              }}
              titleLabel="Resolution Value"
              descriptionLabel="Description"
              onCancel={() => setSheetIsOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
      {props.children ? (
        props.children
      ) : (
        <FormHandleButtons
          formSubmitLabel={props.formSubmitLabel}
          formCancelLabel={props.formCancelLabel}
          handleSubmitClick={() => {
            if (proposalChoices.length === 0) {
              setError('Please add at least one resolution value');
              return;
            }
            setError(null);
            props.onSubmit?.({
              choices: proposalChoices,
              choiceCount: choiceCount.current,
            });
          }}
          enableSubmit={!props.disableSubmit && !props.disableEdit}
          handleCancelClick={props.onCancel}
        />
      )}
    </div>
  );
}
