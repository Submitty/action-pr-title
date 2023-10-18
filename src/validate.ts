const sysadminTag = "[SYSADMIN ACTION]";
const securityTag = "[SECURITY]";
const allowedTypes = [
  "Bugfix",
  "Feature",
  "Refactor",
  "Testing",
  "Documentation",
  "VPAT",
  "UI/UX",
  "Dependency",
  "DevDependency",
];
const allowedModules = [
  "Submission",
  "Autograding",
  "Forum",
  "Notifications",
  "TAGrading",
  "InstructorUI",
  "SubminiPolls",
  "HelpQueue",
  "CourseMaterials",
  "Plagiarism",
  "RainbowGrades",
  "Calendar",
  "System",
  "Developer",
  "API",
];

export function checkTitle(fullTitle: string): true {
  let title = fullTitle;
  let hasSysadminTag = false;
  let hasSecurityTag = false;
  if (title.startsWith(sysadminTag)) {
    hasSysadminTag = true;
    title = title.substring(sysadminTag.length);
    if (title.startsWith(" ")) {
      throw new Error(`There should not be a space following ${sysadminTag}.`);
    }
  }

  if (title.startsWith(securityTag)) {
    hasSecurityTag = true;
    title = title.substring(securityTag.length);
    if (title.startsWith(" ")) {
      throw new Error(`There should not be a space following ${securityTag}.`);
    }
  }

  if (/^\[[a-zA-Z0-9\\/]+:[ ]+[a-zA-Z0-9\\/]+?\]/.test(title)) {
    throw new Error(
      "Unexpected space between <TYPE> and <MODULE> (e.g. [<TYPE>: <MODULE>]), there should be no space (e.g. [<TYPE>:<MODULE>])."
    );
  }

  if (!/^\[[a-zA-Z0-9\\/]+(?::[a-zA-Z0-9\\/]+)?\] /.test(title)) {
    throw new Error(
      `Invalid PR title format. ${
        hasSysadminTag
          ? `Your title must start with ${sysadminTag} and`
          : hasSecurityTag
          ? `Your title must start with ${securityTag} and`
          : "Your title"
      } should adhere to the format: [<TYPE>:<MODULE>] <SUBJECT> followed by a space before the description.\n` +
        `Where <TYPE> is one of: ${allowedTypes.join(", ")}\n` +
        `And <MODULE> is one of: ${allowedModules.join(", ")}\n` +
        `For detailed guidelines, refer to https://submitty.org/developer/getting_started/make_a_pull_request.`
    );
  }

  const errors = [];

  const [
    _,
    type,
    module,
    message,
  ] = /^\[([a-zA-Z0-9\\/]+)(?::([a-zA-Z0-9\\/]+))?\] (.*)/.exec(
    title
  ) as RegExpMatchArray;

  const isDependency = type === "Dependency" || type === "DevDependency";
  const minMessageLength = 2;
  const maxMessageLength = isDependency ? 70 : 40;

  if (!allowedTypes.includes(type)) {
    errors.push(
      `Invalid type, expected one of ${allowedTypes.join(", ")}. Got ${type}.`
    );
  }

  if (isDependency) {
    if (module !== undefined) {
      errors.push(
        `No allowed module for ${type}, expected [${type}]. Got [${type}:${module}].`
      );
    }
  } else if (!allowedModules.includes(module)) {
    errors.push(
      `Invalid module, expected one of ${allowedModules.join(
        ", "
      )}. Got ${module}.`
    );
  }

  if (message.length < minMessageLength) {
    errors.push(
      `Too short a message, expected at least ${minMessageLength} characters, got ${message.length} characters.`
    );
  }
  if (message.length > maxMessageLength) {
    errors.push(
      `Too long a message, expected at most ${maxMessageLength} characters, got ${message.length} characters.`
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `Errors detected in title:\n${errors
        .map((str) => `  - ${str}`)
        .join("\n")}`
    );
  }

  return true;
}
