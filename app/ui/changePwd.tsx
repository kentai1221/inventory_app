'use client';

import { useRouter } from 'next/navigation';
import {useTranslations} from 'next-intl';
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useActionState } from 'react';
import { changePwd, FormState  } from '@/app/lib/actions';
import { HiMail,HiKey,HiOutlineArrowRight,HiExclamationCircle } from "react-icons/hi";

export default function ChangePwd() {
  const router = useRouter()
  const yearOption = [];
  const i18n = useTranslations('settings');
  const initialState: FormState = { message: null };
  const [state, formAction, isPending] = useActionState(changePwd, initialState);

  return (
    <>
      <Card
        horizontal
        className="w-full md:max-w-screen-lg m-5"
        theme={{
          root: {
            children: "my-auto w-full gap-0",
          },
          img: {
            horizontal: {
              on: "hidden w-2/3 rounded-l-lg md:w-96 md:p-0 lg:block",
            },
          },
        }}
      >
        <div className="p-8">
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            {i18n('changePwd')}
          </span>
    
          <form action={formAction} className="mt-8 space-y-6">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="password1" className="text-lg mb-2">{i18n('old_password')}</Label>
              <TextInput
                id="password1"
                name="password1"
                type="password"
                sizing="lg" 
                icon={HiKey}
                required shadow
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="password2" className="text-lg mb-2">{i18n('new_password')}</Label>
              <TextInput
                id="password2"
                name="password2"
                type="password"
                placeholder={i18n('tips')}
                sizing="lg" 
                icon={HiKey}
                required shadow
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="password3" className="text-lg mb-2">{i18n('confirm_password')}</Label>
              <TextInput
                id="password3"
                name="password3"
                type="password"
                placeholder={i18n('tips')}
                sizing="lg" 
                icon={HiKey}
                required shadow
              />
            </div>
            <div className="mb-6 flex justify-end">
              <Button
                size="lg"
                type="submit"
                className="w-full px-0 py-px sm:w-auto"
                isProcessing={isPending}
              >
                {i18n('edit')}
              </Button>
            </div>
            {state?.message=='success' && (
            <div className="text-green-700 mb-6 flex justify dark:text-green-400">
              {i18n('done')}
            </div>
            )}
            {state?.message=='fail' && (
            <div className="text-red-700 mb-6 flex justify dark:text-red-400">
              {i18n('fail')}
            </div>
            )}
          </form>
        </div>
      </Card>
    </>
  );
}
