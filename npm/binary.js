const { Binary } = require("binary-install");
const os = require("os");

const windows = "x86_64-pc-windows-msvc";

const getPlatform = () => {
  const type = os.type();
  const arch = os.arch();

  // https://github.com/nodejs/node/blob/c3664227a83cf009e9a2e1ddeadbd09c14ae466f/deps/uv/src/win/util.c#L1566-L1573
  if (
    (type === "Windows_NT" || type.startsWith("MINGW32_NT-")) &&
    arch === "x64"
  ) {
    return windows;
  }
  if (type === "Linux" && arch === "x64") {
    return "x86_64-unknown-linux-musl";
  }
  if (type === "Linux" && arch === "arm64") {
    return "aarch64-unknown-linux-musl";
  }
  if (type === "Darwin" && (arch === "x64" || arch === "arm64")) {
    return "x86_64-apple-darwin";
  }

  throw new Error(`Unsupported platform: ${type} ${arch}`);
};

const getBinary = () => {
  const platform = getPlatform();
  const pkg = require("./package.json");
  const version = pkg.version;
  const org = "matsuri-tech";
  const name = pkg.name;
  const url = `https://github.com/${org}/${name}/releases/download/v${version}/${name}-v${version}-${platform}.tar.gz`;
  return new Binary(platform === windows ? `${name}.exe` : name, url);
};

const install = () => {
  const binary = getBinary();
  binary.install();
};

const run = () => {
  const binary = getBinary();
  binary.run();
};

module.exports = {
  install,
  run,
};
