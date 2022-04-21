CREATE MIGRATION m1vgituovm3bextaqquavpr7r6xzsojjjuizspmkyyq5evweuuhycq
    ONTO m1s44oki2aihkslwj4zpxl6464fxqxcdafbtp23ch6bffuwsrnu2za
{
  ALTER TYPE default::BlogPost {
      ALTER PROPERTY content {
          SET default := '';
      };
  };
  ALTER TYPE default::BlogPost {
      ALTER PROPERTY title {
          SET default := 'Untitled';
      };
  };
};
