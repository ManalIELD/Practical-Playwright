import {test, expect} from "@playwright/test";
import {UserLoginPage} from "./UserLoginPage";

const users = [
    "standard_user",
    "locked_out_user",
    "problem_user",
    "performance_glitch_user",
    "error_user",
    "visual_user"
];

const password = "secret_sauce";
test.use({
      launchOptions: {slowMo: 800 }           

}
);

// testcase for user able to open website and loaded successfully 
test ("user can open the website to login ", async ({page}) => {
      const userLoginPage = new UserLoginPage(page, "standard_user", "secret_sauce");
      await userLoginPage.open();
  // assertions 
    // asert page is loaded
      await expect(page.locator('.login_logo')).toHaveText('Swag Labs');
// assert elemments are loaded 
      await expect(page.getByPlaceholder('Username')).toHaveAttribute('id', 'user-name');  // got from inspect
      await expect(page.getByPlaceholder('Password')).toHaveAttribute('id', 'password'); // got from inspect
      await expect(page.getByRole('button', { name: 'Login' })).toHaveAttribute('id', 'login-button');
});

//testcase for user able to login with all accepted user names and invalid username  and redirecteed successfully  for each username to the correct page
users.forEach((username) => {

    test(`user can login with ${username}`, async ({ page }) => {

        const userLoginPage = new UserLoginPage(
            page,
            username,          
            password
        );

        await userLoginPage.open();
        await userLoginPage.userLogin();
if (username === "locked_out_user") {

    await expect(
        page.getByText("Epic sadface")
    ).toContainText(
        "Sorry, this user has been locked out."
    );

} else {

    await expect(page).toHaveURL(
        "https://www.saucedemo.com/inventory.html"
    );
 } 
});
 });


//testcase for user after successful login the redirected page is loaded successfully 

test ("Page after user is redirected is successfully loaded ", async ({page}) => {
      const userLoginPage = new UserLoginPage(page, "standard_user", "secret_sauce");
      await userLoginPage.open();
      await userLoginPage.userLogin();
      //use redirected function to check if user is redirected successfully 
      await userLoginPage.userRedirectedSuccessfully();

      // assert that cart button is loaded 
    await expect(page
                  .getByRole('button', { name: 'Cart, empty' }))
                  .toHaveAttribute('aria-label', 'Cart, empty');
});
