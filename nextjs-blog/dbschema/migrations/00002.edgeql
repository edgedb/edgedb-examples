CREATE MIGRATION m1xt5nrizxohwyh4rg3ulwgimc56n4gduss344ncoha5bmeidetcva
    ONTO m1prjlzk6hbd3lutbny63ogirg4yukcclr5vcz5g7lkelnveorfjla
{
  ALTER TYPE default::User {
      ALTER LINK posts {
          USING (.<author[IS default::Post]);
      };
  };
};
