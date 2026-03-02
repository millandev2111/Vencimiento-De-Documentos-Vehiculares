import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateExpiryDate } from '@/lib/utils';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data, error } = await supabase
        .from('documents')
        .select(`*, document_type:document_types (*), vehicle:vehicles (*)`)
        .eq('id', id)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();

    let updatePayload: Record<string, unknown> = {
        file_url: body.file_url || null,
        notes: body.notes?.trim() || null,
    };

    // If updating issue_date, recalculate expiry_date
    if (body.issue_date && body.document_type_id) {
        const { data: docType } = await supabase
            .from('document_types')
            .select('duration_months')
            .eq('id', body.document_type_id)
            .single();

        if (docType) {
            const newExpiry = calculateExpiryDate(body.issue_date, docType.duration_months);
            updatePayload = {
                ...updatePayload,
                issue_date: body.issue_date,
                expiry_date: newExpiry.toISOString().split('T')[0],
            };
        }
    } else if (body.issue_date) {
        updatePayload.issue_date = body.issue_date;
    }

    const { data, error } = await supabase
        .from('documents')
        .update(updatePayload)
        .eq('id', id)
        .select(`*, document_type:document_types (*), vehicle:vehicles (*)`)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
