"use client"
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import {DarkThemeToggle,Navbar,Tooltip} from "flowbite-react";
import { HiMail,HiKey,HiOutlineArrowRight,HiExclamationCircle } from "react-icons/hi";
import {useTranslations} from 'next-intl';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import LanguageDropdown from "@/app/ui/languageDropdown";

export default function LoginPage() {
  
  const [errorMessage, formAction, isPending] = useActionState(authenticate,undefined);
  const i18n = useTranslations('navBar');

  return (
    <>
    <div className="w-full mx-auto flex flex-col items-center justify-center px-6 pt-28 md:h-screen lg:pt-0">
      <Card
        horizontal
        className="w-full md:max-w-screen-lg"
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
        <Navbar
          fluid
          className="top-0 z-30 rounded-t-lg w-full border-b border-gray-200 bg-white p-0 sm:p-0 dark:border-gray-700 dark:bg-gray-800"
          >
          <div className="w-full p-8">
            <div className="flex justify-between">
              <div className="flex">
                <Navbar.Brand as={Link} href="/login" className="mr-14">
                <div className="md:flex items-center">
                  <Image
                    className='flex items-center pr-5 pb-5 md:pb-0 dark:hidden'
                    alt=""
                    src="/PolyU-Logo.png"
                    width={300}
                    height={150}
                  />
                  <Image
                    className='items-center pr-5 pb-5 md:pb-0 hidden dark:flex'
                    alt=""
                    src="/PolyU-Logo_w.png"
                    width={300}
                    height={150}
                  />
                </div>

                </Navbar.Brand>
              </div>
              <div className="flex lg:gap-3 items-baseline">
                <div className="flex items-center">
                  <LanguageDropdown />
                  <div className="hidden dark:block">
                    <Tooltip content={i18n('light_mode')} className="text-white">
                      <DarkThemeToggle />
                    </Tooltip>
                  </div>
                  <div className="dark:hidden">
                    <Tooltip content={i18n('dark_mode')}>
                      <DarkThemeToggle />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Navbar>

        <div className="p-8">
          <span className="lg:hidden self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            {i18n('title_mobile')}
          </span>
          <span className="hidden lg:block self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            {i18n('title')}
          </span>

          <form action={formAction} className="mt-8 space-y-6">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="email" className="text-lg mb-2">{i18n('login_email')}</Label>
              <TextInput
                id="email"
                name="email"
                placeholder={i18n('login_email_ph')}
                type="email"
                sizing="lg" 
                icon={HiMail}
                required shadow
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="password" className="text-lg mb-2">{i18n('login_password')}</Label>
              <TextInput
                id="password"
                name="password"
                placeholder={i18n('login_password_ph')}
                type="password"
                sizing="lg" 
                icon={HiKey}
                required shadow
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <Checkbox id="rememberMe" name="rememberMe" />
                <Label htmlFor="rememberMe">{i18n('login_remember_me')}</Label>
              </div>
              <Link
                href="#"
                className="text-right text-sm text-primary-700 hover:underline dark:text-primary-500"
              >
                {i18n('login_forgot_pw')}
              </Link>
            </div>
            <div className="mb-6 flex justify-end">
              <Button
                size="lg"
                type="submit"
                className="w-full px-0 py-px sm:w-auto"
                isProcessing={isPending}
              >
                {i18n('login_button')}
                <HiOutlineArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            {errorMessage && (
            <div className="mb-6 flex justify">
              <HiExclamationCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-500">{errorMessage && errorMessage=="Invalid credentials."?i18n('login_error'):i18n('login_bug')}</p>
              </div>
            )}
          </form>
        </div>
      </Card>
    </div>
    </>
  );
}
