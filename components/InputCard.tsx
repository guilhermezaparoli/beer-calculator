import {  InputHTMLAttributes } from "react"

type InputCardProps = InputHTMLAttributes<HTMLInputElement>

export function InputCard({...rest}: InputCardProps){

    return<div>

        <input className="bg-gray300 rounded-[4px] p-2 w-full text-white outline-none" {...rest}/>

    </div> 
}