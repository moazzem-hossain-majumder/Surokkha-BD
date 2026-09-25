-- Surokkha BD: helper RPC so the admin dashboard can insert a shelter with a
-- plain lat/lng, without building PostGIS geography literals in application code.
create or replace function insert_shelter_point(
  p_name_en text, p_name_bn text, p_type text, p_district_code text,
  p_lat float, p_lng float, p_capacity int, p_contact text, p_accessible boolean, p_source_name text
)
returns uuid
language plpgsql
security invoker -- runs as the calling user, so RLS on `shelters` still applies
as $$
declare
  new_id uuid;
begin
  insert into shelters (name_en, name_bn, type, district_code, location, capacity, contact, accessible, source_name)
  values (
    p_name_en, p_name_bn, p_type, p_district_code,
    st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography,
    p_capacity, p_contact, p_accessible, p_source_name
  )
  returning id into new_id;
  return new_id;
end;
$$;
