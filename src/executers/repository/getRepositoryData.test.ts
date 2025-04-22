import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRepositoryData } from "./getRepositoryData";
import { EndpointSetting } from "../../model/endpoint";

const mocks = vi.hoisted(() => {
  return {
    readFileSync: vi.fn(),
    spawnSync: vi.fn(),
    execSync: vi.fn(),
  };
});

vi.mock("fs", () => {
  return {
    readFileSync: mocks.readFileSync,
  };
});

vi.mock("child_process", () => {
  return {
    spawnSync: mocks.spawnSync,
    execSync: mocks.execSync,
  };
});

describe("getRepositoryData", () => {
  const repositoryPath = "/mock/repo/path";
  const branchName = "main";
  const workspace = "src";
  const commitHash = "123456";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should checkout and read endpoint settings from the specified file", async () => {
    const mockSetting: EndpointSetting = {};

    // Mocking fs.readFileSync to return endpoint settings JSON
    mocks.readFileSync.mockReturnValue(JSON.stringify(mockSetting));

    // Mocking Git commands
    mocks.spawnSync
      .mockImplementationOnce(() => ({ status: 0 })) // Mock `git checkout`
      .mockImplementationOnce(() => ({ status: 0 })); // Mock `git reset`

    const result = await getRepositoryData(
      repositoryPath,
      branchName,
      workspace,
      commitHash,
    );

    // Asserting the returned data matches the mocked settings
    expect(result).toEqual(mockSetting);

    // Checking correct Git commands were called
    expect(mocks.spawnSync).toHaveBeenCalledWith(
      "git",
      ["checkout", branchName],
      { cwd: repositoryPath },
    );
    expect(mocks.spawnSync).toHaveBeenCalledWith(
      "git",
      ["reset", "--hard", commitHash],
      { cwd: repositoryPath },
    );
    expect(mocks.readFileSync).toHaveBeenCalledWith(
      `${repositoryPath}/${workspace}/.endpoints.json`,
      "utf-8",
    );
  });

  it("should throw an error if checkout fails", async () => {
    mocks.spawnSync.mockReturnValueOnce({
      status: 1,
      stderr: Buffer.from("checkout error"),
    });

    await expect(
      getRepositoryData(repositoryPath, branchName, workspace),
    ).rejects.toThrow("Failed to checkout");

    expect(mocks.spawnSync).toHaveBeenCalledWith(
      "git",
      ["checkout", branchName],
      { cwd: repositoryPath },
    );
  });

  it("should throw an error if reset fails", async () => {
    mocks.spawnSync
      .mockReturnValueOnce({ status: 0 }) // Mock `git checkout`
      .mockReturnValueOnce({ status: 1, stderr: Buffer.from("reset error") }); // Mock `git reset`

    await expect(
      getRepositoryData(repositoryPath, branchName, workspace, commitHash),
    ).rejects.toThrow("Failed to git reset");

    expect(mocks.spawnSync).toHaveBeenCalledWith(
      "git",
      ["reset", "--hard", commitHash],
      { cwd: repositoryPath },
    );
  });
});
