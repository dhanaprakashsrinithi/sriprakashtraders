-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can view their own roles"
on public.user_roles for select to authenticated
using (user_id = auth.uid());

-- Grant admin to the business owner email once the email is confirmed
create or replace function public.grant_owner_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) = 'sriprakashtradersco@gmail.com' and new.email_confirmed_at is not null then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_owner_admin
after insert or update of email_confirmed_at on auth.users
for each row execute function public.grant_owner_admin();

-- Shared updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  uses text[] not null default '{}',
  specifications text not null default '',
  availability text not null default 'available' check (availability in ('available','limited','subject_to_availability','unavailable')),
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant update on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;

create policy "Anyone can view products" on public.products for select to anon, authenticated using (true);
create policy "Admins can update products" on public.products for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create trigger products_updated_at before update on public.products
for each row execute function public.set_updated_at();

insert into public.products (slug, name, tagline, description, uses, specifications, availability, sort_order) values
('yellow-maize', 'Yellow Maize', 'Premium yellow maize for bulk buyers',
 'Our core commodity. We supply premium yellow maize in wholesale quantities to feed manufacturers and agricultural commodity buyers across Tamil Nadu and India.',
 array['Poultry feed manufacturers','Cattle feed manufacturers','Agricultural commodity buyers','Bulk wholesale supply'],
 '', 'available', 1),
('white-maize', 'White Maize', 'Wholesale supply subject to availability',
 'White maize supplied in wholesale quantities, subject to seasonal availability. Contact us for current stock status.',
 array['Food processing','Other industrial applications'],
 '', 'subject_to_availability', 2);

-- Enquiries
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null default '',
  phone text not null,
  email text not null default '',
  maize_type text not null check (maize_type in ('Yellow Maize','White Maize')),
  quantity_mt numeric(12,2) not null check (quantity_mt > 0),
  delivery_location text not null,
  requirements text not null default '',
  status text not null default 'new' check (status in ('new','contacted','closed')),
  admin_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update, delete on public.enquiries to authenticated;
grant all on public.enquiries to service_role;
alter table public.enquiries enable row level security;

create policy "Admins can view enquiries" on public.enquiries for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update enquiries" on public.enquiries for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete enquiries" on public.enquiries for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create index enquiries_created_at_idx on public.enquiries (created_at desc);
create index enquiries_phone_created_idx on public.enquiries (phone, created_at desc);

create trigger enquiries_updated_at before update on public.enquiries
for each row execute function public.set_updated_at();