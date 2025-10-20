"use client";

// import { useState } from "react";
import { Mutation, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";   
import { loginApi } from "../services/auth.api";

interface LoginPayload
{
    email : string;
    password : string; 
}

export function useLogin(){
  const router = useRouter()
  const mutation = useMutation({
    mutationFn :(payload : LoginPayload) => loginApi(payload),
    onSuccess: (res) =>{
      console.log("Login Succsesful:" , res)
    
  if (res.status === 200) {
       const { accessToken, refreshToken } = res.data;
        localStorage.setItem("accessToken" ,accessToken )
        localStorage.setItem("refreshToken" ,refreshToken )
        router.push("/welcome")
  }

  },
  onError :(err : any) =>
  {
    console.error("Login failed", err)
  },

    });
    return mutation;
  }
