import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ContentHolder from '@/components/content-holder';
import { Head, router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { ReportForm, type ReportFormData, type DecisionForm } from './report-form';
import { type MemberOption } from '@/components/member-autocomplete';

type ReportPayload = ReportFormData & {
    id: number;
    meeting_datetime: string;
    ended_at: string | null;
    agenda: string[] | null;
    decisions: DecisionForm[] | null;
};

const breadcrumbs = (reportId: number): BreadcrumbItem[] => [
    { title: 'Početna stranica', href: '/dashboard' },
    { title: 'Zapisnici', href: '/reports' },
    { title: `Uredi #${reportId}`, href: `/reports/${reportId}/edit` },
];

const toDateTimeLocal = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function EditReport({ report, boardMembers }: { report: ReportPayload; boardMembers: MemberOption[] }) {
    const { data, setData, post, processing, errors } = useForm<ReportFormData>({
        protocol_number: report.protocol_number,
        meeting_datetime: toDateTimeLocal(report.meeting_datetime),
        location: report.location ?? '',
        recorder_id: report.recorder_id ?? null,
        verifier_one_id: report.verifier_one_id ?? null,
        verifier_two_id: report.verifier_two_id ?? null,
        chairperson_id: report.chairperson_id ?? null,
        board_members: report.board_members ?? [],
        attendees_count: report.attendees_count ?? null,
        quorum_note: report.quorum_note ?? '',
        agenda: report.agenda && report.agenda.length ? report.agenda : [''],
        digital_votes: report.digital_votes ?? '',
        urgent_consultations: report.urgent_consultations ?? '',
        discussion: report.discussion ?? '',
        decisions: report.decisions && report.decisions.length
            ? report.decisions.map((d) => ({
                title: d.title ?? '',
                description: d.description ?? '',
                votes_for: d.votes_for ?? null,
                votes_against: d.votes_against ?? null,
                votes_abstained: d.votes_abstained ?? null,
                voting_method: d.voting_method ?? '',
            }))
            : [{ title: '', description: '', votes_for: null, votes_against: null, votes_abstained: null, voting_method: '' }],
        ended_at: report.ended_at ?? '',
        attendance_notes: report.attendance_notes ?? '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('reports.update', { report: report.id }), {
            data: {
                ...data,
                board_members: data.board_members.filter((id): id is number => typeof id === 'number'),
            },
        });
    };

    const handleDelete = () => {
        router.delete(route('reports.destroy', { report: report.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(report.id)}>
            <Head title={`Uredi zapisnik #${report.id}`} />
            <ContentHolder>
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Uredi zapisnik</h1>
                    <p className="text-sm text-muted-foreground">Ažurirajte sadržaj zapisnika sa sjednice.</p>
                </div>
                <ReportForm
                    data={data}
                    errors={errors as Record<string, string>}
                    setData={setData as any}
                    onSubmit={handleSubmit}
                    processing={processing}
                    submitLabel="Spremi promjene"
                    onDelete={handleDelete}
                    memberOptions={boardMembers}
                />
            </ContentHolder>
        </AppLayout>
    );
}
