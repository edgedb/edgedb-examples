CREATE MIGRATION m1tvzynvpvsliv3p6eqxma73lvmky5wujdinflejadgfi4x7k5rrha
    ONTO m1yo4rx3ittdlcln4wsb6w6xcyxlrhgx66dcz6qdrg77daojwd4pqa
{
  CREATE GLOBAL default::current_user -> std::str;
  ALTER TYPE default::BlogPost {
      CREATE ACCESS POLICY own_posts
          ALLOW SELECT USING ((.author ?= (SELECT
              default::User
          FILTER
              (.clerk_id ?= GLOBAL default::current_user)
          )));
      CREATE ACCESS POLICY insert_posts
          ALLOW INSERT ;
  };
};
