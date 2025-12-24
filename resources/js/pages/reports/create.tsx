import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { ReportForm, type ReportFormData } from './report-form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Zapisnici', href: '/reports' },
    { title: 'Novi zapisnik', href: '/reports/create' },
];

export default function CreateReport() {
    const { data, setData, post, processing, errors } = useForm<ReportFormData>({
        protocol_number: '',
        meeting_datetime: '',
        location: '',
        recorder: '',
        verifier_one: '',
        verifier_two: '',
        chairperson: '',
        board_members: '',
        attendees_count: null,
        quorum_note: '',
        agenda: [''],
        digital_votes: '',
        urgent_consultations: '',
        discussion: '',
        decisions: [{ title: '', description: '', votes_for: null, votes_against: null, votes_abstained: null, voting_method: '' }],
        ended_at: '',
        attendance_notes: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('reports.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Novi zapisnik" />
            <ContentHolder>
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Novi zapisnik</h1>
                    <p className="text-sm text-muted-foreground">Popunite zapisnik sa sjednice džemata Donja Ljubija.</p>
                </div>
                <ReportForm
                    data={data}
                    errors={errors as Record<string, string>}
                    setData={setData as any}
                    onSubmit={handleSubmit}
                    processing={processing}
                    submitLabel="Spremi zapisnik"
                />
            </ContentHolder>
        </AppLayout>
    );
}
