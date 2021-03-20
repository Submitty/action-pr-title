import { expect } from "chai";
import { checkTitle } from "../src/validate";

describe("validate", () => {
  describe("checkTitle", () => {
    describe("passing", () => {
      [
        "[Refactor:Autograding] xxxx",
        "[Bugfix:Submission] xxxx",
        "[VPAT:InstructorUI] xxxx",
        "[UI/UX:API] xxxx",
        "[Bugfix:SubminiPolls] xxxx",
        "[Feature:HelpQueue] xxxx",
        "[SYSADMIN ACTION][Refactor:Autograding] xxxx",
        "[DevDependency] xxxx",
        "[Dependency] xxxx",
        "[Bugfix:Submission] 0123456789012345678901234567890123456789",
        "[Dependency] 0123456789012345678901234567890123456789012345678901234567890123456789",
      ].forEach((value) => {
        it(`checkTitle should return true: ${value}`, () => {
          expect(checkTitle(value)).to.be.true;
        });
      });
    });

    describe("throws", () => {
      [
        [
          "[UI//UX:API] xxxx",
          "Invalid type, expected one of Bugfix, Feature, Refactor, Testing, Documentation, VPAT, UI/UX, Dependency, DevDependency. Got UI//UX.",
        ],
        [
          "[UI\\/UX:API] xxxx",
          "Invalid title format, must start with [<TYPE>:<MODULE>] and have space before description.",
        ],
        [
          "[Refactor:RainbowGrades]",
          "Invalid title format, must start with [<TYPE>:<MODULE>] and have space before description.",
        ],
        [
          "[BugFix:TAGrading] xxxx",
          "Invalid type, expected one of Bugfix, Feature, Refactor, Testing, Documentation, VPAT, UI/UX, Dependency, DevDependency. Got BugFix.",
        ],
        [
          "[Dependency:Autograding] xxxx",
          "No allowed module for Dependency, expected [Dependency]. Got [Dependency:Autograding].",
        ],
        [
          "[SYSADMINACTION][Refactor:Autograding] xxxx",
          "Invalid title format, must start with [<TYPE>:<MODULE>] and have space before description.",
        ],
        [
          "[DevDependency:Autograding] xxxx",
          "No allowed module for DevDependency, expected [DevDependency]. Got [DevDependency:Autograding].",
        ],
        [
          "[Bugfix:Submission] a",
          "Too short a message, expected at least 2 characters, got 1 characters.",
        ],
        [
          "[Bugfix:Submission] 01234567890123456789012345678901234567890",
          "Too long a message, expected at most 40 characters, got 41 characters.",
        ],
      ].forEach(([value, expectedException]) => {
        it(`checkTitle should throw: ${value}`, () => {
          expect(() => checkTitle(value)).to.throw(expectedException);
        });
      });
    });
  });
});
