CREATE MIGRATION m1uz7lxdlyj6imr5kgx7uueoaxc3kw5jy2d4lp6gdmyxhob5dcrvlq
    ONTO m1tiyppqnkwswp2gl7q4vooeksdvorlxvrm44trqmdwh7dafeekcua
{
  ALTER TYPE default::BlogPost {
      ALTER ACCESS POLICY own_posts ALLOW SELECT, UPDATE, DELETE;
  };
};
