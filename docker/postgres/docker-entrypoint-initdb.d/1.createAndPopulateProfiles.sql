CREATE TABLE profiles (
    id int GENERATED ALWAYS AS IDENTITY (START WITH 101) PRIMARY KEY,
    src VARCHAR(500) NOT NULL,
    alt VARCHAR(100) NOT NULL
);

INSERT INTO profiles (src,alt)
VALUES
    ('/images/happy.png','Happy person'),
    ('/images/neutral.png','Neutral person'),
    ('/images/sad.png','Sad person')
;
