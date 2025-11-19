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

export default function Create({ payment, members = [] }: { payment: any, members: any, member_id: number | null }) {
        console.log(payment.type_of_payment, "PAYMENT");
        const typesOfPayments = ['Članarina', 'Donacija', 'Vakuf', 'Sergija', 'Ostalo'];
        const { data, setData, post } = useForm<Member>({
                id: payment.id,
                amount: payment.amount,
                type_of_payment: payment.type_of_payment,
                date_of_payment: payment.date_of_payment,
                note: payment.note,
                member_id: payment.member_id || 0,
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
                post('/payments/' + payment.id);
        }

        const convertDate = (dateString: string) => {
                const date = new Date(dateString);
               return date;
        }
        return (
                <AppLayout breadcrumbs={breadcrumbs}>
                        <Head title="Uplate" />
                        <ContentHolder>
                                <form className="grid grid-cols-1" onSubmit={handleSubmit}>
                                        <div className="flex w-full flex-col">
                                                <Label className="mb-3">Odaberite korisnika</Label>
                                                <Select onValueChange={handleSelectMember} defaultValue={data.member_id ? data.member_id.toString() : undefined}>
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
                                                <Select onValueChange={handleTypeOfPayment} defaultValue={data.type_of_payment}>
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
                                                        <DatePicker selected={convertDate(data.date_of_payment)} handleChange={(date: any) => handleChange('date_of_payment', date)} />
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