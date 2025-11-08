/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user and returns basic details.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: MyPass123
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: donor
 *     responses:
 *       200:
 *         description: Successful registration
 *       400:
 *         description: Invalid input
 */
import { NextResponse } from "next/server";
import manta from "../../../../lib/mantaClient";

// Helper function to decode JWT token returned from Manta
function decodeJWT(token: string) {
  const [, payload] = token.split(".");
  return JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
}

// POST /api/auth/signup
export async function POST(req: Request) {
  try {
    const { email, password, firstname, lastname, role } = await req.json();

    // Call Manta Auth Service
    const baseUrl = process.env.MANTA_AUTH_BASE_URL?.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstname, lastname, role }),
    });

    const result = await res.json();
    //console.log("Manta signup response:", result);

    if (!res.ok || !result?.token) {
      return NextResponse.json(
        { error: result.message || "Signup failed", details: result },
        { status: 400 }
      );
    }

    // Decode token to extract user info (since Manta doesn't return user object)
    const decoded: any = decodeJWT(result.token);
    //console.log("Decoded token:", decoded);

    const user = {
      email: decoded.email,
      firstname: decoded.firstname,
      lastname: decoded.lastname,
      role: decoded.role
    };

    // Respond with success
    return NextResponse.json({
      message: "User created successfully",
      user,
      //token: result.token,
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}