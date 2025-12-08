import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      nama_perusahaan, 
      jenis, 
      kecamatan, 
      alamat, 
      telepon, 
      waktu_buka, 
      latitude, 
      longitude,
      password,
      tentang
    } = body;

    // Validasi input required
    if (!nama_perusahaan || !jenis || !kecamatan || !alamat || !latitude || !longitude || !password) {
      return NextResponse.json(
        { error: 'Field yang wajib diisi tidak lengkap' },
        { status: 400 }
      );
    }

    // Insert ke Supabase
    const { data, error } = await supabase
      .from('umkm')
      .insert([
        {
          nama_perusahaan,
          jenis,
          kecamatan,
          alamat,
          telepon: telepon || null,
          waktu_buka: waktu_buka || null,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          gambar_url: null, // Will be updated via upload API if image is provided
          password: password,
          tentang: tentang || null
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Gagal menambahkan UMKM ke database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'UMKM berhasil ditambahkan',
      data: data[0]
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
