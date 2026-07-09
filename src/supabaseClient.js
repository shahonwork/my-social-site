import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rpordlfhzlevhmnsgcrm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb3JkbGZoemxldmhtbnNnY3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MjA2MTksImV4cCI6MjA5OTE5NjYxOX0.d-MkFNunJUEwVXzSUBgxKxhnBHixuRBlUyKWjkqpjHg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
