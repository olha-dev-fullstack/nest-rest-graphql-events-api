INSERT INTO
    "user" (
        "id",
        "username",
        "password",
        "email",
        "firstName",
        "lastName",
        "profileId"
    )
VALUES
    (
        'bc9ec78c-7423-4d54-8125-204d503fb203',
        'e2e-test',
        '$2b$10$5v5ZIVbPGXf0126yUiiys.z/POxSaus.iSbzXj7cTRW9KWGy5bfcq',
        'e2e@test.com',
        'End',
        'To End',
        NULL
    );

INSERT INTO
    "events" (
        "id",
        "description",
        "when",
        "address",
        "name",
        "organizerId"
    )
VALUES
    (
        '3cec8c71-853a-4fc5-ba44-6758919e005f',
        'That is a crazy event, must go there!',
        '2021-04-15 21:00:00',
        'Local St 101',
        'Interesting Party',
        'bc9ec78c-7423-4d54-8125-204d503fb203'
    );

INSERT INTO
    "events" (
        "id",
        "description",
        "when",
        "address",
        "name",
        "organizerId"
    )
VALUES
    (
        'ddfe7286-4433-4e0d-bae0-52a24ef56660',
        'That is a nice event, must go there!',
        '2021-04-15 21:00:00',
        'Local St 101',
        'Interesting Party',
        'bc9ec78c-7423-4d54-8125-204d503fb203'
    )