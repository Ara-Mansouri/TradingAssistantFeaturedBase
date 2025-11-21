import { errorMap } from "./errorMap";

export function translateFieldError(field: string,message: string,tErr: any,tLabels: any) 
{
  if (message === "required") 
  {
    return tErr("required", { field: tLabels(`${field}Label`) });
  }

  const translationKey = errorMap[message];

  if (translationKey) 
  {
    return tErr(translationKey);
  }

  return tErr("generic");
}
