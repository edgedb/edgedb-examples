CREATE MIGRATION m1zhhtjnse6muychjq5ikafibpd3chyh6a4nrv3kg7xadhrrm5hy7a
    ONTO m1jpdkambyjpwefvdkwxk6zanbokogphprdhs2qwv3l4n5kw5qkqbq
{
  ALTER TYPE default::Actor {
      DROP ANNOTATION std::description;
      DROP PROPERTY age;
      DROP PROPERTY height;
      DROP PROPERTY name;
  };
  ALTER TYPE default::Auditable {
      DROP PROPERTY created_at;
      DROP ANNOTATION std::description;
  };
  DROP TYPE default::Actor;
  DROP TYPE default::Auditable;
};
