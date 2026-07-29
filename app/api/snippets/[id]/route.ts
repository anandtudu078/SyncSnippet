import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const {
      repository_full_name,
      file_path,
      start_line,
      end_line,
      branch,
      language,
    } = body

    const { data, error } = await supabase
      .from('snippets')
      .insert({
        owner_id: user.id,
        repository_full_name,
        file_path,
        start_line,
        end_line,
        branch: branch || 'main',
        language: language || null,
      })
      .select('id')
      .single()

    if (error) {
      // Return the error details directly in the response
      return NextResponse.json({
        error: error.message,
        details: error.details,
        code: error.code,
      }, { status: 500 })
    }

    return NextResponse.json({ id: data.id })
  } catch (err: any) {
    return NextResponse.json({
      error: 'Internal server error',
      message: err.message,
    }, { status: 500 })
  }
}