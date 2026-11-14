ALTER TABLE public.enquiries
  ADD COLUMN enquiry_type text NOT NULL DEFAULT 'buy',
  ADD COLUMN quantity numeric(14,2),
  ADD COLUMN quantity_unit text NOT NULL DEFAULT 'MT',
  ADD COLUMN expected_price text NOT NULL DEFAULT '';

UPDATE public.enquiries SET quantity = quantity_mt WHERE quantity IS NULL;

ALTER TABLE public.enquiries
  ADD CONSTRAINT enquiries_enquiry_type_check CHECK (enquiry_type IN ('buy','sell')),
  ADD CONSTRAINT enquiries_quantity_unit_check CHECK (quantity_unit IN ('T','MT','KG','QTL')),
  ADD CONSTRAINT enquiries_quantity_check CHECK (quantity IS NULL OR quantity > 0),
  ADD CONSTRAINT enquiries_expected_price_len CHECK (char_length(expected_price) <= 100);

COMMENT ON COLUMN public.enquiries.enquiry_type IS 'buy = customer buying maize from us; sell = customer selling maize to us';
COMMENT ON COLUMN public.enquiries.quantity IS 'Quantity as entered by the visitor, in quantity_unit';
COMMENT ON COLUMN public.enquiries.quantity_mt IS 'Quantity converted to metric tonnes, used for totals';

CREATE INDEX enquiries_type_created_idx ON public.enquiries (enquiry_type, created_at DESC);