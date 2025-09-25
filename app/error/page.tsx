'use client'
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ErrorPage() {
    return (
        <div className="flex flex-col justify-center items-center h-screen gap-5">
            <p>Sorry, something went wrong</p>
            <Button onClick={() => redirect('/')}>Go back home</Button>
        </div>
    )

}