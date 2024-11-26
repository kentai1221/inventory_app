import {getTranslations} from 'next-intl/server';
import { Breadcrumb, Card,Button,
    Label,
    Select,
    TextInput,
    Textarea,
    ToggleSwitch, } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { HiHome,HiCloudUpload } from "react-icons/hi";
import { fetchTraineeById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { ChgImgBtn } from '@/app/ui/trainee/chgImgBtn';
import {CreateContactBtn} from '@/app/ui/trainee/addContactBtn';
import {DeleteGuardianBtn} from '@/app/ui/trainee/deleteGuardianBtn';
import { updateTrainee } from '@/app/lib/actions';

export default async function Page(
    props: { params: Promise<{ id: string }>, searchParams?: Promise<{done?:boolean;}> }
) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const i18n = await getTranslations('trainee');
    const id = params.id;
    const done = searchParams?.done || null;
    const [trainee] = await Promise.all([fetchTraineeById(id)]);

    if (!trainee) {
        notFound();
    }

    const updateTraineeWithId = updateTrainee.bind(null, id);

    return (
        <main>
        <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
            <div className="col-span-full mb-4 xl:mb-2">
                <Breadcrumb className="mb-5">
                    <Breadcrumb.Item>
                        <div className="flex items-center gap-x-3">
                        <HiHome className="text-xl" />
                        <Link href="/"><span className="dark:text-white">{i18n('main')}</span></Link>
                        </div>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item ><Link href="/trainee">{i18n('trainee')}</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{i18n('setting')}</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                    {i18n('trainee')} {i18n('setting')}
                </h1>
            </div>
            <div className="col-span-full mb-4 xl:col-auto xl:mb-0">
                <div className="grid grid-cols-1 gap-y-4">
                    <Card>
                        <div className="items-center sm:flex sm:space-x-4 xl:block xl:space-x-0 2xl:flex 2xl:space-x-4">
                        <Image
                            alt=""
                            height={170}
                            src={trainee.image?.url?`${process.env.BACKEND_URL}${trainee.image.url}`:`/user.png`}
                            width={170}
                            className="mb-4 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
                        />
                        <div>
                            <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                            {trainee.name_tc}
                            </h3>
                            <div className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                            {trainee.name_en}
                            </div>
                            <ChgImgBtn id={id} />
                        </div>
                        </div>
                    </Card>

                    {/* <Card>
                        <h3 className="mb-4 text-xl font-bold dark:text-white">
                            {i18n('data_import')}
                        </h3>
                        <div className="mb-4 grid grid-cols-1 gap-y-2">
                            <Label htmlFor="settings-language">{i18n('import_type')}</Label>
                            <Select id="settings-language" name="settings-language">
                                <option key="Option1">
                                Option1
                                </option>
                            </Select>
                        </div>
                        <div className="mb-6 grid grid-cols-1 gap-y-2">
                            <Label htmlFor="settings-timezone">{i18n('method')}</Label>
                            <Select id="settings-timezone" name="settings-timezone">
                            <option key="Option1">
                                Option1
                            </option>
                            </Select>
                        </div>
                        <div>
                            <div className="col-span-6 flex">
                                <Button>{i18n('import')}</Button>
                            </div>
                        </div>
                        </Card> */}

                        <Card>
                            <div className="flow-root">
                            <h3 className="text-xl mb-6 font-bold dark:text-white">{i18n('guardian')}</h3>
                            <ul className="mb-6 divide-y divide-gray-200 dark:divide-gray-700">
                            {trainee.guardians?.map((guardian:any) => (
                                <li key={guardian.id} className="pb-3 last:pb-3">
                                    <div className="flex justify-between xl:block 2xl:flex 2xl:space-x-4">
                                    <div className="flex space-x-4 xl:mb-4 2xl:mb-0">
                                    
                                        <div className="min-w-0 flex-1">
                                            <p className="mt-2 mb-2 truncate text-base font-semibold leading-none text-gray-900 dark:text-white">
                                                {/* {trainee.customer.name} */}{guardian.name}{` (${guardian.relationship})`}
                                            </p>
                                            <p className="mb-2 truncate text-sm font-normal text-primary-700 dark:text-primary-500">
                                                {/* {trainee.customer.name_en} */}{guardian.phone}
                                            </p>
                                        </div>
                                   
                                    </div>
                                    <div className="inline-flex w-auto items-center xl:w-full 2xl:w-auto">
                                        <DeleteGuardianBtn id={id} gid={guardian.documentId}/>
                                    </div>
                                    </div>
                                </li>
                            ))}
                            </ul>
                                <div className="col-span-6 flex">
                                <CreateContactBtn id={id} />
                                </div>
                            </div>
                        </Card>
                    {/* <LanguageTimeCard
                    languages={languages}
                    timezones={timezones}
                    userSettings={userSettings}
                    />
                    <SocialAccountsCard userSettings={userSettings} />
                    <OtherAccountsCard userSettings={userSettings} /> */}
                </div>
            </div>
            <div className="col-span-2 mb-5">
            <div className="grid grid-cols-1 gap-y-4">
            <Card>
                <h3 className="mb-4 text-xl font-bold dark:text-white">
                {i18n('info')}
                </h3>
                <form action={updateTraineeWithId}>
                <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="name_chi">{i18n('form_name_chi')}</Label>
                    <TextInput
                        id="name_chi"
                        name="name_chi"
                        defaultValue={trainee.name_tc}
                    />
                    </div>
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="name_en">{i18n('form_name_en')}</Label>
                    <TextInput
                        id="name_en"
                        name="name_en"
                        defaultValue={trainee.name_en}
                    />
                    </div>
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="hkid">{i18n('hkid')}</Label>
                    <TextInput
                        id="hkid"
                        name="hkid"
                        defaultValue={trainee.hkid}
                    />
                    </div>
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="gender">{i18n('gender')}</Label>
                    <Select id="gender" name="gender" defaultValue={trainee.gender} >
                        <option key={"M"} value='M'>{i18n('male')}</option>
                        <option key={"F"} value='F'>{i18n('female')}</option>
                    </Select>
                    </div>
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="address">{i18n('address')}</Label>
                    <TextInput
                        id="address"
                        name="address"
                        defaultValue={trainee.address}
                    />
                    </div>
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="email">{i18n('email')}</Label>
                    <TextInput
                        id="email"
                        name="email"
                        defaultValue={trainee.email}
                        type="email"
                    />
                    </div>
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="phone">{i18n('phone')}</Label>
                    <TextInput
                        id="phone"
                        name="phone"
                        defaultValue={trainee.phone}
                        type="tel"
                    />
                    </div>
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="birthday">{i18n('birthday')}</Label>
                    <TextInput
                        defaultValue={trainee.birth}
                        id="birthday"
                        name="birthday"
                        type="date"
                    />
                    </div>
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="join_date">{i18n('join_date')}</Label>
                    <TextInput
                        id="join_date"
                        name="join_date"
                        defaultValue={trainee.join_date}
                        type="date"
                    />
                    </div>
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="age">{i18n('age')}</Label>
                    <TextInput
                        id="age"
                        name="age"
                        defaultValue={trainee.age}
                    />
                    </div>
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="department">{i18n('trainee_no')}</Label>
                    <TextInput
                        id="trainee_no"
                        name="trainee_no"
                        defaultValue={trainee.trainee_no}
                    />
                    </div>
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="ehealth">{i18n('ehealth')}</Label>
                    <Select id="ehealth" name="ehealth" defaultValue={trainee.ehealth_applied || false} >
                        <option key={"T"} value='true' >{i18n('yes')}</option>
                        <option key={"F"} value='false'>{i18n('no')}</option>
                    </Select>
                    </div>
                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="intellectual_level">{i18n('intellectual_level')}</Label>
                    <TextInput
                        id="intellectual_level"
                        name="intellectual_level"
                        defaultValue={trainee.intellectual_level}
                    />
                    </div>

                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                    <Label htmlFor="diet_type">{i18n('diet_type')}</Label>
                    <TextInput
                        id="diet_type"
                        name="diet_type"
                        defaultValue={trainee.diet_type}
                    />
                    </div>

                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-6">
                    <Label htmlFor="diagnosis">{i18n('diagnosis')}</Label>
                    <Textarea
                        id="diagnosis"
                        name="diagnosis"
                        defaultValue={trainee.diagnosis}
                    />
                    </div>

                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-6">
                    <Label htmlFor="food_allergy">{i18n('food_allergy')}</Label>
                    <Textarea
                        id="food_allergy"
                        name="food_allergy"
                        defaultValue={trainee.food_allergy}
                    />
                    </div>

                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-6">
                    <Label htmlFor="drug_allergy">{i18n('drug_allergy')}</Label>
                    <Textarea
                        id="drug_allergy"
                        name="drug_allergy"
                        defaultValue={trainee.drug_allergy}
                    />
                    </div>

                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-6">
                    <Label htmlFor="surgery_record">{i18n('surgery_record')}</Label>
                    <Textarea
                        id="surgery_record"
                        name="surgery_record"
                        defaultValue={trainee.surgery_record}
                    />
                    </div>

                    <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-6">
                    <Label htmlFor="injection_record">{i18n('injection_record')}</Label>
                    <Textarea
                        id="injection_record"
                        name="injection_record"
                        defaultValue={trainee.injection_record}
                    />
                    </div>
                    {done?<div className='text-green-600 dark:text-green-400'>{i18n('success')}</div>:""}
                    <div className="col-span-6 flex">
                        <Button type="submit">{i18n('save')}</Button>
                    </div>
                    
                </div>
                </form>
            </Card>
            </div>
            </div>
            {/* <Form trainee={trainee} customers={customers} /> */}
        </div>
        </main>
    );
}