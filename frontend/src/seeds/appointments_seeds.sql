INSERT INTO appointments (id, time, day_id) VALUES (1,'12pm', 1);
INSERT INTO appointments (id, time, day_id) VALUES (2,'1pm', 2);
INSERT INTO appointments (id, time, day_id) VALUES (3,'2pm', 3);
INSERT INTO appointments (id, time, day_id) VALUES (4,'3pm', 4);
INSERT INTO appointments (id, time, day_id) VALUES (5,'4pm', 5);
INSERT INTO appointments (id, time, day_id) VALUES (6,'5pm', 5);
INSERT INTO appointments (id, time, day_id) VALUES (7,'2pm', 1);

ALTER SEQUENCE appointments_id_seq RESTART WITH 8;

