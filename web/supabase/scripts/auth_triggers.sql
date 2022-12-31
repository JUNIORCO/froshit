-- inserts a row into public.users
create or replace function public.handle_auth_user_create()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profile ("id", "email", "phoneNumber", "firstName", "lastName", "role", "universityId", "froshId", "teamId", "paymentId")
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'phoneNumber',
    new.raw_user_meta_data->>'firstName',
    new.raw_user_meta_data->>'lastName',
    cast(new.raw_user_meta_data->>'role' as "Role"),
    new.raw_user_meta_data->>'universityId',
    new.raw_user_meta_data->>'froshId',
    new.raw_user_meta_data->>'teamId',
    new.raw_user_meta_data->>'paymentId'
  );
  return new;
end;
$$;

-- drop trigger if exists
drop trigger IF EXISTS on_auth_user_created on auth.users;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_auth_user_create();



-- deletes profile when auth user is deleted
create or replace function public.handle_auth_user_delete()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.profile where id = old.id::text;
  return old;
end;
$$;

-- drop trigger if exists
drop trigger IF EXISTS on_auth_user_deleted on auth.users;

-- trigger the function every time a user is deleted
create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute procedure public.handle_auth_user_delete();
