import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import type { CreateVehicleDto } from '@/types';

export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('vehicles')
        .select(`
      *,
      documents (
        id, expiry_date,
        document_type:document_types ( name, icon, color, slug )
      )
    `)
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body: CreateVehicleDto = await request.json();

    if (!body.plate || !body.brand || !body.model || !body.year) {
        return NextResponse.json({ error: 'Faltan campos requeridos: plate, brand, model, year' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('vehicles')
        .insert([{
            plate: body.plate.toUpperCase().trim(),
            brand: body.brand.trim(),
            model: body.model.trim(),
            year: body.year,
            owner: body.owner?.trim() || null,
            notes: body.notes?.trim() || null,
        }])
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
