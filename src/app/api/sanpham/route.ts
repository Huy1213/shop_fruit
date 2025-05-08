import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(){
    try {
        const [data] = await db.execute('SELECT * FROM mausac');
        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:'Lỗi kết nối'},{status:500});
    }
}