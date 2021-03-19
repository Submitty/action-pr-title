const sysadminTag = '[SYSADMIN ACTION]';
const allowedTypes = [
  'Bugfix',
  'Feature',
  'Refactor',
  'Testing',
  'Documentation',
  'VPAT',
  'UI/UX',
  'Dependency',
  'DevDependency',
];
const allowedModules = [
  'Submission',
  'Autograding',
  'Forum',
  'Notifications',
  'TAGrading',
  'InstructorUI',
  'SubminiPolls',
  'HelpQueue',
  'CourseMaterials',
  'Plagiarism',
  'RainbowGrades',
  'System',
  'Developer',
  'API',
];

export function checkTitle(fullTitle: string) {
  let title = fullTitle;
  let hasSysadminTag = false;

  if (title.startsWith(sysadminTag)) {
    hasSysadminTag = true;
    title = title.substring(sysadminTag.length)
    if (title.startsWith(' ')) {
      throw new Error(`There should not be a space between ${sysadminTag} and [<TYPE>:<MODULE>]`)
    }
  }

  if (!/^\[[a-zA-Z\/]+(?::[a-zA-Z]+)?\] /.test(title)) {
    throw new Error(`Invalid title format, must start with ${hasSysadminTag ? sysadminTag : ''}[<TYPE>:<MODULE>] and have space before description`);
  }

  const [_, type, module, message] = title.match(/^\[([a-zA-Z\/]+)(?::([a-zA-Z\/]+))?\] (.*)/) as RegExpMatchArray;

  const isDependency = type === 'Dependency' || 'DevDependency';
  const minMessageLength = 2;
  const maxMessageLength = isDependency ? 70 : 40;

  if (!allowedTypes.includes(type)) {
    throw new Error(`Invalid type, expected one of ${allowedTypes.join(', ')}. Got ${type}.`);
  }

  if (isDependency) {
    if (module !== undefined) {
      throw new Error(`No allowed module for ${type}. Got [${type}:${module}].`);
    }
  } else if (!allowedModules.includes(module)) {
    throw new Error(`Invalid module, expected one of ${allowedModules.join(', ')}. Got ${module}.`);
  }

  if (message.length < minMessageLength) {
    throw new Error(`Too short a message, expected at least ${minMessageLength} characters, got ${message.length} characters`);
  }
  if (message.length > maxMessageLength) {
    throw new Error(`Too long a message, expected at least ${maxMessageLength} characters, got ${message.length} characters`);
  }

  console.log(`[${type}${module ? `:${module}` : ''}] ${message}`);
}
