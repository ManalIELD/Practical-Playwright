import { APIRequestContext, expect, request } from "@playwright/test";

const BASE_URL = "https://rahulshettyacademy.com";

export type RegisterCredentials = {
  firstName: string;
  lastName: string;
  userEmail: string;
  userRole: string;
  occupation: string;
  gender: string;
  userMobile: string;
  userPassword: string;
  confirmPassword: string;
  required: boolean;
};

export class RegisterApi {
  private constructor(
    private readonly apiContext: APIRequestContext
  ) {}

  static async create(): Promise<RegisterApi> {
    const apiContext = await request.newContext({
      baseURL: BASE_URL,
    });

    return new RegisterApi(apiContext);
  }

  async register({
    firstName,
    lastName,
    userEmail,
    userRole,
    occupation,
    gender,
    userMobile,
    userPassword,
    confirmPassword,
    required,
  }: RegisterCredentials): Promise<void> {
    const registerResponse = await this.apiContext.post(
      "/api/ecom/auth/register",
      {
        data: {
          firstName,
          lastName,
          userEmail,
          userRole,
          occupation,
          gender,
          userMobile,
          userPassword,
          confirmPassword,
          required,
        },
      }
    );

    expect(
      registerResponse.ok(),
      `User already exisits with this Email Id! . Status: ${registerResponse.status()}`
    ).toBeTruthy();
  }

  async dispose(): Promise<void> {
    await this.apiContext.dispose();
  }
}