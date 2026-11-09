# Playwright Assignment 2 – Locators Practice

## Overview

This assignment focuses on practicing **Playwright locators and element interactions** using TypeScript.

The test automates a sample web application and demonstrates how to locate and interact with different types of elements, including text fields, checkboxes, radio buttons, date inputs, buttons, navigation elements, and product cards.

The assignment also uses the **Page Object Model (POM)** approach to keep locators and test actions organized and maintainable.

## Technologies

* Playwright
* TypeScript
* Node.js
* Playwright Test
* Page Object Model (POM)

## Project Structure

```text
tests/
└── Assignment2/
    ├── BasePage.ts
    ├── ElementLocators.ts
    ├── RahulLocators.spec.ts
    └── README.md
```

## Assignment Objectives

The main objectives of this assignment are to practice:

* Playwright locator strategies
* `getByRole()`
* `getByLabel()`
* `getByText()`
* CSS locators
* Locator filtering
* Handling duplicate elements
* Form interactions
* Checkboxes
* Radio buttons
* Date inputs
* Button interactions
* Product card filtering
* Assertions
* Page Object Model

## Test Scenario

The test performs the following actions:

1. Opens the Protractor Tutorial application.
2. Verifies that the **Protractor Tutorial** heading is displayed.
3. Enters a name.
4. Enters an email address.
5. Enters a password.
6. Selects the checkbox.
7. Selects the **Female** gender option.
8. Selects the **Employed** employment status.
9. Enters a date of birth.
10. Submits the form.
11. Navigates to the Shop page.
12. Adds **iPhone X** to the cart.
13. Adds **Blackberry** to the cart.
14. Verifies that the checkout/cart count is **2**.

## Locator Examples

### Name field

The name field is scoped to the form to avoid matching another input with the same name:

```ts
page.locator('f
```
