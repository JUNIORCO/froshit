INSERT INTO "University" ("id", "name", "subdomain", "updatedAt")
VALUES
(1, 'Demo University', 'demo', NOW()),
(2, 'McGill University', 'mcgill', NOW()),
(3, 'Concordia University', 'concordia', NOW());

INSERT INTO "Program" ("id", "name", "universityId", "updatedAt")
VALUES
(1, 'Software Engineering', 1, NOW()),
(2, 'Computer Engineering', 2, NOW()),
(3, 'Electrical Engineering', 3, NOW()),
(4, 'History', 1, NOW()),
(5, 'Creative Writing', 2, NOW()),
(6, 'Film', 3, NOW());

INSERT INTO "Frosh" ("id", "name", "description", "universityId", "ticketPrice", "updatedAt")
VALUES
(1, 'Engineering Frosh', 'Some description for engineering frosh', 1, 100, NOW()),
(2, 'Science Frosh', 'Some description for science frosh', 2, 150, NOW()),
(3, 'Arts Frosh', 'Some description for arts frosh', 3, 125, NOW());

INSERT INTO "Event" ("id", "name", "description", "startDate", "endDate", "location", "accessibility", "froshId", "updatedAt")
VALUES
(1, 'Engineering Event', 'Some description for engineering event', NOW(), NOW() + INTERVAL '1 hour', 'Some location', 'Some accessibility', 1, NOW()),
(2, 'Science Event', 'Some description for science event', NOW(), NOW() + INTERVAL '1 hour', 'Some location', 'Some accessibility', 2, NOW()),
(3, 'Arts Event', 'Some description for arts event', NOW() + INTERVAL '26 hours', NOW() + INTERVAL '27 hours', 'Some location', 'Some accessibility', 3, NOW());

INSERT INTO "Team" ("id", "name", "froshId", "updatedAt")
VALUES
(1, 'FC Barcelona', 1, NOW()),
(2, 'Real Madrid', 2, NOW()),
(3, 'Liverpool', 3, NOW());

INSERT INTO "Profile" ("id", "name", "email", "phoneNumber", "role", "paid", "interests", "programId", "universityId", "froshId", "teamId", "updatedAt")
VALUES
(1, 'Lionel Messi', 'messi@barcelona.com', '1234567890', 'Admin', NULL, NULL, NULL, 1, 1, 1, NOW()),
(2, 'Cristiano Ronaldo', 'ronaldo@madrid.com', '1234567891', 'Admin', NULL, NULL, NULL, 2, 2, 2, NOW()),
(3, 'Luis Suarez', 'suarez@liverpool.com', '1234567892', 'Admin', NULL, NULL, NULL, 3, 3, 3, NOW()),

(4, 'Neymar Jr', 'neymar@barcelona.com', '1234567893', 'Organizer', NULL, NULL, NULL, 1, 1, 1, NOW()),
(5, 'Karim Benzema', 'benzema@madrid.com', '1234567894', 'Organizer', NULL, NULL, NULL, 2, 2, 2, NOW()),
(6, 'Fernando Torres', 'torres@liverpool.com', '1234567895', 'Organizer', NULL, NULL, NULL, 3, 3, 3, NOW()),

(7, 'Andres Iniesta', 'iniesta@barcelona.com', '1234567896', 'Leader', NULL, ARRAY ['Travel','Outdoors']::"Interest"[], 1, 1, 1, 1, NOW()),
(8, 'Modric', 'modric@madrid.com', '1234567897', 'Leader', NULL, ARRAY ['Adventure','Hiking']::"Interest"[], 2, 2, 2, 2, NOW()),
(9, 'Steven Gerrard', 'gerrard@liverpool.com', '1234567898', 'Leader', NULL, ARRAY ['Fishing','Hunting']::"Interest"[], 3, 3, 3, 3, NOW()),

(10, 'David Villa', 'villa@barcelona.com', '1234567899', 'Froshee', NULL, ARRAY ['Camping','Beach']::"Interest"[], 1, 1, 1, 1, NOW()),
(11, 'Ronaldo', 'r9@madrid.com', '1234567810', 'Froshee', 0, ARRAY ['Music','Books']::"Interest"[], 2, 2, 2, 2, NOW()),
(12, 'Salah', 'salah@liverpool.com', '1234567811', 'Froshee', 100, ARRAY ['Gaming','Netflix']::"Interest"[], 3, 3, 3, 3, NOW());

INSERT INTO "ResourceTag" ("id", "name", "icon", "universityId", "updatedAt")
VALUES
(1, 'Safety', 'shield-account', 1, NOW()),
(2, 'Chants', 'bullhorn-outline', 2, NOW()),
(3, 'Help', 'help-circle-outline', 3, NOW());

INSERT INTO "Resource" ("id", "resourceTagId", "title", "description", "phoneNumber", "email", "updatedAt")
VALUES
(1, 1, 'Drive Safe', 'Drive safe helps you get home', '1234567890', NULL, NOW()),
(2, 2, 'Engineering Chant', 'Some chant', '1234567890', NULL, NOW()),
(3, 3, 'Some help', 'Some help description', '1234567890', 'something@gmail.com', NOW()),
(4, 1, 'Some safety', 'Something about safety', '1234567890', 'something@gmail.com', NOW());

INSERT INTO "Offer" ("id", "universityId", "title", "description", "location", "provider", "icon", "color", "updatedAt")
VALUES
(1, 1, 'Buy 1 get 1', 'Valid until Aug 31', '88 Harbour Street', 'Starbucks', 'some icon', 'green', NOW()),
(2, 2, 'Half Off Pizza', 'Valid until Aug 31', '88 Harbour Street', 'Some Provider', 'some icon', 'yellow', NOW()),
(3, 3, 'Free Ice Cream', 'Valid until Aug 31', '88 Harbour Street', 'Some Other Provider', 'some icon', 'orange', NOW());
