import AppLayout from '@/layouts/app-layout';
import { FamilyMember, type BreadcrumbItem, type Member } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

import ContentHolder from "@/components/content-holder";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { DatePicker } from '@/components/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
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
                title: 'Dodaj člana',
                href: '/members/create',
        }
];

export default function Create({ members = [], memberId }: { members: any, memberId: number | null }) {
        console.log(memberId, "MEMBERS");
        const typesOfPayments = ['Članarina', 'Donacija', 'Vakuf', 'Sergija', 'Ostalo'];
        const { data, setData, post } = useForm<Member>({
                id: 0,
                amount: '0',
                type_of_payment: '',
                date_of_payment: '',
                note:'',
                member_id: memberId ? memberId : 0,
        })

        const handleChange = (name: string, value: string): void => {
                setData(name, value)
        }



        const handleSelectMember = (value: string) => {

                const member = members.find(m => m.id.toString() === value)

                if (member) {
                        handleChange('member_id', member.id);
                }
        }

        const handleTypeOfPayment = (value: string) => {
                handleChange('type_of_payment', value);
        }

        const handleSubmit = (e) => {
                e.preventDefault();
                post('/payments');
        }
        return (
                <AppLayout breadcrumbs={breadcrumbs}>
                        <Head title="Uplate" />
                        <ContentHolder>
                                <form className="grid grid-cols-1" onSubmit={handleSubmit}>
                                        <div className="flex w-full flex-col">
                                                <Label className="mb-3">Odaberite korisnika</Label>
                                                <Select onValueChange={handleSelectMember} defaultValue={memberId ? memberId.toString() : undefined}>
                                                        <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder="Odaberite korisnika" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                {
                                                                        members.map((member, index) => {
                                                                                return (
                                                                                        <SelectItem key={index} value={member.id.toString()}>{member.first_name} {member.last_name}</SelectItem>
                                                                                )
                                                                        })
                                                                }
                                                        </SelectContent>
                                                </Select>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3 gap-y-4">
                                                <div className="flex flex-col gap-2">
                                                        <Label htmlFor='amount'>
                                                                Iznos (u KM)
                                                        </Label>
                                                        <Input type="number" name="amount" id="amount" placeholder='123.30' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.amount} step="0.1"/>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                        <Label className="">Vrsta uplate</Label>
                                                <Select onValueChange={handleTypeOfPayment}>
                                                        <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder="Odaberite vrstu uplate" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                {
                                                                        typesOfPayments.map((type, index) => {
                                                                                return (
                                                                                        <SelectItem key={index} value={type}>{type}</SelectItem>
                                                                                )
                                                                        })
                                                                }
                                                        </SelectContent>
                                                </Select>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                        <Label htmlFor='birthdate'>
                                                                Datum uplate
                                                        </Label>
                                                        <DatePicker handleChange={(date: any) => handleChange('date_of_payment', date)} />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                        <Label htmlFor='note'>
                                                                Bilješka
                                                        </Label>
                                                        <Input type="text" name="note" id="note" placeholder='npr. Uplatio putem bankovne transakcije' onChange={(e) => handleChange(e.target.name, e.target.value)} value={data.note}/>
                                                </div>
                                        </div>
                                        
                                        <div className="flex justify-end">
                                                <Button type='submit'>
                                                        Dodajte članarinu
                                                </Button>
                                        </div>
                                </form>
                        </ContentHolder>
                </AppLayout>
        )
}