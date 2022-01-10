use serde::{Deserialize, Serialize};
use serde_json::Result;
use std::collections::HashMap;

#[derive(Serialize, Deserialize)]
pub struct Service {
    version: String,
    repository: String,
    workspaces: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Config {
    dependencies: HashMap<String, Service>,
    environment_identifier: String,
    output: String,
}

impl Config {
    pub fn new(
        dependencies: Option<HashMap<String, Service>>,
        environment_identifier: Option<String>,
        output: Option<String>,
    ) -> Config {
        Config {
            dependencies: match dependencies {
                Some(dependencies) => dependencies,
                None => hashmap! {},
            },
            environment_identifier: match environment_identifier {
                Some(environment_identifier) => environment_identifier,
                None => "process.env.NODE_ENV".to_string(),
            },
            output: match output {
                Some(output) => output,
                None => "./endpoints/".to_string(),
            },
        }
    }
    pub fn push(&mut self, name: String, version: String, repository: String, workspace: String) {
        self.dependencies.insert(
            name,
            Service {
                version,
                repository,
                workspaces: vec![workspace],
            },
        );
    }

    pub fn publish(&self) -> Result<String> {
        serde_json::to_string_pretty(self)
    }
}

#[test]
fn test_config_new() {
    let config = Config::new(None, None, None);
    let json = config.publish();
    // json_pretty!(json)がほしい
    assert_eq!(json.unwrap(), "{\n  \"dependencies\": {},\n  \"environment_identifier\": \"process.env.NODE_ENV\",\n  \"output\": \"./endpoints/\"\n}");
}

#[test]
fn test_config_push() {
    let mut config = Config::new(
        Some(hashmap! {
            "mes".to_string() => Service {
                version: "1.0.0".to_string(),
                repository: "git@github.com:matsuri-tech/endpoints-sdk-cli.git".to_string(),
                workspaces: Vec::new(),
            }
        }),
        Some("process.env.NEXT_ENV".to_string()),
        Some("./src/endpoints/".to_string()),
    );

    config.push(
        "mes".to_string(),
        "2.0.0".to_string(),
        "git@github.com:matsuri-tech/endpoints-sdk-cli.git".to_string(),
        "go".to_string(),
    );

    let json = config.publish().unwrap();
    let result: Config = serde_json::from_str(&json).unwrap();

    assert_eq!(
        result.dependencies["mes"].repository,
        "git@github.com:matsuri-tech/endpoints-sdk-cli.git"
    );
    assert_eq!(result.dependencies["mes"].version, "2.0.0");
    assert_eq!(result.dependencies["mes"].workspaces, vec!["go"]);
    assert_eq!(result.output, "./src/endpoints/");
    assert_eq!(result.environment_identifier, "process.env.NEXT_ENV");
}
