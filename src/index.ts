import * as core from "@actions/core";
import * as github from "@actions/github";
import { checkTitle } from "./validate";

// Function to run the GitHub Action
export function run(): void {
  // Check if the action is triggered on a pull request
  if (!github.context.payload.pull_request) {
    core.setFailed("This action can only be run on pull requests");
    return;
  }

  try {
    // Validate the title of the pull request using the checkTitle function
    checkTitle(github.context.payload.pull_request.title);
  } catch (exc) {
    // If an error occurs during validation, set the action as failed with the error message
    core.setFailed((exc as Error).message);
  }
}

// Run the GitHub Action
run();
