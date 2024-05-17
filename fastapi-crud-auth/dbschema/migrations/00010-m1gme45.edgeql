CREATE MIGRATION m1gme45vmspnh7htkkqp627x4ksu7g2hgwchbpzcf6vvlu2fcie3yq
    ONTO m1co2rsosgepnjltxdv47gcdsawsfrjang4kwebko5c5oqugxrtnua
{
  ALTER TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity {
          SET REQUIRED USING (<ext::auth::Identity>{});
      };
  };
  CREATE GLOBAL default::current_user := (std::assert_single((SELECT
      default::User {
          id,
          name
      }
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
};
