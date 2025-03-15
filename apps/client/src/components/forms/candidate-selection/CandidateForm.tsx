import React, {
  forwardRef,
  useEffect,
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
import { CreateCandidateDto } from '@ambassador';

type FormValues = {
  candidates: CreateCandidateDto[];
  choiceCount: number;
};
export type CandidateFormProps = ExtendedFormProps<FormValues> & {
  initialCandidates?: CreateCandidateDto[];
  initialChoiceCount?: number;
  disableEdit?: boolean;
  disableChoiceCountEdit?: boolean;
  children?: React.JSX.Element;
  className?: string;
  errorMessage?: string | null;
};

export type CandidateFormHandles = {
  getCandidates: () => CreateCandidateDto[];
  getChoiceCount: () => number;
};

const CandidateForm = forwardRef(_CandidateForm);
export default CandidateForm;

function _CandidateForm(
  props: CandidateFormProps,
  ref: React.Ref<CandidateFormHandles>,
) {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [candidates, setCandidates] = useState<CreateCandidateDto[]>(
    props.initialCandidates ?? [],
  );
  const choiceCount = useRef(props.initialChoiceCount ?? 1);
  const [error, setError] = useState<string | null>(props.errorMessage ?? null);

  useEffect(() => {
    setError(props.errorMessage ?? null);
  }, [props.errorMessage]);

  useImperativeHandle(ref, () => ({
    getCandidates: () => candidates,
    getChoiceCount: () => choiceCount.current,
  }));

  return (
    <div
      className={cn(
        'flex h-full max-w-md flex-1 flex-col gap-8',
        props.className,
      )}
    >
      <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
        <div className="flex flex-col-reverse gap-10 md:flex-row">
          <div className="flex flex-1 flex-col">
            <SheetTrigger asChild disabled={!!props.disableEdit}>
              <div>
                <div className="flex items-center justify-between">
                  <p className={cn({ 'text-destructive': error })}>
                    Candidates
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
            <ScrollArea className="h-96">
              {error && <p className="text-md text-destructive">{error}</p>}
              {candidates.map(resolution => (
                <div
                  className="mb-4 flex items-center justify-between rounded-md border px-2 py-2"
                  key={resolution.value}
                >
                  <p className="ml-4">{resolution.value}</p>
                  {!props.disableEdit && (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setCandidates(prev =>
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
            maxChoiceCount={candidates.length !== 0 ? candidates.length : 1}
            defaultChoiceCount={choiceCount.current}
            handleSelect={value => {
              if (props.disableEdit) return;
              choiceCount.current = value;
            }}
            disableEdit={props.disableChoiceCountEdit}
          />
        </div>
        <SheetContent
          side="right"
          className="w-full max-w-full sm:w-3/4 sm:max-w-screen-md"
        >
          <div className="flex h-full w-full items-center justify-center">
            <TitleDescriptionForm
              onSubmit={({ title, description }) => {
                setCandidates(prevResolutions => [
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
      {props.children && !props.disableEdit ? (
        props.children
      ) : (
        <FormHandleButtons
          formSubmitLabel={props.formSubmitLabel}
          formCancelLabel={props.formCancelLabel}
          handleSubmitClick={() => {
            if (candidates.length === 0) {
              setError('Please add at least one resolution value');
              return;
            }
            setError(null);
            props.onSubmit?.({
              candidates: candidates,
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
