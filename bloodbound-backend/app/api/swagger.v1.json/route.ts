import { NextResponse } from "next/server";

export async function GET() {
  const { default: swaggerJSDoc } = await import("swagger-jsdoc");

  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "BloodBound API Docs",
      version: "1.0.0",
      description:
        "REST API documentation for BloodBound backend using MantaHQ SDK",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            email: { type: "string", example: "user@example.com" },
            role: { type: "string", example: "donor" },
            firstname: { type: "string", example: "John" },
            lastname: { type: "string", example: "Doe" },
          },
        },
        UpdateProfileRequest: {
          type: "object",
          properties: {
            role: { type: "string", example: "donor" },
            bloodGroup: { type: "string", example: "O+" },
            phone: { type: "string", example: "+2348123456789" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };

  const options = {
    swaggerDefinition,
    apis: ["./app/api/**/*.ts"], // Path to your route files with JSDoc comments
  };

  const swaggerSpec = swaggerJSDoc(options);
  return NextResponse.json(swaggerSpec);
}