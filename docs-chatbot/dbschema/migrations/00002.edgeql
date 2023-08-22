CREATE MIGRATION m1d3iwfexif6tgb4bsrwzhosvla7tyqbgl6by456jrkkjqwhvofmza
    ONTO m1yyvsjcusq5fnhgr7lx64omtbhs7uhow2y35wpo4gi5ajfiynjs4a
{
  ALTER TYPE default::Section {
      DROP PROPERTY path;
  };
};
