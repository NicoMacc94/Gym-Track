import { NextRequest } from "next/server";

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || "dev-user";

export const getUserId = (request: NextRequest) => {
  const headerUser = request.headers.get("x-user-id") || request.headers.get("x-userid");
  return (headerUser && headerUser.trim()) || DEFAULT_USER_ID;
};
