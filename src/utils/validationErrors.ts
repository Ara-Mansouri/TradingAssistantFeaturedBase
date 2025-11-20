export function translateFieldError(field: string, message: string, tErr: any, tLabels: any) 
{
  if (message === "required")
    {
    return tErr("required", { field: tLabels(`${field}Label`) });
    }

  if (message === "invalidEmail")
    {
    return tErr("invalidEmail");
    }

  return tErr("generic");
}
