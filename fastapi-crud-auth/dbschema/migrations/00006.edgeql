CREATE MIGRATION m16r77gz27jqnlos6std4s2ich5ecmxkidbe5vrel2jef23trmtpia
    ONTO m1dbl7go74lax7a3a7knyduto3ivka4jxfyzcexvzzhozc7ycftada
{
  ALTER TYPE default::AuditLog RENAME TO default::Auditable;
};
