
// This is a temporary file to hold the correct SQL for the complaints table.
// The SQL below should be used to create the table:

/*
-- Create complaints table
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('Customer', 'Internal', 'Distributor', 'Inspector')),
  product_id UUID REFERENCES products(id),
  batch_number TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
  status TEXT NOT NULL CHECK (status IN ('Open', 'Under Investigation', 'Resolved', 'Closed')) DEFAULT 'Open',
  linked_nc_id UUID REFERENCES non_conformances(id),
  linked_capa_id UUID REFERENCES capas(id),
  assigned_to UUID REFERENCES auth.users(id),
  reported_by UUID REFERENCES auth.users(id) NOT NULL,
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE,
  closed_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  justification TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trigger function to generate reference numbers
CREATE OR REPLACE FUNCTION public.generate_complaint_reference()
RETURNS TRIGGER AS $$
DECLARE
  year_prefix TEXT;
  next_number INTEGER;
BEGIN
  year_prefix := 'C-' || TO_CHAR(current_date, 'YYYY') || '-';
  
  SELECT COALESCE(MAX(NULLIF(regexp_replace(reference_number, '^C-\d{4}-', ''), '')::INTEGER), 0) + 1
  INTO next_number
  FROM public.complaints
  WHERE reference_number LIKE year_prefix || '%';
  
  NEW.reference_number := year_prefix || LPAD(next_number::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to generate reference numbers before insert
CREATE TRIGGER complaints_reference_trigger
BEFORE INSERT ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION public.generate_complaint_reference();

-- Enable Row Level Security
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing complaints
CREATE POLICY "Users can view complaints if they reported or are assigned"
  ON public.complaints
  FOR SELECT
  USING (
    auth.uid() = reported_by OR 
    auth.uid() = assigned_to OR 
    public.is_qa_or_admin()
  );

-- Create policy for inserting new complaints
CREATE POLICY "Authenticated users can create complaints"
  ON public.complaints
  FOR INSERT
  WITH CHECK (auth.uid() = reported_by);

-- Create policy for updating complaints
CREATE POLICY "Assigned users and QA/admin can update complaints"
  ON public.complaints
  FOR UPDATE
  USING (
    (auth.uid() = assigned_to AND status != 'Closed') OR 
    public.is_qa_or_admin()
  );

-- Create policy for closing complaints (QA/Admin only)
CREATE POLICY "Only QA/admin can close complaints"
  ON public.complaints
  FOR UPDATE
  USING (
    public.is_qa_or_admin() AND 
    NEW.status = 'Closed'
  );

-- Create notification function for critical complaints
CREATE OR REPLACE FUNCTION public.notify_critical_complaints()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify QA when a critical severity complaint is created
  IF NEW.severity = 'Critical' AND TG_OP = 'INSERT' THEN
    -- Notify all users with QA role
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      related_to,
      related_id,
      notification_type
    )
    SELECT 
      user_id,
      'Critical Complaint Alert',
      'A new critical complaint ' || NEW.reference_number || ' has been reported',
      'complaint',
      NEW.id,
      'critical_alert'
    FROM 
      public.user_roles
    WHERE 
      role = 'qa';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for notification on critical complaints
CREATE TRIGGER complaints_critical_notification_trigger
AFTER INSERT OR UPDATE ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION public.notify_critical_complaints();
*/
