create table if not exists trip.trip_events (
  id uuid primary key default extensions.gen_random_uuid(),
  trip_id uuid not null references trip.trips(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  trip_status text not null,
  occurred_at timestamptz not null default now(),
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint trip_events_type_check check (event_type in ('trip_created', 'status_changed', 'trip_cancelled')),
  constraint trip_events_status_check check (trip_status in ('accepted', 'en_route_pickup', 'arrived_pickup', 'rider_onboarded', 'completed', 'cancelled')),
  constraint trip_events_metadata_is_object check (jsonb_typeof(metadata) = 'object')
);

create index if not exists trip_events_trip_occurred_at_idx on trip.trip_events (trip_id, occurred_at asc);
create index if not exists trip_events_actor_created_at_idx on trip.trip_events (actor_user_id, created_at desc);

create or replace function trip.prevent_trip_event_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  raise exception 'trip events are immutable' using errcode = '45000';
end;
$$;

create trigger trip_events_prevent_update
  before update on trip.trip_events
  for each row execute function trip.prevent_trip_event_mutation();

create trigger trip_events_prevent_delete
  before delete on trip.trip_events
  for each row execute function trip.prevent_trip_event_mutation();

alter table trip.trip_events enable row level security;
revoke all on table trip.trip_events from anon, authenticated;
revoke execute on function trip.prevent_trip_event_mutation() from public, anon, authenticated;

comment on table trip.trip_events is
  'Immutable app-facing trip timeline events. This table is read through RPCs only and does not replace audit logs or authorize money movement.';
