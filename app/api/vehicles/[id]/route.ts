import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data, error } = await supabase
        .from('vehicles')
        .select(`
      *,
      documents (
        *,
        document_type:document_types ( * )
      )
    `)
        .eq('id', id)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
        .from('vehicles')
        .update({
            plate: body.plate?.toUpperCase().trim(),
            brand: body.brand?.trim(),
            model: body.model?.trim(),
            year: body.year,
            owner: body.owner?.trim() || null,
            notes: body.notes?.trim() || null,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
