import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Portfolio from '@/models/Portfolio'

export async function GET() {
  try {
    await connectDB()
    const portfolio = await Portfolio.find({})
    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await connectDB()
    const portfolio = await Portfolio.create(data)
    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error creating portfolio:', error)
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
  }
} 