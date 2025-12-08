import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, password } = body;

    if (!id || !password) {
      return NextResponse.json(
        { error: 'ID dan password harus diisi', valid: false },
        { status: 400 }
      );
    }

    // Get UMKM from database
    const { data, error } = await supabase
      .from('umkm')
      .select('password')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'UMKM tidak ditemukan', valid: false },
        { status: 404 }
      );
    }

    // Verify password
    const isValid = data.password === password;

    return NextResponse.json({
      valid: isValid,
      message: isValid ? 'Password benar' : 'Password salah'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server', valid: false },
      { status: 500 }
    );
  }
}
