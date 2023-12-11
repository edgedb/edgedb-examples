export const transformSearchParams = (
  searchParams: URLSearchParams
): { [key: string]: string | string[] | undefined } =>
  Object.entries(searchParams).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );

export const transformSearchParams2 = (
  searchParams: URLSearchParams
): { [key: string]: string | string[] | undefined } => {
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    Object.assign(params, { [key]: value });
  }

  return params;
};
