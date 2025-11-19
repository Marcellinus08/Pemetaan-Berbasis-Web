import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone, subject, message } = body;

    // Validasi input
    if (!full_name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Nama, email, subjek, dan pesan wajib diisi' },
        { status: 400 }
      );
    }

    // Insert data ke tabel contact_messages
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          full_name,
          email,
          phone: phone || null,
          subject,
          message,
          status: 'new', // Status default: new
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Gagal menyimpan pesan. Silakan coba lagi.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Pesan berhasil dikirim!',
        data 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

// GET endpoint untuk admin panel (opsional - untuk melihat pesan)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Gagal mengambil data pesan' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
