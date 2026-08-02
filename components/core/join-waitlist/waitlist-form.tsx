'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft02Icon, ArrowRight02Icon, JoinBevelIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { JoinWaitlistInput, joinWaitlistSchema } from '@/lib/validators/waitlist';
import { Label } from '@/components/ui/label';
import { WAITLIST_SOURCES } from '@/lib/database/schema';
import { http } from '@/lib/http';
import { toast } from '@/components/ui/toast';
import { Spinner } from '@/components/ui/spinner';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

const steps = [
  {
    name: 'name' as const,
    title: "What's your name?",
    description: 'So we know what to call you.',
    type: 'text',
  },
  {
    name: 'email' as const,
    title: "What's your email?",
    description: "We'll only send important updates.",
    type: 'email',
  },
  {
    name: 'source' as const,
    title: 'How did you hear about us?',
    description: 'Help us understand where you found us.',
  },
];

export function WaitlistForm() {
  const waitlistForm = useForm<JoinWaitlistInput>({
    resolver: zodResolver(joinWaitlistSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      source: 'other',
    },
  });

  const {
    formState: { isSubmitting },
  } = waitlistForm;

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const current = useMemo(() => steps[step], [step]);
  const router = useRouter();

  async function next() {
    if (waitlistForm.formState.isSubmitting) return;
    const valid = await waitlistForm.trigger(current.name);
    if (!valid) return;
    setDirection(1);
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
      return;
    }
  }

  const onSubmit = async (values: JoinWaitlistInput) => {
    try {
      await http.post('/waitlist/join', values);

      toast.add({
        title: "You're on the waitlist!",
        description: "We'll notify you as soon as we launch.",
        type: 'success',
      });

      setDirection(1);
      setStep(0);
      waitlistForm.reset();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.error ?? 'Something went wrong. Please try again.')
          : 'Something went wrong. Please try again.';

      toast.add({
        title: 'Joining the waitlist failed',
        description: message,
        type: 'error',
      });
    }
  };

  function previous() {
    if (waitlistForm.formState.isSubmitting) return;
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    } else {
      router.push('/');
    }
  }

  const isLastStep = step === steps.length - 1;
  const submit = waitlistForm.handleSubmit(onSubmit);

  const variants = {
    enter: (direction: 1 | -1) => ({
      x: direction === 1 ? 24 : -24,
      opacity: 0,
      filter: 'blur(2px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
    exit: (direction: 1 | -1) => ({
      x: direction === 1 ? -24 : 24,
      opacity: 0,
      filter: 'blur(2px)',
    }),
  };

  return (
    <form
      onKeyDown={(e) => {
        if (e.key !== 'Enter') return;

        if (!isLastStep) {
          e.preventDefault();
          void next();
        }
      }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current.name}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="space-y-8 min-h-72 mb-8"
        >
          {current.name === 'name' && (
            <Controller
              control={waitlistForm.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-base">{current.title}</FieldLabel>

                  <Input
                    {...field}
                    type={current.type}
                    aria-invalid={fieldState.invalid}
                    autoFocus
                    placeholder={current.description}
                    className="h-11 placeholder:text-sm/relaxed text-base"
                  />

                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}

          {current.name === 'email' && (
            <Controller
              control={waitlistForm.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-base">{current.title}</FieldLabel>

                  <Input
                    {...field}
                    autoFocus
                    type={current.type}
                    aria-invalid={fieldState.invalid}
                    placeholder={current.description}
                    className="h-11 placeholder:text-sm/relaxed text-base"
                  />

                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}

          {current.name === 'source' && (
            <Controller
              control={waitlistForm.control}
              name="source"
              render={({ field }) => (
                <>
                  <FieldLabel className="text-base">{current.title}</FieldLabel>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid md:grid-cols-2 gap-2"
                  >
                    {WAITLIST_SOURCES.map((source) => (
                      <Label
                        key={source}
                        className={cn(
                          'flex cursor-pointer items-center gap-2 border p-3 transition-colors bg-background',
                          field.value === source
                            ? 'border-brand bg-brand/20'
                            : 'border-border hover:bg-muted/60'
                        )}
                      >
                        <RadioGroupItem value={source} />

                        <span className="text-sm capitalize font-medium">{source}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </>
              )}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-end gap-4">
        <Button key={'previous'} variant="secondary" onClick={previous} disabled={isSubmitting}>
          <HugeiconsIcon icon={ArrowLeft02Icon} size={18} strokeWidth={1.5} />
          Back
        </Button>

        <Button
          key={'next-and-submit'}
          type={'button'}
          onClick={() => {
            if (!isLastStep) {
              void next();
            } else {
              void submit();
            }
          }}
          disabled={isSubmitting}
          className={isLastStep ? 'font-space-grotesk-heading' : 'font-inter'}
        >
          {isLastStep ? 'Join The Waitlist' : 'Continue'}

          {isSubmitting ? (
            <Spinner />
          ) : (
            <HugeiconsIcon
              icon={isLastStep ? JoinBevelIcon : ArrowRight02Icon}
              size={18}
              className={isLastStep ? 'fill-brand text-brand' : ''}
              strokeWidth={1.5}
            />
          )}
        </Button>
      </div>
    </form>
  );
}
