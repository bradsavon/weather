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
            where: { email: session.user.email },
            include: {
                locations: {
                    orderBy: [
                        { isDefault: "desc" },
                        { createdAt: "asc" }
                    ]
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user.locations);
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { name, latitude, longitude, isDefault } = await req.json();

        if (!name || latitude === undefined || longitude === undefined) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.location.updateMany({
                where: { userId: user.id },
                data: { isDefault: false }
            });
        }

        const location = await prisma.location.create({
            data: {
                userId: user.id,
                name,
                latitude,
                longitude,
                isDefault: isDefault || false
            }
        });

        return NextResponse.json(location, { status: 201 });
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

        const { id, isDefault } = await req.json();

        if (!id) {
            return NextResponse.json(
                { message: "Missing location ID" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Verify location belongs to user
        const location = await prisma.location.findFirst({
            where: { id, userId: user.id }
        });

        if (!location) {
            return NextResponse.json(
                { message: "Location not found" },
                { status: 404 }
            );
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.location.updateMany({
                where: { userId: user.id },
                data: { isDefault: false }
            });
        }

        const updatedLocation = await prisma.location.update({
            where: { id },
            data: { isDefault }
        });

        return NextResponse.json(updatedLocation);
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "Missing location ID" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Verify location belongs to user
        const location = await prisma.location.findFirst({
            where: { id, userId: user.id }
        });

        if (!location) {
            return NextResponse.json(
                { message: "Location not found" },
                { status: 404 }
            );
        }

        await prisma.location.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Location deleted" });
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
