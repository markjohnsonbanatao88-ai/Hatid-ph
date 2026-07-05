create or replace function ops.get_ops_trips(p_limit integer default 50)
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
  en_route_pickup_at timestamptz,
  arrived_pickup_at timestamptz,
  rider_onboarded_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = ops, trip, pg_catalog
as $$
begin
  if p_limit is null or p_limit < 1 or p_limit > 100 then
    raise exception 'invalid limit' using errcode = '22023';
  end if;

  return query
  select trips.id,
         trips.request_id,
         trips.accepted_offer_id,
         trips.rider_user_id,
         trips.driver_user_id,
         trips.vehicle_id,
         trips.trip_status,
         trips.pickup_address_text,
         trips.dropoff_address_text,
         trips.service_type,
         trips.estimate_minor,
         trips.currency,
         trips.accepted_at,
         trips.en_route_pickup_at,
         trips.arrived_pickup_at,
         trips.rider_onboarded_at,
         trips.completed_at,
         trips.cancelled_at,
         trips.created_at,
         trips.updated_at
  from trip.trips trips
  order by trips.created_at desc
  limit p_limit;
end;
$$;

create or replace function ops.get_ops_driver_profiles(p_limit integer default 50)
returns table (
  user_id uuid,
  display_name text,
  phone text,
  service_area_text text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = ops, driver, pg_catalog
as $$
begin
  if p_limit is null or p_limit < 1 or p_limit > 100 then
    raise exception 'invalid limit' using errcode = '22023';
  end if;

  return query
  select profile.user_id,
         profile.display_name,
         profile.phone,
         profile.service_area_text,
         profile.status,
         profile.created_at,
         profile.updated_at
  from driver.driver_profiles profile
  order by profile.created_at desc
  limit p_limit;
end;
$$;
