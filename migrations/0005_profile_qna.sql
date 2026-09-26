-- Seed interactive magazine Q&A blocks that feed the unified Coffee & Me profile.

UPDATE cms_articles
SET content_json = json_set(
  content_json,
  '$.profileQuestion',
  json('{
    "enabled": true,
    "key": "caffeine.sleep",
    "title": "قهوه عصر روی خواب تو چه اثری می‌ذاره؟",
    "description": "جوابت فقط برای شخصی‌تر کردن تجربه EL.SEED استفاده می‌شه.",
    "options": [
      {"value":"none","label":"تقریباً هیچ اثری نداره"},
      {"value":"sometimes","label":"بعضی وقت‌ها خوابم رو عقب می‌اندازه"},
      {"value":"yes","label":"واضحاً روی خوابم اثر می‌ذاره"},
      {"value":"unknown","label":"هنوز مطمئن نیستم"}
    ]
  }'),
  '$.updatedBy', 'interactive-profile'
),
updated_at = datetime('now')
WHERE slug = 'caffeine-and-sleep';

UPDATE cms_articles
SET content_json = json_set(
  content_json,
  '$.profileQuestion',
  json('{
    "enabled": true,
    "key": "habit.afternoon",
    "title": "قهوه عصر برای تو بیشتر چه نقشی داره؟",
    "description": "این جواب کمک می‌کنه مقاله‌ها و پیشنهادهای بعدی به ریتم روز تو نزدیک‌تر بشن.",
    "options": [
      {"value":"energy","label":"برای انرژی"},
      {"value":"focus","label":"برای تمرکز"},
      {"value":"social","label":"برای معاشرت و حال خوب"},
      {"value":"taste","label":"فقط برای مزه"}
    ]
  }')
),
updated_at = datetime('now')
WHERE slug = 'afternoon-coffee';

UPDATE cms_articles
SET content_json = json_set(
  content_json,
  '$.profileQuestion',
  json('{
    "enabled": true,
    "key": "taste.bitterness",
    "title": "فنجان تو بیشتر تلخه یا گس؟",
    "description": "این فرق برای تشخیص بعدی خیلی مهمه و به پروفایل قهوه‌ای تو اضافه می‌شه.",
    "options": [
      {"value":"bitter","label":"بیشتر تلخه"},
      {"value":"dry","label":"بیشتر گسه و دهن رو خشک می‌کنه"},
      {"value":"both","label":"هر دو رو حس می‌کنم"},
      {"value":"unknown","label":"فرقشون رو دقیق نمی‌دونم"}
    ]
  }')
),
updated_at = datetime('now')
WHERE slug = 'coffee-too-bitter';
