import { expect } from "chai";
import { allowedModules, allowedTypes, checkTitle } from "../src/validate";

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
        "[SECURITY][Bugfix:Submission] Some security hole",
        "[SYSADMIN ACTION][SECURITY][Bugfix:Submission] xxxx",
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
      describe("error parsing", () => {
        [
          [
            "[Refactor:RainbowGrades]",
            `Invalid PR title format. ` +
              `Your title should adhere to the format: [<TYPE>:<MODULE>] <SUBJECT> followed by a space before the description.\n` +
              `Where <TYPE> is one of: ${allowedTypes.join(", ")}\n` +
              `And <MODULE> is one of: ${allowedModules.join(", ")}\n` +
              `For detailed guidelines, refer to https://submitty.org/developer/getting_started/make_a_pull_request.`,
          ],
          [
            "[SYSADMINACTION][Refactor:Autograding] xxxx",
            `Invalid PR title format. ` +
              `Your title should adhere to the format: [<TYPE>:<MODULE>] <SUBJECT> followed by a space before the description.\n` +
              `Where <TYPE> is one of: ${allowedTypes.join(", ")}\n` +
              `And <MODULE> is one of: ${allowedModules.join(", ")}\n` +
              `For detailed guidelines, refer to https://submitty.org/developer/getting_started/make_a_pull_request.`,
          ],
          [
            "[SYSADMIN ACTION] [Refactor:Submission] test",
            "There should not be a space following [SYSADMIN ACTION].",
          ],
          [
            "[SYSADMIN ACTION][Refactor:Autograding]foo",
            `Invalid PR title format. ` +
              `Your title must start with [SYSADMIN ACTION] and should adhere to the format: [<TYPE>:<MODULE>] <SUBJECT> followed by a space before the description.\n` +
              `Where <TYPE> is one of: ${allowedTypes.join(", ")}\n` +
              `And <MODULE> is one of: ${allowedModules.join(", ")}\n` +
              `For detailed guidelines, refer to https://submitty.org/developer/getting_started/make_a_pull_request.`,
          ],
          [
            "[SECURITY] [Refactor:Submission] test",
            "There should not be a space following [SECURITY].",
          ],
          [
            "[SECURITY][Refactor:Autograding]foo",
            `Invalid PR title format. ` +
              `Your title must start with [SECURITY] and should adhere to the format: [<TYPE>:<MODULE>] <SUBJECT> followed by a space before the description.\n` +
              `Where <TYPE> is one of: ${allowedTypes.join(", ")}\n` +
              `And <MODULE> is one of: ${allowedModules.join(", ")}\n` +
              `For detailed guidelines, refer to https://submitty.org/developer/getting_started/make_a_pull_request.`,
          ],
          [
            "[Bugfix: Submission] xxx",
            "Unexpected space between <TYPE> and <MODULE> (e.g. [<TYPE>: <MODULE>]), there should be no space (e.g. [<TYPE>:<MODULE>]).",
          ],
          [
            "[SYSADMIN ACTION][SECURITY][Refactor:Autograding]foo",
            `Invalid PR title format. ` +
              `Your title must start with [SYSADMIN ACTION] and should adhere to the format: [<TYPE>:<MODULE>] <SUBJECT> followed by a space before the description.\n` +
              `Where <TYPE> is one of: ${allowedTypes.join(", ")}\n` +
              `And <MODULE> is one of: ${allowedModules.join(", ")}\n` +
              `For detailed guidelines, refer to https://submitty.org/developer/getting_started/make_a_pull_request.`,
          ],
          [
            "[SECURITY][SYSADMIN ACTION][Refactor:Autograding] foo",
            `Invalid PR title format. ` +
              `Your title must start with [SECURITY] and should adhere to the format: [<TYPE>:<MODULE>] <SUBJECT> followed by a space before the description.\n` +
              `Where <TYPE> is one of: ${allowedTypes.join(", ")}\n` +
              `And <MODULE> is one of: ${allowedModules.join(", ")}\n` +
              `For detailed guidelines, refer to https://submitty.org/developer/getting_started/make_a_pull_request.`,
          ],
        ].forEach(([value, expectedException]) => {
          it(`checkTitle should throw: ${value}`, () => {
            expect(() => checkTitle(value)).to.throw(expectedException);
          });
        });
      });

      describe("specific format errors", () => {
        [
          [
            "[UI//UX:API] xxxx",
            "Invalid type, expected one of Bugfix, Feature, Refactor, Testing, Documentation, VPAT, UI/UX, Dependency, DevDependency. Got UI//UX.",
          ],
          [
            "[UI\\/UX:API] xxxx",
            "Invalid type, expected one of Bugfix, Feature, Refactor, Testing, Documentation, VPAT, UI/UX, Dependency, DevDependency. Got UI\\/UX.",
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
            expect(() => checkTitle(value)).to.throw(
              `Errors detected in title:\n  - ${expectedException}`
            );
          });
        });
      });

      it("should show multiple format errors at once", () => {
        expect(() =>
          checkTitle(
            "[Fake:Error] this message is much too long and it should be shortened"
          )
        ).to.throw(`Errors detected in title:
  - Invalid type, expected one of Bugfix, Feature, Refactor, Testing, Documentation, VPAT, UI/UX, Dependency, DevDependency. Got Fake.
  - Invalid module, expected one of Submission, Autograding, Forum, Notifications, TAGrading, InstructorUI, SubminiPolls, HelpQueue, CourseMaterials, Plagiarism, RainbowGrades, Calendar, System, Developer, API. Got Error.
  - Too long a message, expected at most 40 characters, got 56 characters.`);
      });
    });
  });
});
