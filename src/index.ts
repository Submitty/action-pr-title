import * as core from '@actions/core';
import * as github from '@actions/github';
import { checkTitle } from './validate';

export function run() {
  if (!github.context.payload.pull_request) {
    core.setFailed('This action can only be run on pull requests');
    return;
  }
  try {
    checkTitle(github.context.payload.pull_request.title);
  } catch (exc) {
    core.setFailed((exc as Error).message);
  }
}

run();
