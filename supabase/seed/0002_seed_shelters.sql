-- Surokkha BD: seed data for shelters (Phase 2)
-- Generated from src/content/shelters.json. This is a small curated sample
-- for the prototype/demo, not an exhaustive list. See architecture.md P2-10.

insert into shelters (name_en, name_bn, type, district_code, location, capacity, contact, accessible, source_name) values
  ('Gabtoli Cyclone Shelter', 'গাবতলী ঘূর্ণিঝড় আশ্রয়কেন্দ্র', 'cyclone', 'BAR', st_setsrid(st_makepoint(90.115, 22.098), 4326)::geography, 800, 'Local Union Parishad', true, 'Surokkha BD curated seed (Phase 2)'),
  ('Patharghata Government Primary School Shelter', 'পাথরঘাটা সরকারি প্রাথমিক বিদ্যালয় আশ্রয়কেন্দ্র', 'cyclone', 'BAR', st_setsrid(st_makepoint(89.9714, 22.1583), 4326)::geography, 500, 'Upazila Disaster Management Committee', false, 'Surokkha BD curated seed (Phase 2)'),
  ('Kuakata Cyclone Shelter', 'কুয়াকাটা ঘূর্ণিঝড় আশ্রয়কেন্দ্র', 'cyclone', 'PAT', st_setsrid(st_makepoint(90.1197, 21.8189), 4326)::geography, 600, 'Local Union Parishad', true, 'Surokkha BD curated seed (Phase 2)'),
  ('Galachipa Multipurpose Shelter', 'গলাচিপা বহুমুখী আশ্রয়কেন্দ্র', 'cyclone', 'PAT', st_setsrid(st_makepoint(90.4167, 22.1667), 4326)::geography, 450, 'Upazila Disaster Management Committee', false, 'Surokkha BD curated seed (Phase 2)'),
  ('Char Fasson Cyclone Shelter', 'চরফ্যাশন ঘূর্ণিঝড় আশ্রয়কেন্দ্র', 'cyclone', 'BHO', st_setsrid(st_makepoint(90.7644, 22.1922), 4326)::geography, 700, 'Local Union Parishad', true, 'Surokkha BD curated seed (Phase 2)'),
  ('Monpura Cyclone Shelter', 'মনপুরা ঘূর্ণিঝড় আশ্রয়কেন্দ্র', 'cyclone', 'BHO', st_setsrid(st_makepoint(90.95, 22.3167), 4326)::geography, 350, 'Local Union Parishad', false, 'Surokkha BD curated seed (Phase 2)'),
  ('Shyamnagar Cyclone Shelter', 'শ্যামনগর ঘূর্ণিঝড় আশ্রয়কেন্দ্র', 'cyclone', 'SAT', st_setsrid(st_makepoint(89.1, 22.3333), 4326)::geography, 500, 'Upazila Disaster Management Committee', true, 'Surokkha BD curated seed (Phase 2)'),
  ('Dacope Multipurpose Shelter', 'দাকোপ বহুমুখী আশ্রয়কেন্দ্র', 'cyclone', 'KHU', st_setsrid(st_makepoint(89.5, 22.5833), 4326)::geography, 400, 'Local Union Parishad', false, 'Surokkha BD curated seed (Phase 2)'),
  ('Kutubdia Cyclone Shelter', 'কুতুবদিয়া ঘূর্ণিঝড় আশ্রয়কেন্দ্র', 'cyclone', 'COX', st_setsrid(st_makepoint(91.85, 21.8167), 4326)::geography, 550, 'Local Union Parishad', true, 'Surokkha BD curated seed (Phase 2)'),
  ('Teknaf Cyclone Shelter', 'টেকনাফ ঘূর্ণিঝড় আশ্রয়কেন্দ্র', 'cyclone', 'COX', st_setsrid(st_makepoint(92.3057, 20.8628), 4326)::geography, 600, 'Upazila Disaster Management Committee', false, 'Surokkha BD curated seed (Phase 2)'),
  ('Sandwip Cyclone Shelter', 'সন্দ্বীপ ঘূর্ণিঝড় আশ্রয়কেন্দ্র', 'cyclone', 'CGRAM', st_setsrid(st_makepoint(91.4333, 22.4833), 4326)::geography, 650, 'Local Union Parishad', true, 'Surokkha BD curated seed (Phase 2)'),
  ('Hatiya Cyclone Shelter', 'হাতিয়া ঘূর্ণিঝড় আশ্রয়কেন্দ্র', 'cyclone', 'NOA', st_setsrid(st_makepoint(91.1167, 22.4333), 4326)::geography, 700, 'Local Union Parishad', false, 'Surokkha BD curated seed (Phase 2)'),
  ('Sunamganj Flood Shelter', 'সুনামগঞ্জ বন্যা আশ্রয়কেন্দ্র', 'flood', 'SUN', st_setsrid(st_makepoint(91.395, 25.0658), 4326)::geography, 400, 'District Disaster Management Committee', true, 'Surokkha BD curated seed (Phase 2)'),
  ('Derai Flood Shelter', 'দিরাই বন্যা আশ্রয়কেন্দ্র', 'flood', 'SUN', st_setsrid(st_makepoint(91.4667, 24.9167), 4326)::geography, 300, 'Upazila Disaster Management Committee', false, 'Surokkha BD curated seed (Phase 2)'),
  ('Sadar Hospital, Barguna', 'সদর হাসপাতাল, বরগুনা', 'hospital', 'BAR', st_setsrid(st_makepoint(90.1121, 22.0953), 4326)::geography, 100, 'Civil Surgeon Office', true, 'Surokkha BD curated seed (Phase 2)'),
  ('Sadar Hospital, Cox''s Bazar', 'সদর হাসপাতাল, কক্সবাজার', 'hospital', 'COX', st_setsrid(st_makepoint(92.0058, 21.4272), 4326)::geography, 250, 'Civil Surgeon Office', true, 'Surokkha BD curated seed (Phase 2)'),
  ('Sadar Hospital, Khulna', 'সদর হাসপাতাল, খুলনা', 'hospital', 'KHU', st_setsrid(st_makepoint(89.5403, 22.8456), 4326)::geography, 400, 'Civil Surgeon Office', true, 'Surokkha BD curated seed (Phase 2)'),
  ('Sadar Hospital, Bandarban', 'সদর হাসপাতাল, বান্দরবান', 'hospital', 'BAN', st_setsrid(st_makepoint(92.2184, 22.1953), 4326)::geography, 100, 'Civil Surgeon Office', false, 'Surokkha BD curated seed (Phase 2)');
