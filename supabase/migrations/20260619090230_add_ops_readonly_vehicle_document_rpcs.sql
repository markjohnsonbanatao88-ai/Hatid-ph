create or replace function ops.get_ops_vehicles(p_limit integer default 50)
returns table (
  id uuid,
  user_id uuid,
  plate_number text,
  vehicle_type text,
  make text,
  model text,
  color text,
  year integer,
  capacity integer,
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
  select vehicle.id,
         vehicle.user_id,
         vehicle.plate_number,
         vehicle.vehicle_type,
         vehicle.make,
         vehicle.model,
         vehicle.color,
         vehicle.year,
         vehicle.capacity,
         vehicle.status,
         vehicle.created_at,
         vehicle.updated_at
  from driver.vehicles vehicle
  order by vehicle.created_at desc
  limit p_limit;
end;
$$;

create or replace function ops.get_ops_driver_documents(p_limit integer default 50)
returns table (
  id uuid,
  user_id uuid,
  vehicle_id uuid,
  document_type text,
  storage_path text,
  file_name text,
  mime_type text,
  status text,
  rejection_reason text,
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
  select doc.id,
         doc.user_id,
         doc.vehicle_id,
         doc.document_type,
         doc.storage_path,
         doc.file_name,
         doc.mime_type,
         doc.status,
         doc.rejection_reason,
         doc.created_at,
         doc.updated_at
  from driver.documents doc
  order by doc.created_at desc
  limit p_limit;
end;
$$;
