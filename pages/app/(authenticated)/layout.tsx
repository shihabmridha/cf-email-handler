import {Header} from "@/components/header"
import {Sidebar} from "@/components/sidebar"
import {redirect} from 'next/navigation';
import React from "react";

function checkAuth() {
    const isAuthenticated = true;
    if (!isAuthenticated) {
        redirect('/home');
    }
}

export default function AuthenticatedLayout({children}: { children: React.ReactNode }) {
    checkAuth();

    return (
        <div className="flex flex-col h-screen">
            <Header/>
            <div className="flex flex-1 overflow-hidden">
                <Sidebar/>
                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    )
}

