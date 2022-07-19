#!/usr/bin/env python3

import random
import sys

import edgedb


def populate_user(db, name):
    with db.with_globals(**{'default::admin_mode': True}) as sdb:
        sdb.execute(
            "insert User { username := <str>$username }",
            username=name,
        )
    with db.with_globals(cur_username=name) as sdb:
        for i in range(10):
            public = random.random() < 0.5
            text = f"{name} task #{i+1}"
            sdb.execute(
                "insert Task { text := <str>$text, public := <bool>$public }",
                text=text,
                public=public,
            )


def main(args):
    names = args[1:]
    if not names:
        print("Usage: populate.py [usernames ...]")
        print("Each username will have a user created and some todo")
        print("items created")
        sys.exit(1)

    db = edgedb.create_client()
    for name in names:
        populate_user(db, name)


if __name__ == "__main__":
    main(sys.argv)
