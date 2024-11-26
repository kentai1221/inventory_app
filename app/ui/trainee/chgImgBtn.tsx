"use client"
import { FileInput, Label, Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { modifyPhoto, FormState } from '@/app/lib/actions';
import {useTranslations} from 'next-intl';
import { useActionState } from 'react';

export  function ChgImgBtn({ id }: { id: string }) {
    const [errors, setErrors] = useState({
        img: false,
      });
    const i18n = useTranslations('trainee');
    const initialState: FormState = { message: null };
    const [state, formAction, isPending] = useActionState(modifyPhoto, initialState);
    
    return (
        <div id="fileUpload" className="max-w-md">
            <form action={formAction} className="inline-block">
                <TextInput
                    id="id"
                    name="id"
                    type="hidden"
                    defaultValue={id}
                />
                <FileInput id="file" name="file"  />
                <div className="mt-3 text-gray-400 text-sm">{i18n('tips')}</div>
                <Button className="mt-5" type="submit">
                    {i18n('chg_img')}
                </Button>
            </form>
            {state?.message=="failed" && <p className="mt-5 text-sm text-red-500">{i18n('err')}</p>}
        </div>
    );
  }
  