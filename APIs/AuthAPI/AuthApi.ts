// Lines 1-17 are not visible in the screenshot; this header is my reconstruction
import { APIRequestContext, expect, request } from "@playwright/test";

const BASE_URL= "https://rahulshettyacademy.com";     

export type loginCredentials ={
  userEmail: string;
  userPassword: string;
}

export class AuthApi {
  private constructor(private readonly apiContext: APIRequestContext) {}

  static async create(): Promise<AuthApi> {
      const apiContext = await request.newContext({baseURL: BASE_URL});

    return new AuthApi(apiContext);
  }   

  async login({ userEmail, userPassword }: loginCredentials): Promise<string> {
    const loginResponse = await this.apiContext.post("/api/ecom/auth/login", {
      data: { userEmail, userPassword },
    });

    expect(loginResponse.ok(), `Login Failed for ${userEmail}`).toBeTruthy();

    const loginResponseJson = await loginResponse.json();
    expect(
      loginResponseJson.token,
      "Login response missing token"
    ).toBeTruthy();

    return loginResponseJson.token as string;
  }

    async dispose(): Promise<void> {
    await this.apiContext.dispose();
  }
  async expectLoginRejected({
  userEmail,
  userPassword,
}: loginCredentials): Promise<void> {
  const loginResponse = await this.apiContext.post(
    "/api/ecom/auth/login",
    {
      data: {
        userEmail,
        userPassword,
      },
    }
  );

  expect(loginResponse.ok()).toBeFalsy();
}
}

