import AppLayout from '@/layouts/app-layout';
import { FamilyMember, type BreadcrumbItem, type Member } from '@/types';
import { Head, useForm } from '@inertiajs/react';

import ContentHolder from '@/components/content-holder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { DatePicker } from '@/components/date-picker';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Početna stranica',
        href: '/dashboard',
    },
    {
        title: 'Moj profil člana',
        href: '/my-membership',
    }
];

export default function MyProfile({ member }: { member: any }) {
    const { data, setData, post } = useForm<Member>({
        id: member.id || 0,
        first_name: member.first_name || "",
        last_name: member.last_name || "",
        birthdate: member.birthdate || "",
        email: member.email || "",
        phone: member.phone || "",
        address: member.address || "",
        family_members: member.family_members || [],
        email_abroad: member.email_abroad || "",
        phone_abroad: member.phone_abroad || "",
        address_abroad: member.address_abroad || "",
        city_abroad: member.city_abroad || "",
        country: member.country || "",
        user_id: member.user_id || null,
    });

    const handleChange = (name: string, value: any): void => {
        setData(name, value);
    };

    const addFamilyMember = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setData({ ...data, family_members: [...data.family_members, { first_name: "", last_name: "", birthdate: "" }] });
    };

    const changeFamilyMember = (name: keyof FamilyMember, value: string, index: number): void => {
        setData("family_members", data.family_members.map((familyMember, i) => {
            if (i === index) {
                return {
                    ...familyMember,
                    [name]: value,
                };
            }
            return familyMember;
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('members.self.update'));
    };

    const convertDate = (dateString?: string) => {
        if (!dateString) return undefined;
        const parsed = new Date(dateString);
        return isNaN(parsed.getTime()) ? undefined : parsed;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Moj profil člana" />
            <ContentHolder>
                <form className="grid grid-cols-1" onSubmit={handleSubmit}>
                    <h3 className='font-bold text-xl mb-4'>Osnovne informacije o članu</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3 gap-y-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor='first_name'>
                                Ime
                            </Label>
                            <Input type="text" name="first_name" id="first_name" placeholder='npr. Osman' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.first_name} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor='last_name'>
                                Prezime
                            </Label>
                            <Input type="text" name="last_name" id="last_name" placeholder='npr. Ljubinac' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.last_name} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor='birthdate'>
                                Datum rođenja
                            </Label>
                            <DatePicker selected={convertDate(data.birthdate)} handleChange={(date: any) => handleChange('birthdate', date)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor='email'>
                                Email
                            </Label>
                            <Input type="text" name="email" id="email" placeholder='npr. osman.ljubinac@gmail.com' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.email} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor='phone'>
                                Telefon
                            </Label>
                            <Input type="text" name="phone" id="phone" placeholder='npr. +387 61 123 456' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.phone} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor='address'>
                                Adresa
                            </Label>
                            <Input type="text" name="address" id="address" placeholder='npr. Gornja mahala 54' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.address} />
                        </div>
                    </div>
                    <hr className='my-5' />
                    <h3 className='font-bold text-xl'>Ukoliko član živi u inostranstvu</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3 gap-y-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor='address_abroad'>
                                Adresa u inostranstvu
                            </Label>
                            <Input type="text" name="address_abroad" id="address_abroad" placeholder='npr. Friedrichstrasse n.45' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.address_abroad} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor='city_abroad'>
                                Grad u inostranstvu
                            </Label>
                            <Input type="text" name="city_abroad" id="city_abroad" placeholder='npr. Iserlohn' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.city_abroad} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor='country'>
                                Država
                            </Label>
                            <Input type="text" name="country" id="country" placeholder='npr. Njemačka' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.country} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor='phone_abroad'>
                                Telefon
                            </Label>
                            <Input type="text" name="phone_abroad" id="phone_abroad" placeholder='npr. +45 12 345 6789' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.phone_abroad} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor='email_abroad'>
                                Email
                            </Label>
                            <Input type="text" name="email_abroad" id="email_abroad" placeholder='npr. osman@click.de' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.email_abroad} />
                        </div>
                    </div>

                    <hr className='my-5' />
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className='font-bold text-xl'>Ukoliko član ima više članova u porodici</h3>
                            <Button variant="secondary" onClick={addFamilyMember}>
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Dodaj člana porodice
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-x-3 gap-y-4">
                            {data.family_members.map((familyMember, index) => (
                                <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-x-3 gap-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor='first_name'>
                                            Ime
                                        </Label>
                                        <Input type="text" name="first_name" placeholder='npr. Osman' onChange={(e) => changeFamilyMember(e.target.name as keyof FamilyMember, e.target.value, index)} value={familyMember.first_name} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor='last_name'>
                                            Prezime
                                        </Label>
                                        <Input type="text" name="last_name" placeholder='npr. Ljubinac' onChange={(e) => changeFamilyMember(e.target.name as keyof FamilyMember, e.target.value, index)} value={familyMember.last_name} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor='birthdate'>
                                            Datum rođenja
                                        </Label>
                                        <DatePicker selected={convertDate(familyMember.birthdate)} handleChange={(date: any) => changeFamilyMember('birthdate', date, index)} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor='email'>
                                            Email
                                        </Label>
                                        <Input type="text" name="email" placeholder='npr. osman.ljubinac@gmail.com' onChange={(e) => changeFamilyMember(e.target.name as keyof FamilyMember, e.target.value, index)} value={familyMember.email} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor='phone'>
                                            Telefon
                                        </Label>
                                        <Input type="text" name="phone" placeholder='npr. +387 61 123 456' onChange={(e) => changeFamilyMember(e.target.name as keyof FamilyMember, e.target.value, index)} value={familyMember.phone} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor='address'>
                                            Adresa
                                        </Label>
                                        <Input type="text" name="address" placeholder='npr. Gornja mahala 54' onChange={(e) => changeFamilyMember(e.target.name as keyof FamilyMember, e.target.value, index)} value={familyMember.address} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <hr className='my-5' />
                    <div className="flex justify-end">
                        <Button type='submit'>
                            Spremite info o članu
                        </Button>
                    </div>
                </form>
            </ContentHolder>
        </AppLayout>
    );
}
