import { NextResponse } from "next/server";
import manta from "../../../../lib/mantaClient";

/**
 * @swagger
 * /profile/update:
 *   post:
 *     summary: Create or update user profile
 *     description: This endpoint allows a user to update their profile or create one if it doesn't exist. Requires a valid JWT token and role.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: The user's role (donor, requester, admin)
 *                 example: donor
 *               firstname:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               bloodgroup:
 *                 type: string
 *                 example: A+
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               city:
 *                 type: string
 *                 example: "Lagos"
 *               state:
 *                 type: string
 *                 example: "Lagos State"
 *               country:
 *                 type: string
 *                 example: "Nigeria"
 *             required:
 *               - role
 *     responses:
 *       200:
 *         description: Profile successfully updated or created.
 *         content:
 *           application/json:
 *             example:
 *               message: "Profile updated successfully"
 *               profile:
 *                 firstname: "John"
 *                 lastname: "Doe"
 *                 bloodgroup: "A+"
 *       400:
 *         description: Invalid or missing input fields
 *         content:
 *           application/json:
 *             example:
 *               error: "Role is required"
 *       401:
 *         description: Unauthorized - invalid or missing JWT token
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid or expired token"
 *       500:
 *         description: Server error during profile update
 *         content:
 *           application/json:
 *             example:
 *               error: "Something went wrong while updating profile"
 */

function decodeJWT(token: string) {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(req: Request) {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  try {
    // ✅ Extract and validate JWT token
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid token" }, { status: 401, headers: corsHeaders });
    }

    const token = authHeader.split(" ")[1];
    const decoded = decodeJWT(token);

    if (!decoded?.email) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401, headers: corsHeaders });
    }

    const userEmail = decoded.email;
    const body = await req.json();
    const { role, ...updateFields } = body;

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400, headers: corsHeaders });
    }

    // ✅ Determine correct Manta table by role
    const tableMap: Record<string, string> = {
      donor: "donors",
      requester: "requesters",
      admin: "admins",
    };
    const tableName = tableMap[role.toLowerCase()];
    if (!tableName) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400, headers: corsHeaders });
    }

    // ✅ Fetch all records in table and find user by email
    const response = (await manta.fetchAllRecords({ table: tableName })) as any;
    const records = response.records || [];
    const userRecord = records.find(
      (r: any) => r.fields?.email?.toLowerCase() === userEmail.toLowerCase()
    );

    if (!userRecord) {
      // 🆕 Create new record if none exists with camelCase fields
      const newProfile = {
        email: userEmail,
        role,
        ...updateFields,
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
        //setupComplete: true,
        availability: role.toLowerCase() === "donor" ? "available" : "",
      };

      await manta.createRecords({ table: tableName, data: [newProfile] });

      return NextResponse.json({
        message: "Profile created successfully",
        profile: newProfile,
      }, { headers: corsHeaders });
    }

    // 🔁 Update existing profile record with camelCase fields
    const updatedProfile = {
      ...userRecord.fields,
      ...updateFields,
      updatedat: new Date().toISOString(),
    };

    await manta.updateRecords({
      table: tableName,
      data: [{ fields: updatedProfile }],
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong while updating profile" }, { status: 500, headers: corsHeaders });
  }
}