CREATE MIGRATION m1pht25sdxgo7tw3loovimnppi7v6schpwpp2moqirw2seuib66r6a
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity;
  };
};
