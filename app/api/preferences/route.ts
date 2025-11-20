import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
            select: {
                temperatureUnit: true,
                theme: true,
                widgetPreferences: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { temperatureUnit, theme, widgetPreferences } = await req.json();

        const user = await prisma.user.update({
            where: {
                email: session.user.email,
            },
            data: {
                ...(temperatureUnit && { temperatureUnit }),
                ...(theme && { theme }),
                ...(widgetPreferences && { widgetPreferences: JSON.stringify(widgetPreferences) }),
            },
            select: {
                temperatureUnit: true,
                theme: true,
                widgetPreferences: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
