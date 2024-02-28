export function transformSearchParams(searchParams: URLSearchParams): {
  [key: string]: string | string[] | undefined;
} {
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    Object.assign(params, { [key]: value });
  }

  return params;
}

export function parseError(e: any) {
  let err: any = e instanceof Error ? e.message : String(e);

  try {
    err = JSON.parse(err);
  } catch {}

  return err?.error?.message ?? JSON.stringify(err);
}
