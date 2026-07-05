create extension if not exists pgtap with schema extensions;

begin;

set local search_path = public, extensions;

select plan(27);

select has_table('dispatch', 'trip_offers', 'trip offers table exists');
select col_is_pk('dispatch', 'trip_offers', 'id', 'trip offer id is primary key');
select fk_ok('dispatch', 'trip_offers', 'request_id', 'rider', 'ride_requests', 'id', 'trip offer request_id references ride requests');
select fk_ok('dispatch', 'trip_offers', 'driver_user_id', 'auth', 'users', 'id', 'trip offer driver_user_id references auth.users');
select fk_ok('dispatch', 'trip_offers', 'vehicle_id', 'driver', 'vehicles', 'id', 'trip offer vehicle_id references vehicles');
select has_function('dispatch', 'create_trip_offer_for_candidate', array['uuid'::name, 'uuid'::name, 'uuid'::name], 'create offer RPC exists');
select has_function('dispatch', 'get_my_driver_trip_offers', array[]::name[], 'driver offer read RPC exists');
select has_function('dispatch', 'respond_to_my_trip_offer', array['uuid'::name, 'text'::name], 'driver offer response RPC exists');
select is(has_function_privilege('authenticated', 'dispatch.create_trip_offer_for_candidate(uuid, uuid, uuid)'::regprocedure, 'EXECUTE'), false, 'authenticated cannot create dispatch offers directly');
select is(has_function_privilege('authenticated', 'dispatch.respond_to_my_trip_offer(uuid, text)'::regprocedure, 'EXECUTE'), true, 'authenticated drivers can respond to own offers through RPC');

create temporary table trip_offer_contract_results (
  label text primary key,
  offer_id uuid not null,
  offer_status text not null,
  trip_id uuid,
  trip_created boolean not null
) on commit drop;

insert into auth.users (id, email)
values ('00000000-0000-4000-8000-000000000101', 'trip-offer-rider@example.test'),
       ('00000000-0000-4000-8000-000000000201', 'trip-offer-driver@example.test'),
       ('00000000-0000-4000-8000-000000000202', 'trip-offer-other-driver@example.test'),
       ('00000000-0000-4000-8000-000000000203', 'trip-offer-rejecting-driver@example.test')
on conflict (id) do nothing;

insert into driver.vehicles (id, user_id, plate_number, vehicle_type)
values ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000201', 'HTD1101', 'sedan'),
       ('00000000-0000-4000-8000-000000000302', '00000000-0000-4000-8000-000000000202', 'HTD1102', 'sedan'),
       ('00000000-0000-4000-8000-000000000303', '00000000-0000-4000-8000-000000000203', 'HTD1103', 'sedan')
on conflict (id) do nothing;

insert into rider.ride_requests (
  id,
  user_id,
  pickup_address_text,
  dropoff_address_text,
  service_type,
  estimate_minor,
  currency,
  status,
  expires_at
) values (
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000101',
  'Alabang',
  'Makati',
  'standard',
  17000,
  'PHP',
  'requested',
  now() + interval '10 minutes'
), (
  '00000000-0000-4000-8000-000000000402',
  '00000000-0000-4000-8000-000000000101',
  'Quezon City',
  'Pasig',
  'standard',
  15000,
  'PHP',
  'requested',
  now() + interval '10 minutes'
) on conflict (id) do nothing;

insert into dispatch.trip_offers (
  id,
  request_id,
  driver_user_id,
  vehicle_id,
  offer_status,
  expires_at
) values (
  '00000000-0000-4000-8000-000000000501',
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000201',
  '00000000-0000-4000-8000-000000000301',
  'offered',
  now() + interval '45 seconds'
), (
  '00000000-0000-4000-8000-000000000502',
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000202',
  '00000000-0000-4000-8000-000000000302',
  'offered',
  now() + interval '45 seconds'
), (
  '00000000-0000-4000-8000-000000000503',
  '00000000-0000-4000-8000-000000000402',
  '00000000-0000-4000-8000-000000000203',
  '00000000-0000-4000-8000-000000000303',
  'offered',
  now() + interval '45 seconds'
) on conflict (id) do nothing;

do $$
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000201', true);
end;
$$;

insert into trip_offer_contract_results (label, offer_id, offer_status, trip_id, trip_created)
select 'first_accept', id, offer_status, trip_id, trip_created
from dispatch.respond_to_my_trip_offer('00000000-0000-4000-8000-000000000501', 'accepted');

select ok((select trip_id is not null from trip_offer_contract_results where label = 'first_accept'), 'accepted offer response includes created trip id');
select ok((select trip_created from trip_offer_contract_results where label = 'first_accept'), 'accepted offer response reports trip creation');
select is((select count(*)::integer from trip.trips where accepted_offer_id = '00000000-0000-4000-8000-000000000501'), 1, 'accepting an offer creates one trip for that offer');

insert into trip_offer_contract_results (label, offer_id, offer_status, trip_id, trip_created)
select 'same_offer_replay', id, offer_status, trip_id, trip_created
from dispatch.respond_to_my_trip_offer('00000000-0000-4000-8000-000000000501', 'accepted');

select is(
  (select trip_id::text from trip_offer_contract_results where label = 'same_offer_replay'),
  (select trip_id::text from trip_offer_contract_results where label = 'first_accept'),
  'replaying the same accepted offer returns the same trip'
);
select is((select trip_created from trip_offer_contract_results where label = 'same_offer_replay'), false, 'same accepted offer replay reports existing trip');
select is((select count(*)::integer from trip.trips where accepted_offer_id = '00000000-0000-4000-8000-000000000501'), 1, 'same offer replay does not create duplicate trips for the offer');
select is((select count(*)::integer from trip.trips where request_id = '00000000-0000-4000-8000-000000000401'), 1, 'same offer replay does not create duplicate trips for the request');
select is(
  (
    select count(*)::integer
    from trip.trip_events events
    join trip.trips trips on trips.id = events.trip_id
    where trips.accepted_offer_id = '00000000-0000-4000-8000-000000000501'
      and events.event_type = 'trip_created'
  ),
  1,
  'same offer replay leaves exactly one trip_created event'
);

do $$
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000202', true);
  begin
    perform 1 from dispatch.respond_to_my_trip_offer('00000000-0000-4000-8000-000000000501', 'accepted');
    raise exception 'wrong driver was allowed to replay accepted offer';
  exception when sqlstate '22023' then
    null;
  end;
end;
$$;
select pass('wrong driver cannot replay another driver offer');

do $$
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000201', true);
  begin
    perform 1 from dispatch.respond_to_my_trip_offer('00000000-0000-4000-8000-000000000501', null::text);
    raise exception 'NULL response was allowed';
  exception when sqlstate '22023' then
    null;
  end;
end;
$$;
select pass('NULL response is rejected explicitly');

do $$
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000201', true);
  begin
    perform 1 from dispatch.respond_to_my_trip_offer('00000000-0000-4000-8000-000000000501', 'maybe');
    raise exception 'invalid response was allowed';
  exception when sqlstate '22023' then
    null;
  end;
end;
$$;
select pass('invalid response is rejected explicitly');

do $$
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000203', true);
end;
$$;

insert into trip_offer_contract_results (label, offer_id, offer_status, trip_id, trip_created)
select 'rejected_offer', id, offer_status, trip_id, trip_created
from dispatch.respond_to_my_trip_offer('00000000-0000-4000-8000-000000000503', 'rejected');

select is((select offer_status from trip_offer_contract_results where label = 'rejected_offer'), 'rejected', 'rejected offer stays rejected-only');
select is((select count(*)::integer from trip.trips where accepted_offer_id = '00000000-0000-4000-8000-000000000503'), 0, 'rejected offer does not create a trip');

do $$
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000202', true);
  begin
    perform 1 from dispatch.respond_to_my_trip_offer('00000000-0000-4000-8000-000000000502', 'accepted');
    raise exception 'competing offer was allowed to accept an already-tripped request';
  exception when sqlstate '22023' then
    null;
  end;
end;
$$;
select pass('competing offer for the same ride request is rejected');
select is((select count(*)::integer from trip.trips where accepted_offer_id = '00000000-0000-4000-8000-000000000502'), 0, 'competing offer does not get its own trip');
select is((select count(*)::integer from trip.trips where request_id = '00000000-0000-4000-8000-000000000401'), 1, 'competing offer does not create a second trip for the request');
select is(
  (
    select count(*)::integer
    from trip.trip_events events
    join trip.trips trips on trips.id = events.trip_id
    where trips.request_id = '00000000-0000-4000-8000-000000000401'
      and events.event_type = 'trip_created'
  ),
  1,
  'competing offer does not create another trip_created event'
);

select * from finish();

rollback;
