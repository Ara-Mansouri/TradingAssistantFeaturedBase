// import { cookies } from "next/headers";
import { NextResponse } from "next/server";


const ACCESS_MAX_AGE = Number(process.env.ACCESS_TOKEN_MAX_AGE);
const REFRESH_MAX_AGE = Number(process.env.REFRESH_TOKEN_MAX_AGE);

export function setAuthCookies(res : NextResponse , access : string , refresh : string)
{
    res.cookies.set("accessToken",access,{
        httpOnly : true ,
        secure : true ,
        sameSite : "lax",
        path :   "/" ,
        maxAge :  ACCESS_MAX_AGE ,


    });

    res.cookies.set("refreshToken",refresh,{
       httpOnly : true ,
        secure : true ,
        sameSite : "lax",
        path :   "/" ,
        maxAge : REFRESH_MAX_AGE  ,

    });
}

export function clearAuthCookies (res : NextResponse)
{
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");

}