'use server';

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function registerUser(formData: any) {
  const { name, email, password } = formData;

  if (!name || !email || !password) {
    return { error: "Todos los campos son obligatorios" };
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "El correo electrónico ya está registrado" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // El primer usuario será ADMIN, los demás USER
    const userCount = await db.user.count();
    const role = userCount === 0 ? "ADMIN" : "USER";

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return { success: "Usuario registrado con éxito" };
  } catch (error) {
    console.error("Error en registro:", error);
    return { error: "Ocurrió un error al registrar el usuario" };
  }
}

export async function loginUser(formData: any) {
  const { email, password } = formData;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/store",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas" };
        default:
          return { error: "Algo salió mal" };
      }
    }
    throw error;
  }
}
