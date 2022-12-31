INSERT INTO "university" ("id", "name", "subdomain", "imageUrl", "color", "stripeConnectedAccountId", "stripeConnectedAccountLink")
VALUES
('1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Demo University', 'demo', 'https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/demo/logo.png', '#4f23b8', 'acct_TEST_DEMO', 'google.com');

INSERT INTO "frosh" ("id", "name", "description", "stripeProductId", "stripePriceId", "price", "universityId")
VALUES
('7419eddd-46ab-49c7-811a-042e476d09b6', 'Engineering Frosh', 'Some description for engineering froshs', 'product_ENG_FROSH', 'price_ENG_FROSH', 200, '1678f7bf-7a13-477c-942c-c85dcadfdd40');

INSERT INTO "event" ("id", "name", "description", "startDate", "endDate", "location", "accessibility", "imageUrl")
VALUES
('56d629cf-209a-4df3-b300-ac3f6f33163c', 'Engineering Event', 'Some description for engineering event', NOW(), NOW() + INTERVAL '1 hour', 'Some location', 'Some accessibility', NULL),
('101dabf2-ff4e-43de-9c40-3f0ff26488eb', 'Science Event', 'Some description for science event', NOW(), NOW() + INTERVAL '1 hour', 'Some location', 'Some accessibility', NULL),
('eaa801da-8aac-483b-bc43-d8486f7ba4d0', 'Arts Event', 'Some description for arts event', NOW() + INTERVAL '26 hours', NOW() + INTERVAL '27 hours', 'Some location', 'Some accessibility', NULL);

INSERT INTO "_EventToFrosh" ("A", "B")
VALUES
('56d629cf-209a-4df3-b300-ac3f6f33163c', '7419eddd-46ab-49c7-811a-042e476d09b6');

INSERT INTO "team" ("id", "number", "name", "froshId")
VALUES
('b3c4a208-52fc-4064-a43a-0c85be2ce42f', '1', 'FC Barcelona', '7419eddd-46ab-49c7-811a-042e476d09b6');

INSERT INTO "payment" ("id", "amount", "type", "stripePaymentIntentId")
VALUES
('2669a659-8a6f-4627-87ef-4e5a22c69ded', 200, 'Online', 'somePaymentIntentId1'),
('a4ac36c4-fadb-40cc-90a2-d852d6a17c04', 200, 'Online', 'somePaymentIntentId2'),
('421ad690-51df-4c1c-85c9-b4a63c0ad76d', 200, 'Online', 'somePaymentIntentId3');

INSERT INTO "profile" ("id", "firstName", "lastName", "email", "phoneNumber", "role", "interests", "program", "imageUrl", "universityId", "froshId", "teamId", "paymentId")
VALUES
('cd9721e9-674c-45d6-91c5-0926ba52fe4d', 'Lionel', 'Messi', 'messi@barcelona.com', NULL, 'Organizer', NULL, NULL, NULL, '1678f7bf-7a13-477c-942c-c85dcadfdd40', '7419eddd-46ab-49c7-811a-042e476d09b6', 'b3c4a208-52fc-4064-a43a-0c85be2ce42f', NULL),
('1c7272a5-6346-4eae-9c7f-e63574b20f61', 'Neymar', 'Jr', 'neymar@barcelona.com', NULL, 'Organizer', NULL, NULL, NULL, '1678f7bf-7a13-477c-942c-c85dcadfdd40', '7419eddd-46ab-49c7-811a-042e476d09b6', 'b3c4a208-52fc-4064-a43a-0c85be2ce42f', NULL),
('f96892a6-f3f6-426b-86bd-f3da248b11f9', 'Andres', 'Iniesta', 'iniesta@barcelona.com', '1234567896', 'Leader', 'Travel, Outdoors', 'Software Engineering', 'e35550e3-86a9-4d6e-9319-41fc93f05317', '1678f7bf-7a13-477c-942c-c85dcadfdd40', '7419eddd-46ab-49c7-811a-042e476d09b6', 'b3c4a208-52fc-4064-a43a-0c85be2ce42f', NULL),
('51880f8c-45da-4197-9e22-764c472a0a11', 'David', 'Villa', 'villa@barcelona.com', '1234567899', 'Froshee', 'Travel, Outdoors', 'Computer Engineering', 'e35550e3-86a9-4d6e-9319-41fc93f05317', '1678f7bf-7a13-477c-942c-c85dcadfdd40', '7419eddd-46ab-49c7-811a-042e476d09b6', 'b3c4a208-52fc-4064-a43a-0c85be2ce42f', '2669a659-8a6f-4627-87ef-4e5a22c69ded'),
('85604444-71ad-41ae-9c57-2fe4c8f460bf', 'Thierry', 'Henry', 'henry@barcelona.com', '1234567710', 'Froshee', 'Travel, Outdoors', 'Software Engineering', 'e35550e3-86a9-4d6e-9319-41fc93f05317', '1678f7bf-7a13-477c-942c-c85dcadfdd40', '7419eddd-46ab-49c7-811a-042e476d09b6', 'b3c4a208-52fc-4064-a43a-0c85be2ce42f', 'a4ac36c4-fadb-40cc-90a2-d852d6a17c04'),
('3459f221-4068-42e3-a17a-6bb72535090d', 'Zlatan', 'Ibrahimovich', 'zlatan@barcelona.com', '1234567823', 'Froshee', 'Travel, Outdoors', 'Computer Engineering', 'e35550e3-86a9-4d6e-9319-41fc93f05317', '1678f7bf-7a13-477c-942c-c85dcadfdd40', '7419eddd-46ab-49c7-811a-042e476d09b6', 'b3c4a208-52fc-4064-a43a-0c85be2ce42f', '421ad690-51df-4c1c-85c9-b4a63c0ad76d');

INSERT INTO "resource_tag" ("id", "name", "imageUrl")
VALUES
('b10a053e-7ba7-485c-bcd7-3669b45b3596', 'Safety', 'https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/demo/resource_tag/b10a053e-7ba7-485c-bcd7-3669b45b3596.png'),
('2d54fc40-8a93-48b7-8490-4a9242cfc310', 'Chants', 'https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/demo/resource_tag/2d54fc40-8a93-48b7-8490-4a9242cfc310.png'),
('6367edcf-cc27-4de0-bb71-73fe24008bac', 'Help', 'https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/demo/resource_tag/6367edcf-cc27-4de0-bb71-73fe24008bac.png');

INSERT INTO "resource" ("id", "resourceTagId", "universityId", "title", "description", "phoneNumber", "email")
VALUES
('1f760197-dbe1-4300-84dc-0f6f7c417416', 'b10a053e-7ba7-485c-bcd7-3669b45b3596', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Drive Safe', 'Drive safe helps you get home', '1234567890', NULL),
('d8f9966d-6a3d-4dea-a3b9-e34a6d865bb2', '2d54fc40-8a93-48b7-8490-4a9242cfc310', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Engineering Chant', 'Some chant', '1234567890', NULL),
('c0db8960-be94-48e0-8212-6a78adff7a29', '6367edcf-cc27-4de0-bb71-73fe24008bac', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Some help', 'Some help description', '1234567890', 'something@gmail.com'),
('963ef58a-1c09-4852-bd75-3171439a3ac8', 'b10a053e-7ba7-485c-bcd7-3669b45b3596', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Some safety', 'Something about safety', '1234567890', 'something@gmail.com');

INSERT INTO "offer" ("id", "universityId", "title", "description", "location", "provider", "imageUrl", "color")
VALUES
('2a0ed98b-5a9b-4e68-b846-a15a4c1df906', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Buy 1 get 1', 'Valid until Aug 31', '88 Harbour Street', 'Starbucks', 'https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/demo/offer/Starbucks.png?t=2022-12-17T06%3A25%3A29.611Z', 'green'),
('78a2cfa9-f977-455d-926e-0f71ffa44836', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Buy 1 get 1/2 Price', 'Valid until Aug 31', '88 Harbour Street', 'Starbucks', 'https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/demo/offer/Starbucks.png?t=2022-12-17T06%3A25%3A29.611Z', 'green'),
('446fa741-ad0d-4998-976e-6b3ed07a48d4', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Free Pizza Slice', 'Valid until Aug 31', '88 Harbour Street', 'Starbucks', 'https://mybvkrkmvnuzeqvzgbzg.supabase.co/storage/v1/object/public/demo/offer/Starbucks.png?t=2022-12-17T06%3A25%3A29.611Z', 'green'),
