create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  profile_picture text not null default '/default_avatar.png',
  about text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  type text not null default 'text' check (type in ('text', 'image', 'audio')),
  body text not null,
  status text not null default 'sent' check (status in ('sent', 'delivered', 'read')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (sender_id <> receiver_id)
);

create index if not exists profiles_name_idx on public.profiles (name);
create index if not exists messages_sender_receiver_created_idx on public.messages (sender_id, receiver_id, created_at);
create index if not exists messages_receiver_sender_created_idx on public.messages (receiver_id, sender_id, created_at);
create index if not exists messages_unread_idx on public.messages (receiver_id, status) where status <> 'read';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists messages_set_updated_at on public.messages;
create trigger messages_set_updated_at
before update on public.messages
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.messages enable row level security;

grant usage on schema public to authenticated;
grant select, insert on public.profiles to authenticated;
grant select, insert on public.messages to authenticated;
revoke update on public.profiles from authenticated;
revoke update on public.messages from authenticated;
grant update (name, profile_picture, about, last_seen) on public.profiles to authenticated;
grant update (status) on public.messages to authenticated;

drop policy if exists "profiles readable by authenticated users" on public.profiles;
create policy "profiles readable by authenticated users"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "participants read messages" on public.messages;
create policy "participants read messages"
on public.messages for select
to authenticated
using (auth.uid() in (sender_id, receiver_id));

drop policy if exists "users send own messages" on public.messages;
create policy "users send own messages"
on public.messages for insert
to authenticated
with check (sender_id = auth.uid());

drop policy if exists "participants update message status" on public.messages;
create policy "participants update message status"
on public.messages for update
to authenticated
using (auth.uid() = receiver_id)
with check (auth.uid() = receiver_id);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table public.profiles;
  end if;
end;
$$;
