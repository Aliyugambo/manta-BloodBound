/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of all registered users
 *     description: Returns a list of all users from the database including their ID, email, role, first name, and last name.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: usr_12345
 *                   email:
 *                     type: string
 *                     example: john@example.com
 *                   role:
 *                     type: string
 *                     example: donor
 *                   firstname:
 *                     type: string
 *                     example: John
 *                   lastname:
 *                     type: string
 *                     example: Doe
 *       400:
 *         description: Error fetching data
 */
import { NextRequest, NextResponse } from 'next/server';
import manta from '../../../lib/mantaClient';


// GET /api/users
export async function GET(req: NextRequest) {
  try {
    const users = await manta.fetchAllRecords({
      table: 'users',
      fields: ['id', 'email', 'role', 'firstname', 'lastname'],
    });
    return NextResponse.json(users || [], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Error fetching data' }, { status: 400 });
  }
}







