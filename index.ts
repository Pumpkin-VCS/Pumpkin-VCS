let args = require("args-parser")(process.argv);
let { Spinner } = require("cli-spinner");
let fs = require("fs");
let path = require("path");

type file = string | object;

interface CommitFS {
  [index: string]: file;
}

interface Commit {
  id: number;
  comment: string;
  files: CommitFS;
}

type BranchName = string;

interface Branch {
  name: BranchName;
  commits: Commit[];
}

type Upstream = string | null;

interface Repo {
  branches: Branch[];
  upstream: Upstream;
}

function getSpinner(job: String) {
  var spinner = new Spinner(job + " %s ");
  spinner.setSpinnerString(18);
  return spinner;
}

function assert(condition: String, message = "Assertion failed") {
  if (!condition) {
    throw new Error(message);
  }
}

if (args.initialize) {
  let spinner = getSpinner("Creating repo");
  spinner.start();
  let branchName: BranchName = args["branch-name"] || "main";
  let repo: Repo = {
    branches: [{ name: branchName, commits: [] }],
    upstream: null,
  };
  fs.writeFileSync(".pumpkin.json", JSON.stringify(repo));
  spinner.stop();
} else if (args["new-branch"]) {
  let spinner = getSpinner("Creating branch");
  spinner.start();
  let repoDirectory = args["repo-directory"] || ".";
  assert(args["branch-name"], "Branch name required");
  let branchName: BranchName = args["branch-name"];
  let _path = path.join(repoDirectory, ".pumpkin.json");
  let json = JSON.parse(fs.readFileSync(_path, "utf8"));
  let newBranch: Branch[] = [{ name: branchName, commits: [] }];
  json.branches.push(newBranch);
  fs.writeFileSync(_path, JSON.stringify(json));
  spinner.stop();
}
