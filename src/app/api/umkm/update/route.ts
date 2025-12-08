import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      id,
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

    if (!id) {
      return NextResponse.json(
        { error: 'ID UMKM harus diisi' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      nama_perusahaan,
      jenis,
      kecamatan,
      alamat,
      telepon: telepon || null,
      waktu_buka: waktu_buka || null,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      tentang: tentang || null
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = password;
    }

    // Update in Supabase
    const { data, error } = await supabase
      .from('umkm')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Gagal mengupdate UMKM' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'UMKM berhasil diupdate',
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
