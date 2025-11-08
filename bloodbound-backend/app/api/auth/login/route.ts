/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user and return a JWT token
 *     description: This endpoint authenticates a user using their email and password. On successful authentication, it returns a JWT token along with basic user information.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token and user data
 *         content:
 *           application/json:
 *             example:
 *               message: "Login successful"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 email: "user@example.com"
 *                 name: "John Doe"
 *       400:
 *         description: Missing email or password in request
 *         content:
 *           application/json:
 *             example:
 *               error: "Email and password are required"
 *       401:
 *         description: Authentication failed due to invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               error: "Login failed"
 *               details: {}
 *       500:
 *         description: Internal server error or unable to extract user info
 *         content:
 *           application/json:
 *             example:
 *               error: "Unable to extract user info from token"
 */

import { NextResponse } from "next/server";
import manta from "../../../../lib/mantaClient";

//  Helper function to decode JWT token returned from Manta
function decodeJWT(token: string) {
  const [, payload] = token.split(".");
  return JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Authenticate user through Manta Auth service
    const baseUrl = process.env.MANTA_AUTH_BASE_URL?.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();
    console.log("Manta login response:", result);

    if (!res.ok || !result?.token) {
      return NextResponse.json(
        { error: result.message || "Login failed", details: result },
        { status: 401 }
      );
    }

    // Decode token to get email
    const decoded = decodeJWT(result.token);
    const userEmail = decoded.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unable to extract user info from token" },
        { status: 500 }
      );
    }

    // Try to find user in your Manta 'users' table
       let userRecord = null;
       try {
        const usersResponse = await manta.fetchAllRecords({ table: "users" }) as any;
        const users = usersResponse?.records || [];

        userRecord = users.find(
            (u: any) =>
            u.fields?.email?.toLowerCase() === userEmail.toLowerCase()
        );
        } catch (err) {
        console.warn("Could not fetch users table:", err);
        }

    // Return token and basic user data
    return NextResponse.json({
      message: "Login successful",
      token: result.token,
      user: {
        email: userEmail,
        ...(userRecord ? userRecord.fields : {}),
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}