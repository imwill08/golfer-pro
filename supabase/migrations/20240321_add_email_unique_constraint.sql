-- Add unique constraint to email field
ALTER TABLE public.instructors
ADD CONSTRAINT instructors_email_unique UNIQUE (email);

-- Create an index for email lookups
CREATE INDEX idx_instructors_email ON public.instructors(email); 