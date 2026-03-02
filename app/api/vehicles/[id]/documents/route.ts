import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { calculateExpiryDate } from '@/lib/utils';
import type { CreateDocumentDto } from '@/types';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('documents')
        .select(`
      *,
      document_type:document_types (*)
    `)
        .eq('vehicle_id', id)
        .order('expiry_date', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: vehicleId } = await params;
    const body: CreateDocumentDto = await request.json();

    if (!body.document_type_id || !body.issue_date) {
        return NextResponse.json({ error: 'Faltan campos: document_type_id, issue_date' }, { status: 400 });
    }

    const supabase = await createClient();
    // Fetch the document type to get duration
    const { data: docType, error: typeError } = await supabase
        .from('document_types')
        .select('duration_months')
        .eq('id', body.document_type_id)
        .single();

    if (typeError || !docType) {
        return NextResponse.json({ error: 'Tipo de documento no encontrado' }, { status: 400 });
    }

    const expiryDate = calculateExpiryDate(body.issue_date, docType.duration_months);
    const expiryDateStr = expiryDate.toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('documents')
        .insert([{
            vehicle_id: vehicleId,
            document_type_id: body.document_type_id,
            issue_date: body.issue_date,
            expiry_date: expiryDateStr,
            file_url: body.file_url || null,
            notes: body.notes?.trim() || null,
        }])
        .select(`*, document_type:document_types (*)`)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
