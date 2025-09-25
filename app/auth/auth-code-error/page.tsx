import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthCodeErrorPage() {
    return (
        // Simple error page with options to retry or go home
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
            <div className="flex w-full max-w-sm flex-col gap-6 text-center">
                <h1 className="text-2xl font-bold text-red-500">Authentication Error</h1>
                <p className="text-gray-600">
                    There was an error during the authentication process. This could be due to:
                </p>
                <ul className="text-left text-sm text-gray-500 space-y-2">
                    <li>• The authentication was cancelled</li>
                    <li>• There was a network issue</li>
                    <li>• The OAuth configuration is incorrect</li>
                </ul>

                <div className="flex flex-col gap-3 mt-4">
                    <Button asChild>
                        <Link href="/login">Try Again</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/">Go Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}