import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function setAuthCookies(res : NextResponse , access : string , refresh : string)
{
    res.cookies.set("accessToken",access,{
        httpOnly : true ,
        secure : true ,
        sameSite : "lax",
        path :   "/" ,
        maxAge : 60 * 60 ,


    });

    res.cookies.set("refreshToken",refresh,{
       httpOnly : true ,
        secure : true ,
        sameSite : "lax",
        path :   "/" ,
        maxAge : 60 * 60 * 24  ,

    });
}

export function clearAuthCookies (res : NextResponse)
{
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");

}