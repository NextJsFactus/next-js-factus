import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const company = await prisma.company.findFirst();
    return NextResponse.json(company);
  } catch (error) {
    console.error("Error al obtener datos de la empresa:", error);
    return NextResponse.json(
      { error: "Error al obtener datos de la empresa" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    
    // Validación básica
    if (!data.name || !data.nit || !data.email) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        urllogo: data.urllogo,
        name: data.name,
        nit: data.nit,
        phone: data.phone,
        address: data.address,
        email: data.email
      }
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error("Error al crear empresa:", error);
    return NextResponse.json(
      { error: "Error al crear empresa" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: "ID de empresa requerido" },
        { status: 400 }
      );
    }

    const company = await prisma.company.update({
      where: { id: data.id },
      data: {
        urllogo: data.urllogo,
        name: data.name,
        nit: data.nit,
        phone: data.phone,
        address: data.address,
        email: data.email
      }
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    return NextResponse.json(
      { error: "Error al actualizar empresa" },
      { status: 500 }
    );
  }
}