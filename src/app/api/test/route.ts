

import { NextResponse } from 'next/server';
import { updatePortfolio } from '../../../functions/updatePortfolio';

export async function GET(request: Request) {
  try {
    const result = await updatePortfolio();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/test:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
