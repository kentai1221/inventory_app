import {getTranslations} from 'next-intl/server';
import Search from '@/app/ui/search';
import Link from "next/link";
import { Label, Radio } from "flowbite-react";
import Image from "next/image";

export default async function Page() {

  const i18n = await getTranslations('trainee');

  return (
    <>
      <div className="bg-white p-4 dark:bg-gray-800 text-black-500 dark:text-gray-100">
        <div className="w-full max-w-[1000px] mx-auto">
          <p className="mb-3 text-center">健康支援計劃成效研究 [學員用]</p>
          <p className="mb-10 text-center">[參與健康支援計劃12星期後 / 完成健康支援計劃後 / 完成健康支援計劃6個月後]</p>
          <p className="mb-5 font-bold">A1. 對健康飲食習慣的認識</p>
          <fieldset className="flex flex-col gap-4 mb-10">
            <legend className="mb-8">1. 你知道衛生署建議成年人每天應吃多少份水果嗎？</legend>
            <div className="flex flex-row items-center gap-4 w-full justify-between">
                <Label className="min-w-[150px]" htmlFor="q1a">
                <div className="flex flex-col items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                        <Radio id="q1a" name="q1" value="1" />
                        1 份
                    </div>
                </div>
                </Label>

                <Label className="min-w-[150px]" htmlFor="q1b">
                <div className="flex flex-col items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                        <Radio id="q1b" name="q1" value="2" />
                        2 份
                    </div>
                </div>
                </Label>

                <Label className="min-w-[150px]" htmlFor="q1c">
                <div className="flex flex-col items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                        <Radio id="q1c" name="q1" value="3" />
                        3 份
                    </div>
                </div>
                </Label>

                <Label className="min-w-[150px]" htmlFor="q1d">
                <div className="flex flex-col items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                        <Radio id="q1d" name="q1" value="4" />
                        4 份
                    </div>
                </div>
                </Label>

                <Label className="min-w-[150px]" htmlFor="q1e">
                <div className="flex flex-col items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                        <Radio id="q1e" name="q1" value="5" />
                        不知道
                    </div>
                </div>
                </Label>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4 mb-10">
            <legend className="mb-8">2. 你可以從下圖選出1份水果的適當份量嗎？</legend>
            <div className="flex flex-row items-center gap-4 w-full justify-between">
                <Label className="min-w-[150px]" htmlFor="q2a">
                    <div className="flex flex-col items-center gap-4 justify-between">
                        <Image
                            alt=""
                            height={50}
                            src="/assessment/1.png"
                            width={50}
                            className="ml-2 mb-4 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
                        />
                    </div>
                </Label>

                <Label className="min-w-[150px]" htmlFor="q2b">
                    <div className="flex flex-col items-center gap-4 justify-between">
                        <Image
                            alt=""
                            height={50}
                            src="/assessment/1.png"
                            width={50}
                            className="ml-2 mb-4 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
                        />
                    </div>
                </Label>

                <Label className="min-w-[150px]" htmlFor="q2c">
                    <div className="flex flex-col items-center gap-4 justify-between">
                        <Image
                            alt=""
                            height={50}
                            src="/assessment/3.png"
                            width={100}
                            className="ml-2 mb-4 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
                        />
                    </div>
                </Label>

                <Label className="min-w-[150px]" htmlFor="q2d">
                    <div className="flex flex-col items-center gap-4 justify-between">
                        <Image
                            alt=""
                            height={50}
                            src="/assessment/1.png"
                            width={50}
                            className="ml-2 mb-4 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
                        />
                    </div>
                </Label>

                <Label className="min-w-[150px]" htmlFor="q2e">
                    <div className="flex flex-col items-center gap-4 justify-between">
                    </div>
                </Label>
            </div>
            <div className="flex flex-row items-center gap-4 w-full justify-between">
                <Label className="min-w-[150px]" htmlFor="q2a">
                <div className="flex flex-col items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                        <Radio id="q2a" name="q2" value="apple" />
                        中型蘋果1個
                    </div>
                </div>
                </Label>

                <Label className="min-w-[150px]" htmlFor="q2b">
                <div className="flex flex-col items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                        <Radio id="q2b" name="q2" value="apple" />
                        香蕉1條
                    </div>
                </div>
                </Label>

                <Label className="min-w-[150px]" htmlFor="q2c">
                <div className="flex flex-col items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                        <Radio id="q2c" name="q2" value="apple" />
                        中型橙1個半
                    </div>
                </div>
                </Label>

                <Label className="min-w-[150px]" htmlFor="q2d">
                <div className="flex flex-col items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                        <Radio id="q2d" name="q2" value="apple" />
                        香蕉2條
                    </div>
                </div>
                </Label>

                <Label className="min-w-[150px]" htmlFor="q2e">
                <div className="flex flex-col items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                        <Radio id="q2e" name="q2" value="apple" />
                        不知道
                    </div>
                </div>
                </Label>
              
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
  
  
}