CREATE MIGRATION m1dbl7go74lax7a3a7knyduto3ivka4jxfyzcexvzzhozc7ycftada
    ONTO m1oe66ebzkfe3pjwiq2yxr6pmfdp5ltnv3hdhzb5snicxaiz3yjvaq
{
  ALTER TYPE default::Event {
      ALTER LINK host {
          RESET OPTIONALITY;
      };
  };
};
