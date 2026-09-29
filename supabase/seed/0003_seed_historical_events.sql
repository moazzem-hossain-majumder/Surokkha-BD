-- (Safe to re-run: rows that already exist are skipped.)
-- Surokkha BD: seed data for historical_events (Phase 5)
--
-- Figures below are drawn from public secondary sources (Wikipedia articles
-- summarizing government/EM-DAT/NOAA/WMO reporting, ReliefWeb/OCHA situation
-- reports, GFDRR/ReliefWeb damage assessments, Banglapedia). Casualty and
-- damage figures for large disasters are frequently disputed between
-- official counts and independent estimates; where sources disagreed by a
-- wide margin, a min/max range is stored and the discrepancy is called out
-- in `note`. These are NOT primary BMD/DDM figures -- P6-4 (verify hazard
-- content and district data against BMD/DDM) should extend to this table
-- before any public/pilot launch. Bangla text is a first-pass translation,
-- not yet reviewed by a native speaker (see memory.md open content questions).

insert into historical_events (hazard_slug, name_en, name_bn, year, deaths_min, deaths_max, affected, damage_usd, district_codes, summary_en, summary_bn, source_name, source_url, note)
select * from (values
  (
    'earthquake', '1897 Great Assam Earthquake', '১৮৯৭ সালের মহা আসাম ভূমিকম্প', 1897,
    1500, null, null, null, array['SYL'],
    'A magnitude-8.0 earthquake centered near the Assam-Bengal border was felt across the region and caused major damage as far as Dhaka, more than 200 km from the epicenter.',
    'আসাম-বাংলা সীমান্তের কাছে কেন্দ্রীভূত মাত্রা ৮.০ ভূমিকম্প এই অঞ্চলে অনুভূত হয় এবং কেন্দ্র থেকে ২০০ কিলোমিটারেরও বেশি দূরে ঢাকা পর্যন্ত ব্যাপক ক্ষতি করে।',
    'Wikipedia, summarizing historical/EM-DAT records', 'https://en.wikipedia.org/wiki/1897_Assam_earthquake',
    'Occurred in undivided Bengal/Assam before Bangladesh existed as a country; casualty figures from this era are approximate.'
  ),
  (
    'earthquake', '1918 Srimangal Earthquake', '১৯১৮ সালের শ্রীমঙ্গল ভূমিকম্প', 1918,
    null, 545, null, null, array['MOU', 'SYL'],
    'A magnitude-7.6 earthquake centered near Srimangal destroyed tea-estate buildings across the Sylhet region.',
    'শ্রীমঙ্গলের কাছে কেন্দ্রীভূত মাত্রা ৭.৬ ভূমিকম্প সিলেট অঞ্চল জুড়ে চা-বাগানের ভবন ধ্বংস করে।',
    'Banglapedia (deaths); contemporary 1918 seismological report (low-casualty account)', 'https://en.banglapedia.org',
    'Sources disagree sharply: a contemporary report describes casualties as "exceedingly small" because the quake struck in daytime when people were outdoors, while Banglapedia records 545 deaths in Sylhet district. Both are shown here; treat the death toll as uncertain.'
  ),
  (
    'cyclone', '1970 Bhola Cyclone', '১৯৭০ সালের ভোলা ঘূর্ণিঝড়', 1970,
    300000, 500000, null, 86400000, array['BHO', 'PAT', 'BAR', 'NOA'],
    'The deadliest tropical cyclone on record. A storm surge over 10 meters high overwhelmed the low-lying islands of the Ganges Delta with almost no warning system in place.',
    'রেকর্ডকৃত ইতিহাসে সবচেয়ে প্রাণঘাতী ঘূর্ণিঝড়। ১০ মিটারেরও বেশি উঁচু জলোচ্ছ্বাস গঙ্গা ব-দ্বীপের নিচু দ্বীপগুলো প্রায় কোনো পূর্বাভাস ছাড়াই প্লাবিত করে।',
    'Wikipedia / NOAA AOML / WMO', 'https://en.wikipedia.org/wiki/1970_Bhola_cyclone',
    'The lack of an early-warning and shelter system was the main reason the death toll was so high; this event directly led to Bangladesh building its current cyclone-shelter network.'
  ),
  (
    'cyclone', '1991 Bangladesh Cyclone', '১৯৯১ সালের বাংলাদেশ ঘূর্ণিঝড়', 1991,
    138866, 140000, 13400000, 1700000000, array['CGRAM', 'COX'],
    'A category 5-equivalent cyclone struck the Chittagong coast with a 6-meter storm surge, leaving as many as 10 million people homeless.',
    'একটি ক্যাটাগরি ৫-সমতুল্য ঘূর্ণিঝড় ৬ মিটার উঁচু জলোচ্ছ্বাসসহ চট্টগ্রাম উপকূলে আঘাত হানে, যাতে প্রায় ১ কোটি মানুষ গৃহহীন হয়।',
    'Wikipedia / NOAA AOML / Britannica', 'https://en.wikipedia.org/wiki/1991_Bangladesh_cyclone',
    'Led to major investment in cyclone shelters and early-warning volunteers (CPP), credited with reducing deaths in later storms of similar strength.'
  ),
  (
    'riverine-flood', '1998 Bangladesh Flood', '১৯৯৮ সালের বাংলাদেশ বন্যা', 1998,
    1050, 1100, 30000000, null, array[]::text[],
    'Monsoon flooding covered over two-thirds of the country for about two months, one of the most extensive floods in the country''s modern history.',
    'বর্ষার বন্যা প্রায় দুই মাস ধরে দেশের দুই-তৃতীয়াংশেরও বেশি এলাকা প্লাবিত করে, যা দেশের আধুনিক ইতিহাসের অন্যতম ব্যাপক বন্যা।',
    'Wikipedia / ReliefWeb', 'https://en.wikipedia.org/wiki/1998_Bangladesh_flood',
    'Despite the huge area affected, relatively few flood deaths were directly attributed to starvation thanks to functioning markets and aid distribution -- often cited as a food-security policy success story.'
  ),
  (
    'cyclone', 'Cyclone Sidr', 'ঘূর্ণিঝড় সিডর', 2007,
    3406, 3447, 7000000, 1700000000, array['BAR', 'PAT', 'JHAL'],
    'A category 4 cyclone hit the southwest coast with winds up to 240 km/h and a storm surge up to 6 meters, but a large-scale evacuation of about 2 million people kept the toll far below 1991''s.',
    'ক্যাটাগরি ৪ ঘূর্ণিঝড়টি ঘণ্টায় ২৪০ কিমি বেগে বাতাস ও ৬ মিটার পর্যন্ত জলোচ্ছ্বাসসহ দক্ষিণ-পশ্চিম উপকূলে আঘাত হানে, তবে প্রায় ২০ লাখ মানুষের বৃহৎ পরিসরে সরিয়ে নেওয়ার কারণে ক্ষয়ক্ষতি ১৯৯১ সালের তুলনায় অনেক কম ছিল।',
    'ReliefWeb / GFDRR damage assessment', 'https://reliefweb.int/report/bangladesh/cyclone-sidr-bangladesh-damage-loss-and-needs-assessment-disaster-recovery-and',
    'Often cited as evidence that Bangladesh''s post-1991 shelter and early-warning investment works: a similarly powerful storm caused about 40x fewer deaths.'
  ),
  (
    'riverine-flood', '2017 Bangladesh Floods', '২০১৭ সালের বাংলাদেশ বন্যা', 2017,
    100, 145, null, null, array['SYL'],
    'Multiple waves of flooding from April through August, including severe landslides in the Chittagong Hill Tracts, affected millions of people across the country.',
    'এপ্রিল থেকে আগস্ট পর্যন্ত একাধিক দফায় বন্যা, চট্টগ্রাম পাহাড়ি অঞ্চলে মারাত্মক ভূমিধসসহ, দেশজুড়ে লক্ষাধিক মানুষকে ক্ষতিগ্রস্ত করে।',
    'ReliefWeb/OCHA situation reports; Wikipedia (2017 South Asian floods)', 'https://en.wikipedia.org/wiki/2017_South_Asian_floods',
    'Death toll and affected-population estimates vary noticeably between situation reports issued at different points in the flood season; figures here are a conservative range from OCHA reporting, not a final count.'
  ),
  (
    'cyclone', 'Cyclone Amphan', 'ঘূর্ণিঝড় আম্পান', 2020,
    20, 26, null, null, array['SAT', 'KHU'],
    'A super cyclone that mainly struck India''s West Bengal coast also caused damage and deaths in southwestern Bangladesh.',
    'একটি সুপার ঘূর্ণিঝড় যা মূলত ভারতের পশ্চিমবঙ্গ উপকূলে আঘাত হানে, বাংলাদেশের দক্ষিণ-পশ্চিমাঞ্চলেও ক্ষয়ক্ষতি ও প্রাণহানি ঘটায়।',
    'Wikipedia (2020 South Asian floods)', 'https://en.wikipedia.org/wiki/2020_South_Asian_floods',
    'Most of Amphan''s casualties and damage were on the Indian side of the border; figures here cover Bangladesh only.'
  ),
  (
    'riverine-flood', '2022 Sylhet Floods', '২০২২ সালের সিলেট বন্যা', 2022,
    141, null, 7200000, null, array['SYL', 'SUN'],
    'Unusually early and heavy monsoon rain caused the worst flooding in living memory in Sylhet and Sunamganj, submerging Sylhet''s airport and rail station.',
    'অস্বাভাবিক প্রাথমিক ও ভারী বর্ষার বৃষ্টি সিলেট ও সুনামগঞ্জে স্মরণকালের ভয়াবহতম বন্যা ঘটায়, যাতে সিলেটের বিমানবন্দর ও রেল স্টেশন পানির নিচে চলে যায়।',
    'Wikipedia (2022 India-Bangladesh floods); OCHA/ReliefWeb', 'https://en.wikipedia.org/wiki/2022_India%E2%80%93Bangladesh_floods',
    null
  ),
  (
    'cyclone', 'Cyclone Sitrang', 'ঘূর্ণিঝড় সিত্রাং', 2022,
    35, null, null, null, array[]::text[],
    'A cyclone made landfall on Bangladesh''s south-central coast in October, an unusually late point in the cyclone season.',
    'অক্টোবরে বাংলাদেশের দক্ষিণ-মধ্য উপকূলে একটি ঘূর্ণিঝড় আঘাত হানে, যা ঘূর্ণিঝড় মৌসুমের জন্য অস্বাভাবিকভাবে দেরিতে ঘটে।',
    'Wikipedia (2022 South Asian floods)', 'https://en.wikipedia.org/wiki/2022_South_Asian_floods',
    'Landfall district(s) not confirmed against a primary source yet -- TODO(source) before relying on this for the district-view filter.'
  )
) as v(hazard_slug, name_en, name_bn, year, deaths_min, deaths_max, affected, damage_usd, district_codes, summary_en, summary_bn, source_name, source_url, note)
where not exists (select 1 from historical_events t where t.name_en = v.name_en and t.year = v.year);
