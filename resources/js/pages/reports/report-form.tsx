import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import MemberAutocomplete, { type MemberOption } from '@/components/member-autocomplete';

export type DecisionForm = {
    title: string;
    description?: string | null;
    votes_for: number | null;
    votes_against: number | null;
    votes_abstained: number | null;
    voting_method?: string | null;
};

export type ReportFormData = {
    protocol_number: string;
    meeting_datetime: string;
    location: string;
    recorder_id: number | null;
    verifier_one_id: number | null;
    verifier_two_id: number | null;
    chairperson_id: number | null;
    board_members: Array<number | null>;
    attendees_count: number | null;
    quorum_note: string;
    agenda: string[];
    digital_votes: string;
    urgent_consultations: string;
    discussion: string;
    decisions: DecisionForm[];
    ended_at: string;
    attendance_notes: string;
};

type ReportFormProps = {
    data: ReportFormData;
    errors: Record<string, string>;
    setData: (field: keyof ReportFormData, value: ReportFormData[keyof ReportFormData]) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    processing?: boolean;
    submitLabel: string;
    onDelete?: () => void;
    memberOptions: MemberOption[];
};

export function ReportForm({ data, errors, setData, onSubmit, processing, submitLabel, onDelete, memberOptions }: ReportFormProps) {
    const agendaItems = data.agenda ?? [];
    const decisions = data.decisions ?? [];
    const boardMemberIds = data.board_members ?? [];

    const updateAgendaItem = (index: number, value: string) => {
        const updated = [...agendaItems];
        updated[index] = value;
        setData('agenda', updated);
    };

    const addAgendaItem = () => setData('agenda', [...agendaItems, '']);

    const removeAgendaItem = (index: number) => {
        if (agendaItems.length <= 1) return;
        setData('agenda', agendaItems.filter((_, i) => i !== index));
    };

    const updateDecision = <K extends keyof DecisionForm>(index: number, field: K, value: DecisionForm[K]) => {
        const updated = [...decisions];
        updated[index] = { ...updated[index], [field]: value };
        setData('decisions', updated);
    };

    const addDecision = () =>
        setData('decisions', [
            ...decisions,
            { title: '', description: '', votes_for: null, votes_against: null, votes_abstained: null, voting_method: '' },
        ]);

    const removeDecision = (index: number) => {
        if (decisions.length <= 1) return;
        setData('decisions', decisions.filter((_, i) => i !== index));
    };

    const updateBoardMemberAt = (index: number, memberId: number | null) => {
        const next = [...boardMemberIds];
        next[index] = memberId;
        setData('board_members', next);
    };

    const addBoardMember = () => {
        setData('board_members', [...boardMemberIds, null]);
    };

    const removeBoardMember = (index: number) => {
        const next = [...boardMemberIds];
        next.splice(index, 1);
        setData('board_members', next);
    };

    const parseNumberInput = (value: string) => (value === '' ? null : Number(value));

    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Osnovni podaci</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="protocol_number">Broj protokola *</Label>
                        <Input
                            id="protocol_number"
                            value={data.protocol_number}
                            onChange={(e) => setData('protocol_number', e.target.value)}
                            placeholder="npr. 01/2025"
                        />
                        {errors.protocol_number && <span className="text-sm text-destructive">{errors.protocol_number}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="meeting_datetime">Datum i vrijeme *</Label>
                        <Input
                            id="meeting_datetime"
                            type="datetime-local"
                            value={data.meeting_datetime}
                            onChange={(e) => setData('meeting_datetime', e.target.value)}
                        />
                        {errors.meeting_datetime && <span className="text-sm text-destructive">{errors.meeting_datetime}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="location">Lokacija</Label>
                        <Input
                            id="location"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            placeholder="Prostorije džemata ili online link"
                        />
                        {errors.location && <span className="text-sm text-destructive">{errors.location}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="quorum_note">Kvorum</Label>
                        <Input
                            id="quorum_note"
                            value={data.quorum_note}
                            onChange={(e) => setData('quorum_note', e.target.value)}
                            placeholder="Kvorum postoji / ne postoji..."
                        />
                        {errors.quorum_note && <span className="text-sm text-destructive">{errors.quorum_note}</span>}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Prisustvo</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="recorder">Zapisničar</Label>
                        <MemberAutocomplete
                            members={memberOptions}
                            value={data.recorder_id}
                            onChange={(val) => setData('recorder_id', val)}
                            placeholder="Odaberite zapisničara"
                        />
                        {errors.recorder_id && <span className="text-sm text-destructive">{errors.recorder_id}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="chairperson">Predsjedavajući (Mutavelija)</Label>
                        <MemberAutocomplete
                            members={memberOptions}
                            value={data.chairperson_id}
                            onChange={(val) => setData('chairperson_id', val)}
                            placeholder="Odaberite predsjedavajućeg"
                        />
                        {errors.chairperson_id && <span className="text-sm text-destructive">{errors.chairperson_id}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="verifier_one">Ovjerovitelj 1</Label>
                        <MemberAutocomplete
                            members={memberOptions}
                            value={data.verifier_one_id}
                            onChange={(val) => setData('verifier_one_id', val)}
                            placeholder="Odaberite ovjerovitelja"
                        />
                        {errors.verifier_one_id && <span className="text-sm text-destructive">{errors.verifier_one_id}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="verifier_two">Ovjerovitelj 2</Label>
                        <MemberAutocomplete
                            members={memberOptions}
                            value={data.verifier_two_id}
                            onChange={(val) => setData('verifier_two_id', val)}
                            placeholder="Odaberite ovjerovitelja"
                        />
                        {errors.verifier_two_id && <span className="text-sm text-destructive">{errors.verifier_two_id}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="board_members">Članovi Izvršnog odbora</Label>
                        <div className="flex flex-col gap-3">
                            {boardMemberIds.length === 0 && (
                                <p className="text-sm text-muted-foreground">Dodajte člana odbora pomoću dugmeta ispod.</p>
                            )}
                            {boardMemberIds.map((memberId, index) => {
                                const disabledIds = boardMemberIds
                                    .map((id, idx) => (idx === index ? null : id))
                                    .filter((id): id is number => typeof id === 'number');

                                return (
                                    <div key={index} className="flex items-center gap-2">
                                        <MemberAutocomplete
                                            members={memberOptions}
                                            value={typeof memberId === 'number' ? memberId : null}
                                            onChange={(val) => updateBoardMemberAt(index, val)}
                                            disabledIds={disabledIds}
                                            placeholder="Počnite kucati ime"
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => removeBoardMember(index)}
                                        >
                                            Ukloni
                                        </Button>
                                    </div>
                                );
                            })}
                            <Button type="button" variant="outline" onClick={addBoardMember}>
                                Dodaj člana
                            </Button>
                        </div>
                        {errors.board_members && <span className="text-sm text-destructive">{errors.board_members}</span>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="attendees_count">Ukupan broj prisutnih</Label>
                        <Input
                            id="attendees_count"
                            type="number"
                            min={0}
                            value={data.attendees_count ?? ''}
                            onChange={(e) => setData('attendees_count', parseNumberInput(e.target.value) as any)}
                        />
                        {errors.attendees_count && <span className="text-sm text-destructive">{errors.attendees_count}</span>}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Dnevni red i komunikacija</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label>Dnevni red</Label>
                        <div className="space-y-3">
                            {agendaItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={item}
                                        onChange={(e) => updateAgendaItem(index, e.target.value)}
                                        placeholder={`Tačka ${index + 1}`}
                                    />
                                    <Button type="button" variant="secondary" onClick={() => removeAgendaItem(index)} disabled={agendaItems.length <= 1}>
                                        Ukloni
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {errors.agenda && <span className="text-sm text-destructive">{errors.agenda}</span>}
                        <Button type="button" variant="outline" onClick={addAgendaItem}>
                            Dodaj tačku
                        </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="digital_votes">Digitalna glasanja</Label>
                        <Textarea
                            id="digital_votes"
                            value={data.digital_votes}
                            onChange={(e) => setData('digital_votes', e.target.value)}
                            placeholder="Tema, period i rezultat glasanja"
                        />
                        {errors.digital_votes && <span className="text-sm text-destructive">{errors.digital_votes}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="urgent_consultations">Hitne konsultacije</Label>
                        <Textarea
                            id="urgent_consultations"
                            value={data.urgent_consultations}
                            onChange={(e) => setData('urgent_consultations', e.target.value)}
                            placeholder="Kratak opis komunikacije i ishoda"
                        />
                        {errors.urgent_consultations && <span className="text-sm text-destructive">{errors.urgent_consultations}</span>}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Rasprava</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="discussion">Tok sjednice i rasprava</Label>
                        <Textarea
                            id="discussion"
                            className="min-h-[140px]"
                            value={data.discussion}
                            onChange={(e) => setData('discussion', e.target.value)}
                            placeholder="Sažetak rasprave po tačkama"
                        />
                        {errors.discussion && <span className="text-sm text-destructive">{errors.discussion}</span>}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Odluke</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {decisions.map((decision, index) => (
                        <div key={index} className="space-y-3 rounded-md border p-3">
                            <div className="flex flex-col gap-2">
                                <Label>Odluka #{index + 1}</Label>
                                <Input
                                    value={decision.title}
                                    onChange={(e) => updateDecision(index, 'title', e.target.value)}
                                    placeholder="Odluka br. X"
                                />
                                {errors[`decisions.${index}.title`] && (
                                    <span className="text-sm text-destructive">{errors[`decisions.${index}.title`]}</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Opis</Label>
                                <Textarea
                                    value={decision.description ?? ''}
                                    onChange={(e) => updateDecision(index, 'description', e.target.value)}
                                    placeholder="Opis odluke"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Glasovi ZA</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={decision.votes_for ?? ''}
                                        onChange={(e) => updateDecision(index, 'votes_for', parseNumberInput(e.target.value))}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Glasovi PROTIV</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={decision.votes_against ?? ''}
                                        onChange={(e) => updateDecision(index, 'votes_against', parseNumberInput(e.target.value))}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Glasovi UZDRŽANI</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={decision.votes_abstained ?? ''}
                                        onChange={(e) => updateDecision(index, 'votes_abstained', parseNumberInput(e.target.value))}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Način glasanja</Label>
                                    <Input
                                        value={decision.voting_method ?? ''}
                                        onChange={(e) => updateDecision(index, 'voting_method', e.target.value)}
                                        placeholder="Javno / Tajno / Elektronsko"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="button" variant="secondary" onClick={() => removeDecision(index)} disabled={decisions.length <= 1}>
                                    Ukloni odluku
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addDecision}>
                        Dodaj odluku
                    </Button>
                    {errors.decisions && <span className="text-sm text-destructive">{errors.decisions}</span>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Završne napomene</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="ended_at">Vrijeme završetka</Label>
                        <Input
                            id="ended_at"
                            type="time"
                            value={data.ended_at}
                            onChange={(e) => setData('ended_at', e.target.value)}
                        />
                        {errors.ended_at && <span className="text-sm text-destructive">{errors.ended_at}</span>}
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <Label htmlFor="attendance_notes">Napomena o dolascima/odlascima</Label>
                        <Textarea
                            id="attendance_notes"
                            value={data.attendance_notes}
                            onChange={(e) => setData('attendance_notes', e.target.value)}
                            placeholder="Navesti ako je neko napustio sjednicu ranije"
                        />
                        {errors.attendance_notes && <span className="text-sm text-destructive">{errors.attendance_notes}</span>}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                {onDelete && (
                    <Button type="button" variant="destructive" onClick={onDelete}>
                        Obriši zapisnik
                    </Button>
                )}
                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
