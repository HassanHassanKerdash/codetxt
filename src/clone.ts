import { simpleGit } from "simple-git";

export async function cloneRepo(
  url: string,
  localPath: string,
  branch?: string
): Promise<void> {
  const git = simpleGit();
  const options = ["--depth", "1", "--single-branch"];
  if (branch) {
    options.push("--branch", branch);
  }

  try {
    await git.clone(url, localPath, options);
  } catch (error) {
    throw new Error(
      `Failed to clone repository. Is the URL correct and the repository public? \n  Details: ${error}`
    );
  }
}
