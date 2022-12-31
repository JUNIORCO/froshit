import { ReactNode } from 'react';
// form
import { FormProvider as Form, UseFormReturn } from 'react-hook-form';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
  id?: string;
};

export default function FormProvider({ children, onSubmit, methods, id }: Props) {
  return (
    <Form {...(id && { id })} {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
