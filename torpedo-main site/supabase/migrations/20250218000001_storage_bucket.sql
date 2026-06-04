-- Create private bucket for project files (folder per project: project_id/filename)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-files',
  'project-files',
  false,
  52428800,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/zip', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- RLS: allow authenticated users to read/write objects in project-files when the folder name (project_id) is one they can access
CREATE POLICY "project-files select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-files'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.projects
    WHERE client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  )
);

CREATE POLICY "project-files insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-files'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.projects
    WHERE client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  )
);

CREATE POLICY "project-files update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-files'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.projects
    WHERE client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  )
);

CREATE POLICY "project-files delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-files'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.projects
    WHERE client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'team'))
  )
);
