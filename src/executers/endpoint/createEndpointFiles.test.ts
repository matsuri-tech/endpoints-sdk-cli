import { expect, test, vi } from "vitest";
import { Service } from "../../model/config";
import { EndpointSetting } from "../../model/endpoint";
import { createEndpointFiles } from "./createEndpointFiles";

const mocks = vi.hoisted(() => {
  return {
    detectMainBranch: vi.fn(),
    cloneRepository: vi.fn(),
    getRepositoryData: vi.fn(),
    getHeadCommitHash: vi.fn(),
  };
});

vi.mock("../repository", () => {
  return {
    detectMainBranch: mocks.detectMainBranch,
    cloneRepository: mocks.cloneRepository,
    getRepositoryData: mocks.getRepositoryData,
    getHeadCommitHash: mocks.getHeadCommitHash,
  };
});

const setupMockReturnValuesOnce = (
  endpointSetting: EndpointSetting,
  mainBranch: string,
  cacheDirectory: string,
  headCommmitHash?: string,
) => {
  mocks.cloneRepository.mockReturnValueOnce(cacheDirectory);
  mocks.detectMainBranch.mockReturnValueOnce(mainBranch);
  mocks.getRepositoryData.mockReturnValueOnce(endpointSetting);
  if (headCommmitHash !== undefined) {
    mocks.getHeadCommitHash.mockReturnValue(headCommmitHash);
  }
};

test("Verify that createEndpointFiles works correctly", async () => {
  const repositoryAlias = "test-repo";
  const service: Service = {
    repository: "test-repo-url",
    roots: {},
    version: "v1",
    workspaces: ["workspace1"],
    exclude_periods: [],
  };
  const environmentIdentifier = "process.env.test_env";
  const output = "./.test-output";

  const repositoryData: EndpointSetting = {
    v1: {
      env: {
        test: "test",
      },
      api: {
        test: {
          method: "get",
          path: "/test",
          desc: "",
        },
      },
    },
  };

  setupMockReturnValuesOnce(repositoryData, "main", "test-repo-path");

  const result = await createEndpointFiles(
    repositoryAlias,
    service,
    environmentIdentifier,
    output,
  );

  expect(result).toEqual({
    ...service,
    version: "v1",
    branch: "main",
  });
});

test("Should handle no service.version", async () => {
  const repositoryAlias = "test-repo";
  const service: Service = {
    repository: "test-repo-url",
    roots: {},
    exclude_periods: [],
  };
  const environmentIdentifier = "process.env.test_env";
  const output = "./.test-output";

  const repositoryData: EndpointSetting = {
    v1: {
      env: {
        test: "test",
      },
      api: {
        test: {
          method: "get",
          path: "/test",
          desc: "",
        },
      },
    },
  };

  setupMockReturnValuesOnce(repositoryData, "main", "test-repo-path", "v1");

  const result = await createEndpointFiles(
    repositoryAlias,
    service,
    environmentIdentifier,
    output,
  );

  expect(result).toEqual({
    ...service,
    version: "v1",
    branch: "main",
  });
});

test("Exclude periods", async () => {
  const repositoryAlias = "test-repo";
  const service: Service = {
    repository: "test-repo-url",
    roots: {},
    exclude_periods: ["v1"],
  };
  const environmentIdentifier = "process.env.test_env";
  const output = "./.test-output";

  const repositoryData: EndpointSetting = {
    v1: {
      env: {
        test: "test",
      },
      api: {
        test: {
          method: "get",
          path: "/test",
          desc: "",
        },
      },
    },
  };

  setupMockReturnValuesOnce(repositoryData, "main", "test-repo-path");

  const result = await createEndpointFiles(
    repositoryAlias,
    service,
    environmentIdentifier,
    output,
  );

  expect(result).toEqual({
    ...service,
    version: "v1",
    branch: "main",
  });
});

test("Should handle no env", async () => {
  const repositoryAlias = "test-repo";
  const service: Service = {
    repository: "test-repo-url",
    roots: {},
  };
  const environmentIdentifier = "process.env.test-env";
  const output = "./.test-output";

  const repositoryData: EndpointSetting = {
    v1: {
      env: undefined,
      api: {
        test: {
          method: "get",
          path: "/test",
          desc: "",
        },
      },
    },
  };

  setupMockReturnValuesOnce(repositoryData, "main", "test-repo-path");

  const result = await createEndpointFiles(
    repositoryAlias,
    service,
    environmentIdentifier,
    output,
  );

  expect(result).toEqual({
    ...service,
    version: "v1",
    branch: "main",
  });
});
