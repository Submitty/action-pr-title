const sysadminTag = "[SYSADMIN ACTION]";
const securityTag = "[SECURITY]";
export const allowedTypes = [
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
export const allowedModules = [
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

// Function to check and validate the pull request title
export function checkTitle(fullTitle: string): true {
  let title = fullTitle;
  let hasSysadminTag = false;
  let hasSecurityTag = false;

  // Check for Sysadmin tag at the beginning of the title
  if (title.startsWith(sysadminTag)) {
    hasSysadminTag = true;
    title = title.substring(sysadminTag.length);

    // Check for space after Sysadmin tag
    if (title.startsWith(" ")) {
      throw new Error(`There should not be a space following ${sysadminTag}.`);
    }
  }

  // Check for Security tag at the beginning of the title
  if (title.startsWith(securityTag)) {
    hasSecurityTag = true;
    title = title.substring(securityTag.length);

    // Check for space after Security tag
    if (title.startsWith(" ")) {
      throw new Error(`There should not be a space following ${securityTag}.`);
    }
  }

  // Check for unexpected space between <TYPE> and <MODULE>
  if (/^\[[a-zA-Z0-9\\/]+:[ ]+[a-zA-Z0-9\\/]+?\]/.test(title)) {
    throw new Error(
      "Unexpected space between <TYPE> and <MODULE> (e.g. [<TYPE>: <MODULE>]), there should be no space (e.g. [<TYPE>:<MODULE>])."
    );
  }

  // Check for the valid PR title format
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

  // Destructure matched groups from regular expression
  const [
    _,
    type,
    module,
    message,
  ] = /^\[([a-zA-Z0-9\\/]+)(?::([a-zA-Z0-9\\/]+))?\] (.*)/.exec(
    title
  ) as RegExpMatchArray;

  // Validate type and module
  const isDependency = type === "Dependency" || type === "DevDependency";
  const minMessageLength = 2;
  const maxMessageLength = isDependency ? 70 : 40;

  // Check if type is valid
  if (!allowedTypes.includes(type)) {
    errors.push(
      `Invalid type, expected one of ${allowedTypes.join(", ")}. Got ${type}.`
    );
  }

  // Check module for Dependency types
  if (isDependency && module !== undefined) {
    errors.push(
      `No allowed module for ${type}, expected [${type}]. Got [${type}:${module}].`
    );
  } else if (!isDependency && !allowedModules.includes(module)) {
    errors.push(
      `Invalid module, expected one of ${allowedModules.join(
        ", "
      )}. Got ${module}.`
    );
  }

  // Check message length
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

  // Throw errors if any
  if (errors.length > 0) {
    throw new Error(
      `Errors detected in title:\n${errors
        .map((str) => `  - ${str}`)
        .join("\n")}`
    );
  }

  return true;
}
