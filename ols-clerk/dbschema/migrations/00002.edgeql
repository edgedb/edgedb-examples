CREATE MIGRATION m1yo4rx3ittdlcln4wsb6w6xcyxlrhgx66dcz6qdrg77daojwd4pqa
    ONTO m1enig2ckrp5rhrjh2r6bdjp6ozmbyzp3n5ootq7mzvpn7xjzlzyna
{
  ALTER TYPE default::BlogPost {
      CREATE REQUIRED LINK author -> default::User {
          SET REQUIRED USING (std::assert_single(default::User));
      };
  };
};
