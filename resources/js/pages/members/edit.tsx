import AppLayout from '@/layouts/app-layout';
import { FamilyMember, type BreadcrumbItem, type Member } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

import ContentHolder from "@/components/content-holder";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon } from 'lucide-react';
import { DatePicker } from '@/components/date-picker';
import MemberAutocomplete from '@/components/member-autocomplete';
import { useMemo, useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const breadcrumbs: BreadcrumbItem[] = [
        {
                title: 'Početna stranica',
                href: '/dashboard',
        },
        {
                title: 'Članovi',
                href: '/members',
        },
        {
                title: 'Uredi člana',
                href: '/members',
        }
];

export default function Edit({ member, users }: { member:any, users: any }) {
        const userOptions = useMemo(
                () =>
                        users.map((u: any) => ({
                                id: u.id,
                                name: u.name || u.email || `Korisnik #${u.id}`,
                                email: u.email,
                        })),
                [users]
        );
        const { data, setData, post } = useForm<Member>({
                id: 0,
                first_name: member.first_name || "",
                last_name: member.last_name || "",
                title: member.title || "",
                fathers_name: member.fathers_name || "",
                profile_image: null as File | null,
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
        })

        const handleChange = (name: string, value: string): void => {
                setData(name, value)
        }


        const addFamilyMember = (e) => {
                e.preventDefault();
                setData({
                        ...data,
                        family_members: [
                                ...data.family_members,
                                { first_name: "", last_name: "", birthdate: "", email: "", phone: "", address: "", relation: "" },
                        ],
                });
        }

        const changeFamilyMember = (name: keyof FamilyMember, value: string, index: number): void => {
                setData(
                        "family_members",
                        data.family_members.map((member, i) => {
                                if (i === index) {
                                        return {
                                                ...member,
                                                [name]: value,
                                        };
                                }
                                return member;
                        })
                );
        };

        const removeFamilyMember = (index: number) => {
                setData(
                        "family_members",
                        data.family_members.filter((_, i) => i !== index)
                );
        };

        const handleSelectUser = (value: number | null) => {
                const user = users.find((u: any) => u.id === value);

                if (user) {
                        handleChange('user_id', user.id as any);
                        handleChange('first_name', user.name);
                        handleChange('email', user.email);
                } else {
                        handleChange('user_id', null as any);
                }
        };

        const [previewUrl, setPreviewUrl] = useState<string | null>(member.profile_image_url || null);
        const objectUrlRef = useRef<string | null>(null);

        const setPreviewFromFile = (file: File | null) => {
                if (objectUrlRef.current) {
                        URL.revokeObjectURL(objectUrlRef.current);
                        objectUrlRef.current = null;
                }
                if (file) {
                        const url = URL.createObjectURL(file);
                        objectUrlRef.current = url;
                        setPreviewUrl(url);
                } else {
                        setPreviewUrl(member.profile_image_url || null);
                }
        };

        useEffect(() => {
                return () => {
                        if (objectUrlRef.current) {
                                URL.revokeObjectURL(objectUrlRef.current);
                        }
                };
        }, []);

        const handleSubmit = (e) => {
                e.preventDefault();
                post('/members/' + member.id, {
                        forceFormData: true,
                });
        }

        const convertDate = (dateString: string) => {
                if (!dateString) return undefined as any;
                return new Date(dateString);
        };
        return (
                <AppLayout breadcrumbs={breadcrumbs}>
                        <Head title="Članovi" />
                        <ContentHolder>
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Uredi člana</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="flex justify-end">
                                                        <Button asChild className="w-full sm:w-auto">
                                                                <Link href={route('payments.create', member.id)}>
                                                                        <PlusIcon className="w-4 h-4 mr-2" />
                                                                        Dodajte uplatu
                                                                </Link>
                                                        </Button>
                                                </div>
                                                <form className="mt-5 grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
                                        <div className="mb-6 flex flex-col items-center gap-3">
                                                <div className="h-24 w-24 overflow-hidden rounded-full border bg-muted">
                                                        {previewUrl ? (
                                                                <img src={previewUrl} alt="Profilna slika" className="h-full w-full object-cover" />
                                                        ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                                        Nema slike
                                                                </div>
                                                        )}
                                                </div>
                                                <Input
                                                        type="file"
                                                        name="profile_image"
                                                        id="profile_image"
                                                        accept="image/*"
                                                        className="w-full max-w-xs cursor-pointer text-center"
                                                        onChange={(e) => {
                                                                const file = e.target.files?.[0] ?? null;
                                                                setData('profile_image' as any, file);
                                                                setPreviewFromFile(file);
                                                        }}
                                                />
                                        </div>
                                        <div className="flex w-full flex-col">
                                                <Label className="mb-3">Odaberite korisnika</Label>
                                                <MemberAutocomplete
                                                        members={userOptions}
                                                        value={data.user_id || null}
                                                        onChange={handleSelectUser}
                                                        placeholder="Počnite kucati ime korisnika"
                                                />
                                        </div>
                                        <hr className='my-5' />
                                        <h3 className='font-bold text-lg sm:text-xl'>Osnovne informacije o članu</h3>
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
                                                        <Label htmlFor='fathers_name'>
                                                                Ime oca
                                                        </Label>
                                                        <Input type="text" name="fathers_name" id="fathers_name" placeholder='npr. Ahmet' onChange={(e) => handleChange(e.target.name, e.target.value)} value={(data as any).fathers_name || ""} />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                        <Label htmlFor='title'>
                                                                Titula
                                                        </Label>
                                                        <Input type="text" name="title" id="title" placeholder='npr. dr., mr., ing.' onChange={(e) => handleChange(e.target.name, e.target.value)} value={(data as any).title || ""} />
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
                                                        <Input type="text" name="email" id="email" placeholder='npr. osman.ljubinac@gmail.com' onChange={(e) => handleChange(e.target.name, e.target.value)}  value={data.email}/>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                        <Label htmlFor='phone'>
                                                                Telefon
                                                        </Label>
                                                        <Input type="text" name="phone" id="phone" placeholder='npr. +387 61 123 456' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.phone}/>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                        <Label htmlFor='address'>
                                                                Adresa
                                                        </Label>
                                                        <Input type="text" name="address" id="address" placeholder='npr. Gornja mahala 54' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.address}/>
                                                </div>
                                        </div>
                                        <hr className='my-5' />
                                        <h3 className='font-bold text-lg sm:text-xl'>Ukoliko član živi u inostranstvu</h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3 gap-y-4">
                                                <div className="flex flex-col gap-2">
                                                        <Label htmlFor='address_abroad'>
                                                                Adresa u inostranstvu
                                                        </Label>
                                                        <Input type="text" name="address_abroad" id="address_abroad" placeholder='npr. Friedrichstrasse n.45' onChange={(e) => handleChange(e.target.name, e.target.value)}  value={data.address_abroad}/>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                        <Label htmlFor='city_abroad'>
                                                                Grad u inostranstvu
                                                        </Label>
                                                        <Input type="text" name="city_abroad" id="city_abroad" placeholder='npr. Iserlohn' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.city_abroad}/>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                        <Label htmlFor='country'>
                                                                Država
                                                        </Label>
                                                        <Input type="text" name="country" id="country" placeholder='npr. Njemačka' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.country}/>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                        <Label htmlFor='phone_abroad'>
                                                                Telefon
                                                        </Label>
                                                        <Input type="text" name="phone_abroad" id="phone_abroad" placeholder='npr. +45 12 345 6789' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.phone_abroad}/>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                        <Label htmlFor='email_abroad'>
                                                                Email
                                                        </Label>
                                                        <Input type="text" name="email_abroad" id="email_abroad" placeholder='npr. osman@click.de' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.email_abroad}/>
                                                </div>
                                        </div>

                                        <hr className='my-5' />
                                        <h3 className='font-bold text-lg sm:text-xl'>Ukoliko član ima više članova u porodici</h3>
                                        <div className="flex justify-end">
                                                <Button className="w-full sm:w-auto" variant="secondary" onClick={(e) => addFamilyMember(e)}>
                                                        <PlusIcon className="w-4 h-4 mr-2" />
                                                        Dodaj člana porodice
                                                </Button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-x-3 gap-y-4">
                                                {data.family_members.map((member, index) => (
                                                        <div key={index} className="grid grid-cols-1 gap-x-3 gap-y-4 rounded-md border p-3 lg:grid-cols-3">
                                                                <div className="col-span-full flex items-center justify-between gap-2">
                                                                        <div className="text-sm font-semibold text-muted-foreground">
                                                                                Član porodice #{index + 1}
                                                                        </div>
                                                                        <Button
                                                                                type="button"
                                                                                size="sm"
                                                                                variant="destructive"
                                                                                onClick={() => removeFamilyMember(index)}
                                                                        >
                                                                                Ukloni
                                                                        </Button>
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                        <Label htmlFor='first_name'>
                                                                                Ime
                                                                        </Label>
                                                                        <Input type="text" name="first_name" id="" placeholder='npr. Osman' onChange={(e) => changeFamilyMember(e.target.name as keyof FamilyMember, e.target.value, index)} value={member.first_name || ''}/>
                                                                </div>

                                                                <div className="flex flex-col gap-2">
                                                                        <Label htmlFor='last_name'>
                                                                                Prezime
                                                                        </Label>
                                                                        <Input type="text" name="last_name" id="" placeholder='npr. Ljubinac' onChange={(e) => changeFamilyMember(e.target.name as keyof FamilyMember, e.target.value, index)} value={member.last_name || ''}/>
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                        <Label>Odnos</Label>
                                                                        <Select
                                                                                value={member.relation || ""}
                                                                                onValueChange={(val) => changeFamilyMember('relation', val, index)}
                                                                        >
                                                                                <SelectTrigger>
                                                                                        <SelectValue placeholder="Odaberite odnos" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                        <SelectItem value="otac">Otac</SelectItem>
                                                                                        <SelectItem value="majka">Majka</SelectItem>
                                                                                        <SelectItem value="sin">Sin</SelectItem>
                                                                                        <SelectItem value="kćerka">Kćerka</SelectItem>
                                                                                        <SelectItem value="supruga">Supruga</SelectItem>
                                                                                        <SelectItem value="punac">Punac</SelectItem>
                                                                                        <SelectItem value="punica">Punica</SelectItem>
                                                                                        <SelectItem value="druga rodbina">Druga rodbina</SelectItem>
                                                                                </SelectContent>
                                                                        </Select>
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                        <Label htmlFor='birthdate'>
                                                                                Datum rođenja
                                                                        </Label>
                                                                        <DatePicker handleChange={(date: any) => changeFamilyMember('birthdate', date, index)} />
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                        <Label htmlFor='email'>
                                                                                Email
                                                                        </Label>
                                                                        <Input type="text" name="email" id="" placeholder='npr. osman.ljubinac@gmail.com' onChange={(e) => changeFamilyMember(e.target.name as keyof FamilyMember, e.target.value, index)} value={member.email || ''}/>
                                                                </div>

                                                                <div className="flex flex-col gap-2">
                                                                        <Label htmlFor='phone'>
                                                                                Telefon
                                                                        </Label>
                                                                        <Input type="text" name="phone" id="" placeholder='npr. +387 61 123 456' onChange={(e) => changeFamilyMember(e.target.name as keyof FamilyMember, e.target.value, index)} value={member.phone || ''}/>
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                        <Label htmlFor='address'>
                                                                                Adresa
                                                                        </Label>
                                                                        <Input type="text" name="address" id="" placeholder='npr. Gornja mahala 54' onChange={(e) => changeFamilyMember(e.target.name as keyof FamilyMember, e.target.value, index)} value={member.address || ''}/>
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>
                                        <hr className='my-5' />
                                        <div className="flex justify-end">
                                                <Button type='submit' className="w-full sm:w-auto">
                                                        Spremite info o članu
                                                </Button>
                                        </div>
                                                </form>
                                        </CardContent>
                                </Card>
                        </ContentHolder>
                </AppLayout>
        )
}
