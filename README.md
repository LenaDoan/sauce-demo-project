# Sauce Demo Playwright Project

This project contains end-to-end UI tests for the Sauce Demo application using Playwright with JavaScript.

## Overview

The suite covers core user flows such as:
- Login scenarios
- Inventory page interactions
- Page object-based test structure

## Project Structure

- tests/ - Playwright test specs
- pages/ - Page Object Model classes
- fixtures/ - Reusable test fixtures
- utils/ - Helper utilities
- resources/ - Test data and related files
- playwright-report/ - Generated HTML report output

## Prerequisites

Make sure you have the following installed:
- Node.js (version 18 or newer recommended)
- npm

## Installation

Install project dependencies:

```bash
npm install
```

Install Playwright browser binaries:

```bash
npx playwright install
```

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run a specific test file:

```bash
npx playwright test tests/login.spec.js
```

Run tests in a specific browser project:

```bash
npx playwright test --project=chromium
```

## Viewing Reports

After a test run, open the HTML report:

```bash
npx playwright show-report
```

## Notes

The configuration is defined in playwright.config.js and uses the Playwright test runner with HTML reporting enabled.
