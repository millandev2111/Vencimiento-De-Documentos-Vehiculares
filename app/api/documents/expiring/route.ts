import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getDaysUntilExpiry } from '@/lib/utils';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') ?? '30');

    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('documents')
        .select(`
      *,
      document_type:document_types (*),
      vehicle:vehicles (*)
    `)
        .lte('expiry_date', futureDate)
        .order('expiry_date', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const enriched = (data ?? []).map((doc) => ({
        ...doc,
        daysUntilExpiry: getDaysUntilExpiry(doc.expiry_date),
    }));

    return NextResponse.json(enriched);
}
