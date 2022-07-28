CREATE MIGRATION m1tiyppqnkwswp2gl7q4vooeksdvorlxvrm44trqmdwh7dafeekcua
    ONTO m1tvzynvpvsliv3p6eqxma73lvmky5wujdinflejadgfi4x7k5rrha
{
  ALTER TYPE default::User {
      CREATE MULTI LINK posts := (.<author[IS default::BlogPost]);
  };
};
