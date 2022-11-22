INSERT INTO "university" ("id", "name", "subdomain")
VALUES
('1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Demo University', 'demo'),
('b6aee9eb-4b71-4704-9079-149cc926204c', 'McGill University', 'mcgill'),
('d253d913-6402-47e0-a62e-7a630ed3cc2a', 'Concordia University', 'concordia');

INSERT INTO "program" ("id", "name", "universityId")
VALUES
('e35550e3-86a9-4d6e-9319-41fc93f05317', 'Software Engineering', '1678f7bf-7a13-477c-942c-c85dcadfdd40'),
('d426a41b-ab8b-4418-b9ce-d295eba022a1', 'Computer Engineering', 'b6aee9eb-4b71-4704-9079-149cc926204c'),
('583a9747-6742-4b90-8df3-3b243c80a811', 'Electrical Engineering', 'd253d913-6402-47e0-a62e-7a630ed3cc2a'),
('c64fd602-58d8-4019-8eea-b408f944a626', 'History', '1678f7bf-7a13-477c-942c-c85dcadfdd40'),
('d4c6feac-0986-47ae-a1b6-a2f524f3232b', 'Creative Writing', 'b6aee9eb-4b71-4704-9079-149cc926204c'),
('20f56f92-93af-4413-8cc7-4e1b6ee893ca', 'Film', 'd253d913-6402-47e0-a62e-7a630ed3cc2a');

INSERT INTO "frosh" ("id", "name", "description", "universityId", "ticketPrice")
VALUES
('7419eddd-46ab-49c7-811a-042e476d09b6', 'Engineering Frosh', 'Some description for engineering frosh', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 100),
('f15ba6dc-e5f6-4361-9d4d-57f1d6e0dc72', 'Science Frosh', 'Some description for science frosh', 'b6aee9eb-4b71-4704-9079-149cc926204c', 150),
('7ab8131e-cf25-47ae-b698-efd6e14766a4', 'Arts Frosh', 'Some description for arts frosh', 'd253d913-6402-47e0-a62e-7a630ed3cc2a', 125);

INSERT INTO "event" ("id", "name", "description", "startDate", "endDate", "location", "accessibility", "froshId")
VALUES
('56d629cf-209a-4df3-b300-ac3f6f33163c', 'Engineering Event', 'Some description for engineering event', NOW(), NOW() + INTERVAL '1 hour', 'Some location', 'Some accessibility', '7419eddd-46ab-49c7-811a-042e476d09b6'),
('101dabf2-ff4e-43de-9c40-3f0ff26488eb', 'Science Event', 'Some description for science event', NOW(), NOW() + INTERVAL '1 hour', 'Some location', 'Some accessibility', 'f15ba6dc-e5f6-4361-9d4d-57f1d6e0dc72'),
('eaa801da-8aac-483b-bc43-d8486f7ba4d0', 'Arts Event', 'Some description for arts event', NOW() + INTERVAL '26 hours', NOW() + INTERVAL '27 hours', 'Some location', 'Some accessibility', '7ab8131e-cf25-47ae-b698-efd6e14766a4');

INSERT INTO "team" ("id", "number", "name", "froshId")
VALUES
('b3c4a208-52fc-4064-a43a-0c85be2ce42f', '1', 'FC Barcelona', '7419eddd-46ab-49c7-811a-042e476d09b6'),
('a2d5b5e4-cb50-4eb2-800c-0e2bd61bfb12', '2', 'Real Madrid', 'f15ba6dc-e5f6-4361-9d4d-57f1d6e0dc72'),
('ba2d0f12-f90b-4d0d-a540-83c6f453e995', '3', 'Liverpool', '7ab8131e-cf25-47ae-b698-efd6e14766a4');

INSERT INTO "profile" ("id", "firstName", "lastName", "email", "phoneNumber", "role", "paid", "interests", "programId", "universityId", "froshId", "teamId")
VALUES
('cd9721e9-674c-45d6-91c5-0926ba52fe4d', 'Lionel', 'Messi', 'messi@barcelona.com', '1234567890', 'Admin', NULL, NULL, NULL, '1678f7bf-7a13-477c-942c-c85dcadfdd40', '7419eddd-46ab-49c7-811a-042e476d09b6', 'b3c4a208-52fc-4064-a43a-0c85be2ce42f'),
('5953b9e5-9484-4ba1-bc50-91bad7dc7e4e', 'Cristiano', 'Ronaldo', 'ronaldo@madrid.com', '1234567891', 'Admin', NULL, NULL, NULL, 'b6aee9eb-4b71-4704-9079-149cc926204c', 'f15ba6dc-e5f6-4361-9d4d-57f1d6e0dc72', 'a2d5b5e4-cb50-4eb2-800c-0e2bd61bfb12'),
('04c12425-e4db-4714-a9b3-c70f1e0fe3ba', 'Luis', 'Suarez', 'suarez@liverpool.com', '1234567892', 'Admin', NULL, NULL, NULL, 'd253d913-6402-47e0-a62e-7a630ed3cc2a', '7ab8131e-cf25-47ae-b698-efd6e14766a4', 'ba2d0f12-f90b-4d0d-a540-83c6f453e995'),

('1c7272a5-6346-4eae-9c7f-e63574b20f61', 'Neymar', 'Jr', 'neymar@barcelona.com', '1234567893', 'Organizer', NULL, NULL, NULL, '1678f7bf-7a13-477c-942c-c85dcadfdd40', '7419eddd-46ab-49c7-811a-042e476d09b6', 'b3c4a208-52fc-4064-a43a-0c85be2ce42f'),
('7363173a-9d08-4efb-965d-cfcaf92bbefe', 'Karim', 'Benzema', 'benzema@madrid.com', '1234567894', 'Organizer', NULL, NULL, NULL, 'b6aee9eb-4b71-4704-9079-149cc926204c', 'f15ba6dc-e5f6-4361-9d4d-57f1d6e0dc72', 'a2d5b5e4-cb50-4eb2-800c-0e2bd61bfb12'),
('334e00b6-0745-44f0-8d9b-bc5d8bedb9ba', 'Fernando', 'Torres', 'torres@liverpool.com', '1234567895', 'Organizer', NULL, NULL, NULL, 'd253d913-6402-47e0-a62e-7a630ed3cc2a', '7ab8131e-cf25-47ae-b698-efd6e14766a4', 'ba2d0f12-f90b-4d0d-a540-83c6f453e995'),

('f96892a6-f3f6-426b-86bd-f3da248b11f9', 'Andres', 'Iniesta', 'iniesta@barcelona.com', '1234567896', 'Leader', NULL, ARRAY ['Travel','Outdoors']::"Interest"[], 'e35550e3-86a9-4d6e-9319-41fc93f05317', '1678f7bf-7a13-477c-942c-c85dcadfdd40', '7419eddd-46ab-49c7-811a-042e476d09b6', 'b3c4a208-52fc-4064-a43a-0c85be2ce42f'),
('b51c31b6-199b-42c7-9ba1-a41ec1766747', 'Modric', 'Modric', 'modric@madrid.com', '1234567897', 'Leader', NULL, ARRAY ['Adventure','Hiking']::"Interest"[], 'd426a41b-ab8b-4418-b9ce-d295eba022a1', 'b6aee9eb-4b71-4704-9079-149cc926204c', 'f15ba6dc-e5f6-4361-9d4d-57f1d6e0dc72', 'a2d5b5e4-cb50-4eb2-800c-0e2bd61bfb12'),
('54d92c76-4790-4562-8296-3e570e0bea10', 'Steven', 'Gerrard', 'gerrard@liverpool.com', '1234567898', 'Leader', NULL, ARRAY ['Fishing','Hunting']::"Interest"[], '583a9747-6742-4b90-8df3-3b243c80a811', 'd253d913-6402-47e0-a62e-7a630ed3cc2a', '7ab8131e-cf25-47ae-b698-efd6e14766a4', 'ba2d0f12-f90b-4d0d-a540-83c6f453e995'),

('51880f8c-45da-4197-9e22-764c472a0a11', 'David', 'Villa', 'villa@barcelona.com', '1234567899', 'Froshee', NULL, ARRAY ['Camping','Beach']::"Interest"[], 'e35550e3-86a9-4d6e-9319-41fc93f05317', '1678f7bf-7a13-477c-942c-c85dcadfdd40', '7419eddd-46ab-49c7-811a-042e476d09b6', 'b3c4a208-52fc-4064-a43a-0c85be2ce42f'),
('fd622850-7ce6-4baf-9a75-f15264305983', 'Brazilian', 'Ronaldo', 'r9@madrid.com', '1234567810', 'Froshee', 0, ARRAY ['Music','Books']::"Interest"[], 'd426a41b-ab8b-4418-b9ce-d295eba022a1', 'b6aee9eb-4b71-4704-9079-149cc926204c', 'f15ba6dc-e5f6-4361-9d4d-57f1d6e0dc72', 'a2d5b5e4-cb50-4eb2-800c-0e2bd61bfb12'),
('ab49c575-7655-4372-9e59-24fd6f32e8ea', 'Mo', 'Salah', 'salah@liverpool.com', '1234567811', 'Froshee', 100, ARRAY ['Gaming','Netflix']::"Interest"[], '583a9747-6742-4b90-8df3-3b243c80a811', 'd253d913-6402-47e0-a62e-7a630ed3cc2a', '7ab8131e-cf25-47ae-b698-efd6e14766a4', 'ba2d0f12-f90b-4d0d-a540-83c6f453e995');

INSERT INTO "resource_tag" ("id", "name", "icon")
VALUES
('b10a053e-7ba7-485c-bcd7-3669b45b3596', 'Safety', 'shield-account'),
('2d54fc40-8a93-48b7-8490-4a9242cfc310', 'Chants', 'bullhorn-outline'),
('6367edcf-cc27-4de0-bb71-73fe24008bac', 'Help', 'help-circle-outline');

INSERT INTO "resource" ("id", "resourceTagId", "universityId", "title", "description", "phoneNumber", "email")
VALUES
('1f760197-dbe1-4300-84dc-0f6f7c417416', 'b10a053e-7ba7-485c-bcd7-3669b45b3596', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Drive Safe', 'Drive safe helps you get home', '1234567890', NULL),
('d8f9966d-6a3d-4dea-a3b9-e34a6d865bb2', '2d54fc40-8a93-48b7-8490-4a9242cfc310', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Engineering Chant', 'Some chant', '1234567890', NULL),
('c0db8960-be94-48e0-8212-6a78adff7a29', '6367edcf-cc27-4de0-bb71-73fe24008bac', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Some help', 'Some help description', '1234567890', 'something@gmail.com'),
('963ef58a-1c09-4852-bd75-3171439a3ac8', 'b10a053e-7ba7-485c-bcd7-3669b45b3596', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Some safety', 'Something about safety', '1234567890', 'something@gmail.com');

INSERT INTO "offer" ("id", "universityId", "title", "description", "location", "provider", "icon", "color")
VALUES
('2a0ed98b-5a9b-4e68-b846-a15a4c1df906', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Buy 1 get 1', 'Valid until Aug 31', '88 Harbour Street', 'Starbucks', 'some icon', 'green'),
('78a2cfa9-f977-455d-926e-0f71ffa44836', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Buy 1 get 1/2 Price', 'Valid until Aug 31', '88 Harbour Street', 'Starbucks', 'some icon', 'green'),
('446fa741-ad0d-4998-976e-6b3ed07a48d4', '1678f7bf-7a13-477c-942c-c85dcadfdd40', 'Free Pizza Slice', 'Valid until Aug 31', '88 Harbour Street', 'Starbucks', 'some icon', 'green'),
('283f9277-89c7-43ff-9dca-db7101b33817', 'b6aee9eb-4b71-4704-9079-149cc926204c', 'Half Off Pizza', 'Valid until Aug 31', '88 Harbour Street', 'Some Provider', 'some icon', 'yellow'),
('e5a29fd5-44a2-40ba-80c7-34538a1f3f69', 'd253d913-6402-47e0-a62e-7a630ed3cc2a', 'Free Ice Cream', 'Valid until Aug 31', '88 Harbour Street', 'Some Other Provider', 'some icon', 'orange');
