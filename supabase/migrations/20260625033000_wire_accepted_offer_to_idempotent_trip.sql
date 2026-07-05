create or replace function trip.create_trip_from_accepted_offer(p_offer_id uuid)
returns table (
  id uuid,
  request_id uuid,
  accepted_offer_id uuid,
  rider_user_id uuid,
  driver_user_id uuid,
  vehicle_id uuid,
  trip_status text,
  pickup_address_text text,
  dropoff_address_text text,
  service_type text,
  estimate_minor integer,
  currency text,
  accepted_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = trip, dispatch, rider, audit, auth, pg_catalog
as $$
declare
  v_offer dispatch.trip_offers%rowtype;
  v_request rider.ride_requests%rowtype;
  v_trip trip.trips%rowtype;
  v_created boolean := false;
begin
  select * into v_offer
  from dispatch.trip_offers offer
  where offer.id = p_offer_id
    and offer.offer_status = 'accepted'
  for update;

  if v_offer.id is null then
    raise exception 'accepted offer not found' using errcode = '22023';
  end if;

  select * into v_request
  from rider.ride_requests request
  where request.id = v_offer.request_id
  for update;

  if v_request.id is null then
    raise exception 'request not found' using errcode = '22023';
  end if;

  select * into v_trip
  from trip.trips trips
  where trips.accepted_offer_id = v_offer.id
  order by trips.created_at asc
  limit 1
  for update;

  if v_trip.id is null then
    perform 1
    from trip.trips trips
    where trips.request_id = v_request.id
    for update;

    if found then
      raise exception 'request already has a trip' using errcode = '22023';
    end if;

    insert into trip.trips (
      request_id,
      accepted_offer_id,
      rider_user_id,
      driver_user_id,
      vehicle_id,
      trip_status,
      pickup_address_text,
      pickup_latitude,
      pickup_longitude,
      dropoff_address_text,
      dropoff_latitude,
      dropoff_longitude,
      service_type,
      estimate_minor,
      currency
    ) values (
      v_request.id,
      v_offer.id,
      v_request.user_id,
      v_offer.driver_user_id,
      v_offer.vehicle_id,
      'accepted',
      v_request.pickup_address_text,
      v_request.pickup_latitude,
      v_request.pickup_longitude,
      v_request.dropoff_address_text,
      v_request.dropoff_latitude,
      v_request.dropoff_longitude,
      v_request.service_type,
      v_request.estimate_minor,
      v_request.currency
    )
    returning * into v_trip;

    v_created := true;
  end if;

  if v_created then
    insert into trip.trip_events (trip_id, actor_user_id, event_type, trip_status, occurred_at, metadata)
    values (
      v_trip.id,
      null,
      'trip_created',
      v_trip.trip_status,
      v_trip.accepted_at,
      jsonb_build_object('request_id', v_trip.request_id, 'accepted_offer_id', v_trip.accepted_offer_id, 'payment_touched', false)
    )
    on conflict do nothing;

    insert into audit.audit_logs (actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata)
    values (
      null,
      'trip.trips.create_from_accepted_offer',
      'trip.trips',
      v_trip.id::text,
      null,
      jsonb_build_object('request_id', v_trip.request_id, 'driver_user_id', v_trip.driver_user_id, 'vehicle_id', v_trip.vehicle_id, 'trip_status', v_trip.trip_status),
      jsonb_build_object('payment_touched', false, 'wallet_touched', false, 'payout_touched', false, 'timeline_event_written', true, 'idempotent_replay', false)
    );
  end if;

  return query select v_trip.id,
                      v_trip.request_id,
                      v_trip.accepted_offer_id,
                      v_trip.rider_user_id,
                      v_trip.driver_user_id,
                      v_trip.vehicle_id,
                      v_trip.trip_status,
                      v_trip.pickup_address_text,
                      v_trip.dropoff_address_text,
                      v_trip.service_type,
                      v_trip.estimate_minor,
                      v_trip.currency,
                      v_trip.accepted_at,
                      v_trip.created_at,
                      v_trip.updated_at;
end;
$$;

comment on function trip.create_trip_from_accepted_offer(uuid) is
  'Idempotent server-side trip creation from an accepted dispatch offer. It returns the existing trip when one already exists and never charges riders, pays drivers, creates wallet entries, or grants admin authority.';

revoke execute on function trip.create_trip_from_accepted_offer(uuid) from public, anon, authenticated;

drop function if exists dispatch.respond_to_my_trip_offer(uuid, text);

create function dispatch.respond_to_my_trip_offer(
  p_offer_id uuid,
  p_response text
)
returns table (
  id uuid,
  request_id uuid,
  driver_user_id uuid,
  vehicle_id uuid,
  offer_status text,
  offered_at timestamptz,
  responded_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  trip_id uuid,
  trip_created boolean
)
language plpgsql
security definer
set search_path = dispatch, trip, audit, auth, pg_catalog
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_offer dispatch.trip_offers%rowtype;
  v_response text := lower(btrim(p_response));
  v_trip_id uuid;
  v_trip_exists boolean := false;
  v_trip_created boolean := false;
begin
  if v_actor_user_id is null then
    raise exception 'authenticated user required' using errcode = '28000';
  end if;

  if v_response is null or v_response not in ('accepted', 'rejected') then
    raise exception 'invalid response' using errcode = '22023';
  end if;

  if v_response = 'accepted' then
    select * into v_offer
    from dispatch.trip_offers offer
    where offer.id = p_offer_id
      and offer.driver_user_id = v_actor_user_id
      and offer.offer_status = 'accepted'
    for update;

    if v_offer.id is not null then
      select exists (
        select 1
        from trip.trips trips
        where trips.accepted_offer_id = v_offer.id
      ) into v_trip_exists;

      select created_trip.id into v_trip_id
      from trip.create_trip_from_accepted_offer(v_offer.id) as created_trip
      limit 1;

      v_trip_created := not v_trip_exists;

      return query select v_offer.id,
                          v_offer.request_id,
                          v_offer.driver_user_id,
                          v_offer.vehicle_id,
                          v_offer.offer_status,
                          v_offer.offered_at,
                          v_offer.responded_at,
                          v_offer.expires_at,
                          v_offer.created_at,
                          v_offer.updated_at,
                          v_trip_id,
                          v_trip_created;
      return;
    end if;
  end if;

  update dispatch.trip_offers offer
  set offer_status = v_response,
      responded_at = now(),
      updated_at = now()
  where offer.id = p_offer_id
    and offer.driver_user_id = v_actor_user_id
    and offer.offer_status = 'offered'
    and offer.expires_at > now()
    and (
      v_response <> 'accepted'
      or not exists (
        select 1
        from dispatch.trip_offers accepted_offer
        where accepted_offer.request_id = offer.request_id
          and accepted_offer.offer_status = 'accepted'
          and accepted_offer.id <> offer.id
      )
    )
  returning * into v_offer;

  if v_offer.id is null then
    raise exception 'offer not available' using errcode = '22023';
  end if;

  if v_response = 'accepted' then
    select exists (
      select 1
      from trip.trips trips
      where trips.accepted_offer_id = v_offer.id
    ) into v_trip_exists;

    select created_trip.id into v_trip_id
    from trip.create_trip_from_accepted_offer(v_offer.id) as created_trip
    limit 1;

    v_trip_created := not v_trip_exists;
  end if;

  insert into audit.audit_logs (actor_user_id, action_name, resource_type, resource_id, before_snapshot, after_snapshot, metadata)
  values (
    v_actor_user_id,
    'dispatch.trip_offers.driver_response',
    'dispatch.trip_offers',
    v_offer.id::text,
    jsonb_build_object('offer_status', 'offered'),
    jsonb_build_object('offer_status', v_offer.offer_status, 'request_id', v_offer.request_id, 'vehicle_id', v_offer.vehicle_id),
    jsonb_build_object('trip_creation_attempted', v_response = 'accepted', 'trip_created', v_trip_created, 'trip_id', v_trip_id, 'payment_touched', false, 'wallet_touched', false, 'payout_touched', false)
  );

  return query select v_offer.id,
                      v_offer.request_id,
                      v_offer.driver_user_id,
                      v_offer.vehicle_id,
                      v_offer.offer_status,
                      v_offer.offered_at,
                      v_offer.responded_at,
                      v_offer.expires_at,
                      v_offer.created_at,
                      v_offer.updated_at,
                      v_trip_id,
                      v_trip_created;
end;
$$;

comment on function dispatch.respond_to_my_trip_offer(uuid, text) is
  'Driver-owned offer response. Accepting an offer wires to idempotent trip creation; rejecting only records the response. It does not move money, create payouts, or grant admin authority.';

revoke execute on function dispatch.respond_to_my_trip_offer(uuid, text) from public, anon, authenticated;
grant execute on function dispatch.respond_to_my_trip_offer(uuid, text) to authenticated;
